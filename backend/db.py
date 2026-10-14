import sqlite3
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from .config import DATABASE_PATH, OFFICIAL_SOURCES

logger = logging.getLogger("edvora.db")

def get_db_connection() -> sqlite3.Connection:
    """Returns a SQLite connection with row factory enabled and WAL mode."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DATABASE_PATH), timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn

def init_db_schema():
    """Initializes and migrates the database schema for the intelligence system."""
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Base scholarships table (if not exists)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scholarships (
                id TEXT PRIMARY KEY,
                slug TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                short_name TEXT NOT NULL,
                provider TEXT NOT NULL,
                state TEXT NOT NULL,
                type TEXT NOT NULL,
                education_levels TEXT NOT NULL,
                courses TEXT NOT NULL,
                categories TEXT NOT NULL,
                gender_eligibility TEXT NOT NULL,
                income_limit REAL,
                minimum_percentage REAL,
                year_eligibility TEXT NOT NULL,
                special_conditions TEXT,
                benefits TEXT NOT NULL,
                application_start TEXT NOT NULL,
                application_deadline TEXT NOT NULL,
                status TEXT NOT NULL,
                documents TEXT NOT NULL,
                description TEXT NOT NULL,
                who_can_apply TEXT NOT NULL,
                how_to_apply_steps TEXT NOT NULL,
                official_website TEXT NOT NULL,
                application_website TEXT NOT NULL,
                last_updated TEXT NOT NULL,
                tags TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_verified INTEGER DEFAULT 1,
                is_featured INTEGER DEFAULT 0
            );
        """)

        # 2. Check and migrate intelligence columns on scholarships table
        cursor.execute("PRAGMA table_info(scholarships);")
        existing_cols = [row["name"] for row in cursor.fetchall()]

        intelligence_cols = {
            "source_url": "TEXT",
            "source_domain": "TEXT",
            "raw_data_hash": "TEXT",
            "last_verified_at": "TEXT",
            "verification_notes": "TEXT",
            "review_status": "TEXT DEFAULT 'verified'",
            "renewal_conditions": "TEXT",
            "academic_year": "TEXT",
            "official_contact": "TEXT",
        }

        for col_name, col_def in intelligence_cols.items():
            if col_name not in existing_cols:
                logger.info(f"Adding intelligence column: {col_name}")
                cursor.execute(f"ALTER TABLE scholarships ADD COLUMN {col_name} {col_def};")

        # 3. Intelligence Runs Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS intelligence_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                status TEXT NOT NULL DEFAULT 'running',
                sources_checked INTEGER DEFAULT 0,
                discovered_count INTEGER DEFAULT 0,
                updated_count INTEGER DEFAULT 0,
                failed_sources TEXT DEFAULT '[]',
                log_summary TEXT DEFAULT '',
                trigger_type TEXT DEFAULT 'scheduled'
            );
        """)

        # 4. Intelligence Sources Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS intelligence_sources (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                url TEXT NOT NULL,
                source_type TEXT NOT NULL,
                priority INTEGER DEFAULT 1,
                is_active INTEGER DEFAULT 1,
                last_scanned_at TEXT,
                last_status TEXT DEFAULT 'pending',
                error_message TEXT,
                schemes_count INTEGER DEFAULT 0
            );
        """)

        # 5. Admin Activity Logs (if not exists)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                entity_type TEXT NOT NULL,
                entity_id TEXT,
                details TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 6. Seed official sources if empty
        cursor.execute("SELECT COUNT(*) as count FROM intelligence_sources;")
        if cursor.fetchone()["count"] == 0:
            for s in OFFICIAL_SOURCES:
                cursor.execute("""
                    INSERT INTO intelligence_sources (id, name, url, source_type, priority, is_active)
                    VALUES (?, ?, ?, ?, ?, 1);
                """, (s["id"], s["name"], s["url"], s["source_type"], s.get("priority", 1)))

        conn.commit()
        logger.info("Intelligence DB schema migration completed successfully.")
    finally:
        conn.close()

# Run schema initialization on module import
init_db_schema()

def log_audit_activity(action: str, entity_type: str, entity_id: str, details: str):
    """Records an audit log entry in admin_activity_logs."""
    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO admin_activity_logs (action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?);
        """, (action, entity_type, entity_id, details))
        conn.commit()
    except Exception as e:
        logger.warn(f"Failed to log audit activity: {e}")
    finally:
        conn.close()

def record_intelligence_run(
    started_at: str,
    completed_at: str,
    status: str,
    sources_checked: int,
    discovered_count: int,
    updated_count: int,
    failed_sources: List[str],
    log_summary: str,
    trigger_type: str = "scheduled"
) -> int:
    """Inserts a completed intelligence run into intelligence_runs."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO intelligence_runs (
                started_at, completed_at, status, sources_checked,
                discovered_count, updated_count, failed_sources,
                log_summary, trigger_type
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            started_at,
            completed_at,
            status,
            sources_checked,
            discovered_count,
            updated_count,
            json.dumps(failed_sources),
            log_summary,
            trigger_type
        ))
        conn.commit()
        return cursor.lastrowid or 0
    finally:
        conn.close()

def update_source_status(source_id: str, status: str, error_message: Optional[str] = None, schemes_found: int = 0):
    """Updates the scan health status of an intelligence source."""
    conn = get_db_connection()
    try:
        now = datetime.now().isoformat()
        conn.execute("""
            UPDATE intelligence_sources
            SET last_scanned_at = ?,
                last_status = ?,
                error_message = ?,
                schemes_count = ?
            WHERE id = ?;
        """, (now, status, error_message, schemes_found, source_id))
        conn.commit()
    finally:
        conn.close()
