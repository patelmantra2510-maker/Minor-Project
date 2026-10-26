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

        # 3. If Record Exists -> Granular Change Detection & Safe Updates
        if existing_row:
            target_id = existing_row["id"]
            existing_hash = existing_row["raw_data_hash"] if "raw_data_hash" in existing_row.keys() else None

            # Detect changes per category
            detected_changes: List[str] = []

            # 1. Application opening dates and deadlines
            existing_start = existing_row["application_start"] or ""
            existing_deadline = existing_row["application_deadline"] or ""
            if item.applicationDeadline and item.applicationDeadline != existing_deadline:
                detected_changes.append(f"deadline ({existing_deadline} -> {item.applicationDeadline})")
            if item.applicationStart and item.applicationStart != existing_start:
                detected_changes.append(f"start_date ({existing_start} -> {item.applicationStart})")

            # 2. Academic year and status
            existing_academic_year = existing_row["academic_year"] or ""
            existing_status = existing_row["status"] or ""
            if item.academicYear and item.academicYear != existing_academic_year:
                detected_changes.append(f"academic_year ({existing_academic_year} -> {item.academicYear})")
            if item.status and item.status != existing_status:
                detected_changes.append(f"status ({existing_status} -> {item.status})")

            # 3. Benefits and award amounts
            existing_benefits = json.loads(existing_row["benefits"] or "{}")
            existing_max_amount = existing_benefits.get("maxAnnualAmount")
            new_max_amount = item.benefits.maxAnnualAmount
            if new_max_amount and new_max_amount != existing_max_amount:
                detected_changes.append(f"award_amount (Rs.{existing_max_amount} -> Rs.{new_max_amount})")
            elif item.benefits.amountDescription and item.benefits.amountDescription != existing_benefits.get("amountDescription", ""):
                detected_changes.append("benefits_description")

            # 4. Eligibility criteria
            existing_income = existing_row["income_limit"]
            if item.incomeLimit is not None and item.incomeLimit != existing_income:
                detected_changes.append(f"income_limit ({existing_income} -> {item.incomeLimit})")

            existing_pct = existing_row["minimum_percentage"]
            if item.minimumPercentage is not None and item.minimumPercentage != existing_pct:
                detected_changes.append(f"min_percentage ({existing_pct} -> {item.minimumPercentage})")

            existing_levels = set(json.loads(existing_row["education_levels"] or "[]"))
            new_levels = set(item.educationLevels or [])
            if new_levels and new_levels != existing_levels:
                detected_changes.append("education_levels")

            existing_categories = set(json.loads(existing_row["categories"] or "[]"))
            new_categories = set(item.categories or [])
            if new_categories and new_categories != existing_categories:
                detected_changes.append("categories")

            # 5. Required documents (preserve existing rich checklist; union with newly found docs)
            existing_docs = json.loads(existing_row["documents"] or "[]")
            merged_docs = list(existing_docs)
            if item.documents:
                for doc in item.documents:
                    if doc not in merged_docs:
                        merged_docs.append(doc)
            if len(merged_docs) > len(existing_docs):
                detected_changes.append(f"new_documents (+{len(merged_docs) - len(existing_docs)})")

            # 6. Application links
            existing_app_url = existing_row["application_website"] or ""
            if item.applicationWebsite and item.applicationWebsite != existing_app_url and len(item.applicationWebsite) > 8:
                detected_changes.append("application_website")

            # Fallback hash check
            if item.rawHash and item.rawHash != existing_hash and not detected_changes:
                detected_changes.append("content_hash")

            has_changes = len(detected_changes) > 0

            # Preserve existing rich fields if freshly extracted fields are empty or sparse
            existing_who = json.loads(existing_row["who_can_apply"] or "[]")
            final_who = item.whoCanApply if item.whoCanApply and len(item.whoCanApply) > 0 else existing_who

            existing_steps = json.loads(existing_row["how_to_apply_steps"] or "[]")
            final_steps = item.howToApplySteps if item.howToApplySteps and len(item.howToApplySteps) > 0 else existing_steps

            existing_desc = existing_row["description"] or ""
            final_desc = item.description if len(item.description.strip()) > 30 else (existing_desc or item.description)

            final_benefits = item.benefits.model_dump() if item.benefits.amountDescription or item.benefits.maxAnnualAmount else existing_benefits

            # If existing scheme is rejected by admin, preserve rejection unless source published brand new verifiable scheme
            final_review_status = item.reviewStatus
            final_is_verified = 1 if item.isVerified else 0
            if existing_row["review_status"] == "rejected":
                final_review_status = "rejected"
                final_is_verified = 0

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
                        income_limit = ?,
                        minimum_percentage = ?,
                        education_levels = ?,
                        categories = ?,
                        application_website = ?,
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
                    json.dumps(merged_docs),
                    final_desc,
                    json.dumps(final_who),
                    json.dumps(final_steps),
                    item.incomeLimit if item.incomeLimit is not None else existing_income,
                    item.minimumPercentage if item.minimumPercentage is not None else existing_pct,
                    json.dumps(list(new_levels)) if new_levels else existing_row["education_levels"],
                    json.dumps(list(new_categories)) if new_categories else existing_row["categories"],
                    item.applicationWebsite or existing_app_url,
                    today_date,
                    json.dumps(item.tags or json.loads(existing_row["tags"] or "[]")),
                    item.sourceUrl or existing_row["source_url"],
                    item.sourceDomain or existing_row["source_domain"],
                    item.rawHash or existing_hash,
                    now_iso,
                    item.verificationNotes or existing_row["verification_notes"],
                    final_review_status,
                    final_is_verified,
                    item.academicYear or existing_row["academic_year"],
                    target_id
                ))
                conn.commit()

                changes_summary = ", ".join(detected_changes)
                log_audit_activity(
                    "UPDATE",
                    "scholarship",
                    target_id,
                    f"Intelligence auto-updated: {changes_summary}"
                )
                logger.info(f"Updated existing scholarship: {item.name} ({target_id}) -> Changes: {changes_summary}")
                return "updated", {"id": target_id, "name": item.name, "changes": changes_summary}
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

