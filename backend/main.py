import json
import logging
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import DEFAULT_SCAN_INTERVAL_HOURS
from .db import get_db_connection, log_audit_activity
from .scheduler import scheduler
from .models import IntelligenceStatusResponse, SourceHealthRecord

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("edvora.intelligence_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager: starts scheduler on startup and cleans up on shutdown."""
    logger.info("Starting Edvora Scholarship Intelligence Engine...")
    try:
        from .sync_service import refresh_all_scholarship_statuses
        refresh_all_scholarship_statuses()
    except Exception as e:
        logger.warning(f"Initial status refresh: {e}")
    scheduler.start()
    yield
    logger.info("Stopping Edvora Scholarship Intelligence Engine...")
    scheduler.stop()

app = FastAPI(
    title="Edvora Automated Scholarship Intelligence API",
    description="Automated discovery, extraction, verification, and scheduling engine for scholarships.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite dev server and production clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Intelligence Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/intelligence/status")
async def get_intelligence_status():
    """
    Telemetry endpoint for the Admin Panel showing scheduler health,
    last collection metrics, next scheduled run, sources status, and flagged count.
    """
    conn = get_db_connection()
    try:
        # Total scholarships
        total_count = conn.execute("SELECT COUNT(*) as count FROM scholarships;").fetchone()["count"]
        verified_count = conn.execute("SELECT COUNT(*) as count FROM scholarships WHERE is_verified = 1;").fetchone()["count"]
        flagged_count = conn.execute("SELECT COUNT(*) as count FROM scholarships WHERE review_status = 'flagged_for_review' OR is_verified = 0;").fetchone()["count"]

        # Sources
        sources_rows = conn.execute("SELECT * FROM intelligence_sources ORDER BY priority ASC;").fetchall()
        sources_list = []
        for row in sources_rows:
            sources_list.append({
                "id": row["id"],
                "name": row["name"],
                "url": row["url"],
                "sourceType": row["source_type"],
                "priority": row["priority"],
                "isActive": bool(row["is_active"]),
                "lastScannedAt": row["last_scanned_at"],
                "lastStatus": row["last_status"],
                "errorMessage": row["error_message"],
                "schemesCount": row["schemes_count"],
            })

        # Recent runs
        runs_rows = conn.execute("""
            SELECT * FROM intelligence_runs 
            ORDER BY id DESC LIMIT 5;
        """).fetchall()
        recent_runs = []
        for r in runs_rows:
            recent_runs.append({
                "id": r["id"],
                "startedAt": r["started_at"],
                "completedAt": r["completed_at"],
                "status": r["status"],
                "sourcesChecked": r["sources_checked"],
                "discoveredCount": r["discovered_count"],
                "updatedCount": r["updated_count"],
                "unchangedCount": r["unchanged_count"] if "unchanged_count" in r.keys() and r["unchanged_count"] is not None else 0,
                "failedSources": json.loads(r["failed_sources"] or "[]"),
                "logSummary": r["log_summary"],
                "triggerType": r["trigger_type"],
            })

        last_run = recent_runs[0] if recent_runs else scheduler.last_run_summary
        next_run = scheduler.next_run_time.isoformat() if scheduler.next_run_time else None

        return {
            "isSchedulerActive": scheduler.is_running,
            "isScanningNow": scheduler.is_scanning,
            "intervalHours": scheduler.interval_hours,
            "lastRun": last_run,
            "nextScheduledRun": next_run,
            "totalSources": len(sources_list),
            "activeSources": sum(1 for s in sources_list if s["isActive"]),
            "totalScholarshipsInDb": total_count,
            "verifiedCount": verified_count,
            "flaggedCount": flagged_count,
            "sources": sources_list,
            "recentRuns": recent_runs,
        }
    finally:
        conn.close()

@app.post("/api/intelligence/trigger")
async def trigger_manual_collection(background_tasks: BackgroundTasks):
    """
    Allows the administrator to trigger an immediate intelligence discovery scan.
    """
    if scheduler.is_scanning:
        return {
            "status": "already_in_progress",
            "message": "A discovery cycle is currently running in the background."
        }

    # Run cycle directly in background
    background_tasks.add_task(scheduler.run_cycle, trigger_type="manual")

    return {
        "status": "triggered",
        "message": "Manual scholarship discovery cycle initiated across official sources."
    }

@app.get("/api/intelligence/sources")
async def get_intelligence_sources():
    """Returns the list of monitored official sources and their health."""
    conn = get_db_connection()
    try:
        rows = conn.execute("SELECT * FROM intelligence_sources ORDER BY priority ASC;").fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

@app.get("/api/intelligence/runs")
async def get_intelligence_runs(limit: int = 15):
    """Returns historical collection audit runs."""
    conn = get_db_connection()
    try:
        rows = conn.execute("""
            SELECT * FROM intelligence_runs 
            ORDER BY id DESC LIMIT ?;
        """, (limit,)).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

@app.get("/api/intelligence/flagged")
async def get_flagged_scholarships():
    """Returns scholarships requiring admin review due to incomplete, conflicting, or unverified source data."""
    conn = get_db_connection()
    try:
        rows = conn.execute("""
            SELECT id, slug, name, short_name, provider, state, status,
                   application_deadline, source_url, source_domain,
                   verification_notes, review_status, last_verified_at, is_verified
            FROM scholarships
            WHERE review_status IN ('flagged_for_review', 'pending_review', 'rejected') OR is_verified = 0
            ORDER BY id DESC;
        """).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

class VerifyPayload(BaseModel):
    isVerified: bool = True
    verificationNotes: Optional[str] = "Manually approved by administrator."

class RejectPayload(BaseModel):
    rejectionReason: Optional[str] = "Rejected by administrator: unreliable, duplicate, or invalid information."

@app.post("/api/intelligence/verify/{scholarship_id}")
async def verify_flagged_scholarship(scholarship_id: str, payload: VerifyPayload):
    """Allows an administrator to manually verify and publish a record."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM scholarships WHERE id = ?;", (scholarship_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Scholarship not found.")

        cursor.execute("""
            UPDATE scholarships
            SET is_verified = ?,
                review_status = 'verified',
                verification_notes = ?,
                last_verified_at = ?
            WHERE id = ?;
        """, (1 if payload.isVerified else 0, payload.verificationNotes, datetime.now().isoformat(), scholarship_id))
        conn.commit()

        log_audit_activity(
            "VERIFY",
            "scholarship",
            scholarship_id,
            f"Admin manual verification: {payload.verificationNotes}"
        )

        return {"success": True, "id": scholarship_id, "status": "verified"}
    finally:
        conn.close()

@app.post("/api/intelligence/reject/{scholarship_id}")
async def reject_flagged_scholarship(scholarship_id: str, payload: RejectPayload):
    """Allows an administrator to mark a record as rejected so it is withheld from public display."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM scholarships WHERE id = ?;", (scholarship_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Scholarship not found.")

        cursor.execute("""
            UPDATE scholarships
            SET is_verified = 0,
                review_status = 'rejected',
                verification_notes = ?,
                last_verified_at = ?
            WHERE id = ?;
        """, (payload.rejectionReason, datetime.now().isoformat(), scholarship_id))
        conn.commit()

        log_audit_activity(
            "REJECT",
            "scholarship",
            scholarship_id,
            f"Admin rejected: {payload.rejectionReason}"
        )

        return {"success": True, "id": scholarship_id, "status": "rejected"}
    finally:
        conn.close()

# ---------------------------------------------------------------------------
# Scholarship Public Endpoints (Directly from SQLite)
# ---------------------------------------------------------------------------

def row_to_scholarship_dict(row) -> Dict[str, Any]:
    """Deserializes SQLite row JSON fields into client-compatible format."""
    return {
        "id": row["id"],
        "slug": row["slug"],
        "name": row["name"],
        "shortName": row["short_name"],
        "provider": row["provider"],
        "state": row["state"],
        "type": row["type"],
        "educationLevels": json.loads(row["education_levels"] or "[]"),
        "courses": json.loads(row["courses"] or "[]"),
        "categories": json.loads(row["categories"] or "[]"),
        "genderEligibility": row["gender_eligibility"],
        "incomeLimit": row["income_limit"],
        "minimumPercentage": row["minimum_percentage"],
        "yearEligibility": json.loads(row["year_eligibility"] or "[]"),
        "specialConditions": json.loads(row["special_conditions"] or "{}"),
        "benefits": json.loads(row["benefits"] or "{}"),
        "applicationStart": row["application_start"],
        "applicationDeadline": row["application_deadline"],
        "status": row["status"],
        "documents": json.loads(row["documents"] or "[]"),
        "description": row["description"],
        "whoCanApply": json.loads(row["who_can_apply"] or "[]"),
        "howToApplySteps": json.loads(row["how_to_apply_steps"] or "[]"),
        "officialWebsite": row["official_website"],
        "applicationWebsite": row["application_website"],
        "lastUpdated": row["last_updated"],
        "tags": json.loads(row["tags"] or "[]"),
        "isVerified": bool(row["is_verified"]),
        "isFeatured": bool(row["is_featured"]),
        "sourceUrl": row["source_url"] if "source_url" in row.keys() else None,
        "sourceDomain": row["source_domain"] if "source_domain" in row.keys() else None,
        "reviewStatus": row["review_status"] if "review_status" in row.keys() else "verified",
        "verificationNotes": row["verification_notes"] if "verification_notes" in row.keys() else None,
    }

@app.get("/api/scholarships")
async def list_scholarships(
    state: Optional[str] = None,
    education: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    include_unverified: bool = False
):
    """
    Returns scholarships. By default, returns ONLY verified records.
    Unverified, pending-review, and rejected scholarships are strictly excluded from public display.
    """
    conn = get_db_connection()
    try:
        if include_unverified:
            rows = conn.execute("SELECT * FROM scholarships ORDER BY name ASC;").fetchall()
        else:
            rows = conn.execute("""
                SELECT * FROM scholarships 
                WHERE (is_verified = 1 OR is_verified IS NULL) 
                  AND (review_status IS NULL OR review_status = 'verified')
                  AND (review_status != 'rejected' OR review_status IS NULL)
                ORDER BY name ASC;
            """).fetchall()

        results = [row_to_scholarship_dict(r) for r in rows]

        if state and state.lower() != "all":
            results = [s for s in results if s["state"].lower() == state.lower()]
        if status and status.lower() != "all":
            results = [s for s in results if s["status"].lower() == status.lower()]

        return results
    finally:
        conn.close()

@app.get("/api/scholarships/{id_or_slug}")
async def get_scholarship(id_or_slug: str):
    """Returns a single scholarship by ID or Slug."""
    conn = get_db_connection()
    try:
        row = conn.execute(
            "SELECT * FROM scholarships WHERE id = ? OR slug = ? LIMIT 1;",
            (id_or_slug, id_or_slug)
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Scholarship not found.")

        return row_to_scholarship_dict(row)
    finally:
        conn.close()
