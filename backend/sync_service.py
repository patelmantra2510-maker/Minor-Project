import json
import logging
from datetime import datetime
from typing import Tuple, Dict, Any, Optional
from .db import get_db_connection, log_audit_activity
from .models import ExtractedScholarship
from .verifier import verify_scholarship
from .extractors.html_extractor import compute_application_status

logger = logging.getLogger("edvora.sync_service")

def sync_scholarship(item: ExtractedScholarship) -> Tuple[str, Dict[str, Any]]:
    """
    Synchronizes an extracted scholarship into the SQLite database.
    Performs duplicate detection, intelligent updates, and status recalculation.
    
    Returns:
        (action, details_dict) where action is 'inserted', 'updated', or 'unchanged'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        now_iso = datetime.now().isoformat()
        today_date = datetime.now().strftime("%Y-%m-%d")

        # 1. Run Verification Engine
        is_verified, review_status, verification_notes = verify_scholarship(item)
        item.isVerified = is_verified
        item.reviewStatus = review_status
        item.verificationNotes = verification_notes
        item.lastUpdated = today_date

        # Recalculate dynamic status based on current calendar date
        item.status = compute_application_status(item.applicationStart, item.applicationDeadline)

        # 2. Duplicate Detection
        # Match by ID, slug, normalized name, or source / application URL
        cursor.execute("SELECT * FROM scholarships WHERE id = ? OR slug = ?;", (item.id, item.slug))
        existing_row = cursor.fetchone()

        if not existing_row:
            # Secondary check: Normalized name match
            cursor.execute("""
                SELECT * FROM scholarships 
                WHERE LOWER(REPLACE(REPLACE(name, ' ', ''), '-', '')) = LOWER(REPLACE(REPLACE(?, ' ', ''), '-', ''));
            """, (item.name,))
            existing_row = cursor.fetchone()

        if not existing_row and item.sourceUrl:
            # Match exact scheme-specific deep URLs (exclude generic portal root domains)
            path_segments = [p for p in item.sourceUrl.split("://")[-1].split("/") if p]
            if len(path_segments) >= 2:
                cursor.execute("""
                    SELECT * FROM scholarships 
                    WHERE source_url = ? AND source_url != '';
                """, (item.sourceUrl,))
                existing_row = cursor.fetchone()

        # 3. If Record Exists -> Update Changed Fields Without Overwriting with Incomplete Data
        if existing_row:
            target_id = existing_row["id"]
            existing_hash = existing_row["raw_data_hash"] if "raw_data_hash" in existing_row.keys() else None
            existing_deadline = existing_row["application_deadline"]
            existing_status = existing_row["status"]

            # Preserve existing rich fields if freshly extracted fields are empty or sparse
            existing_docs = json.loads(existing_row["documents"] or "[]")
            final_docs = item.documents if item.documents and len(item.documents) > 0 else existing_docs

            existing_who = json.loads(existing_row["who_can_apply"] or "[]")
            final_who = item.whoCanApply if item.whoCanApply and len(item.whoCanApply) > 0 else existing_who

            existing_steps = json.loads(existing_row["how_to_apply_steps"] or "[]")
            final_steps = item.howToApplySteps if item.howToApplySteps and len(item.howToApplySteps) > 0 else existing_steps

            existing_desc = existing_row["description"] or ""
            final_desc = item.description if len(item.description.strip()) > 30 else (existing_desc or item.description)

            existing_benefits = json.loads(existing_row["benefits"] or "{}")
            final_benefits = item.benefits.model_dump() if item.benefits.amountDescription else existing_benefits

            # If existing scheme is rejected by admin, preserve rejection unless source published brand new verifiable scheme
            final_review_status = item.reviewStatus
            final_is_verified = 1 if item.isVerified else 0
            if existing_row["review_status"] == "rejected":
                final_review_status = "rejected"
                final_is_verified = 0

            has_changes = (
                item.rawHash != existing_hash or
                item.applicationDeadline != existing_deadline or
                item.status != existing_status
            )

            if has_changes:
                cursor.execute("""
                    UPDATE scholarships
                    SET application_start = ?,
                        application_deadline = ?,
                        status = ?,
                        benefits = ?,
                        documents = ?,
                        description = ?,
                        who_can_apply = ?,
                        how_to_apply_steps = ?,
                        last_updated = ?,
                        tags = ?,
                        source_url = ?,
                        source_domain = ?,
                        raw_data_hash = ?,
                        last_verified_at = ?,
                        verification_notes = ?,
                        review_status = ?,
                        is_verified = ?,
                        academic_year = ?
                    WHERE id = ?;
                """, (
                    item.applicationStart or existing_row["application_start"],
                    item.applicationDeadline or existing_row["application_deadline"],
                    item.status,
                    json.dumps(final_benefits),
                    json.dumps(final_docs),
                    final_desc,
                    json.dumps(final_who),
                    json.dumps(final_steps),
                    today_date,
                    json.dumps(item.tags or json.loads(existing_row["tags"] or "[]")),
                    item.sourceUrl,
                    item.sourceDomain,
                    item.rawHash,
                    now_iso,
                    item.verificationNotes,
                    final_review_status,
                    final_is_verified,
                    item.academicYear or existing_row["academic_year"],
                    target_id
                ))
                conn.commit()

                log_audit_activity(
                    "UPDATE",
                    "scholarship",
                    target_id,
                    f"Auto-updated by Intelligence: deadline={item.applicationDeadline}, status={item.status}"
                )
                logger.info(f"Updated existing scholarship: {item.name} ({target_id})")
                return "updated", {"id": target_id, "name": item.name, "changes": "deadline/status"}
            else:
                # Mark verified timestamp without changing content
                cursor.execute("""
                    UPDATE scholarships
                    SET last_verified_at = ?, verification_notes = ?
                    WHERE id = ?;
                """, (now_iso, item.verificationNotes, target_id))
                conn.commit()
                return "unchanged", {"id": target_id, "name": item.name}

        # 4. If Record Does NOT Exist -> Insert Newly Discovered Scholarship
        else:
            cursor.execute("""
                INSERT INTO scholarships (
                    id, slug, name, short_name, provider, state, type,
                    education_levels, courses, categories, gender_eligibility,
                    income_limit, minimum_percentage, year_eligibility,
                    special_conditions, benefits, application_start,
                    application_deadline, status, documents, description,
                    who_can_apply, how_to_apply_steps, official_website,
                    application_website, last_updated, tags, is_verified,
                    is_featured, source_url, source_domain, raw_data_hash,
                    last_verified_at, verification_notes, review_status, academic_year
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?
                );
            """, (
                item.id,
                item.slug,
                item.name,
                item.shortName,
                item.provider,
                item.state,
                item.type,
                json.dumps(item.educationLevels),
                json.dumps(item.courses),
                json.dumps(item.categories),
                item.genderEligibility,
                item.incomeLimit,
                item.minimumPercentage,
                json.dumps(item.yearEligibility),
                json.dumps(item.specialConditions.model_dump()) if item.specialConditions else json.dumps({}),
                json.dumps(item.benefits.model_dump()),
                item.applicationStart,
                item.applicationDeadline,
                item.status,
                json.dumps(item.documents),
                item.description,
                json.dumps(item.whoCanApply),
                json.dumps(item.howToApplySteps),
                item.officialWebsite,
                item.applicationWebsite,
                today_date,
                json.dumps(item.tags),
                1 if item.isVerified else 0,
                0,  # is_featured
                item.sourceUrl,
                item.sourceDomain,
                item.rawHash,
                now_iso,
                item.verificationNotes,
                item.reviewStatus,
                item.academicYear
            ))
            conn.commit()

            log_audit_activity(
                "DISCOVER",
                "scholarship",
                item.id,
                f"Discovered new scheme via Intelligence System from {item.sourceDomain}"
            )
            logger.info(f"Discovered and inserted new scholarship: {item.name} ({item.id})")
            return "inserted", {"id": item.id, "name": item.name}

    finally:
        conn.close()


def refresh_all_scholarship_statuses() -> int:
    """
    Recomputes application status for all scholarships in SQLite based on current date.
    - If deadline has passed -> 'Closed'
    - If deadline is within 7 days -> 'Closing Soon'
    Returns count of updated records.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    today_str = datetime.now().strftime("%Y-%m-%d")
    updated = 0
    try:
        cursor.execute("""
            UPDATE scholarships
            SET status = 'Closed', last_updated = ?
            WHERE application_deadline < ? AND application_deadline != '' AND status != 'Closed'
        """, (today_str, today_str))
        updated += cursor.rowcount
        conn.commit()
        if updated > 0:
            logger.info(f"Refreshed scholarship statuses: {updated} records updated to 'Closed'.")
        return updated
    finally:
        conn.close()

