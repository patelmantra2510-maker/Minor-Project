import pytest
from backend.collectors.mysy_collector import MYSYCollector
from backend.collectors.nsp_collector import NSPCollector
from backend.collectors.digital_gujarat_collector import DigitalGujaratCollector
from backend.sync_service import sync_scholarship
from backend.models import ExtractedScholarship, ScholarshipBenefitsModel
from backend.extractors.ai_extractor import is_groq_available, extract_scholarship_details_with_ai
from backend.db import get_db_connection

def test_mysy_collector_extracts_schemes():
    collector = MYSYCollector()
    schemes = collector.collect()
    assert len(schemes) >= 3

    tuition_scheme = next((s for s in schemes if "Tuition Fee" in s.name or "MYSY" in s.shortName), None)
    assert tuition_scheme is not None
    assert tuition_scheme.state == "Gujarat"
    assert tuition_scheme.incomeLimit == 600000
    assert tuition_scheme.minimumPercentage == 80.0
    assert tuition_scheme.sourceDomain == "scholarships.gujarat.gov.in"
    assert len(tuition_scheme.documents) >= 5
    assert tuition_scheme.benefits.maxAnnualAmount >= 50000

def test_sync_service_duplicate_detection_and_update():
    test_uid = "unit-test-auto-discovery-scheme"
    test_slug = "unit-test-auto-discovery-scheme"

    # Clean up test artifact if exists
    conn = get_db_connection()
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()
    conn.close()

    mock_scheme = ExtractedScholarship(
        id=test_uid,
        slug=test_slug,
        name="Unit Test Auto Discovery Scheme",
        shortName="Unit Test Scheme",
        provider="Ministry of Education, Government of India",
        state="All India",
        type="Government",
        educationLevels=["Undergraduate"],
        courses=["All"],
        categories=["All"],
        genderEligibility="All",
        incomeLimit=800000,
        minimumPercentage=60.0,
        yearEligibility=["All"],
        benefits=ScholarshipBenefitsModel(
            amountDescription="₹50,000 per annum",
            maxAnnualAmount=50000
        ),
        applicationStart="2026-08-01",
        applicationDeadline="2026-11-30",
        status="Open",
        documents=["Aadhaar Card", "Income Certificate"],
        description="Comprehensive unit test scheme description for auto discovery pipeline.",
        whoCanApply=["Students in recognized colleges"],
        howToApplySteps=["Apply online on official portal"],
        officialWebsite="https://scholarships.gov.in",
        applicationWebsite="https://scholarships.gov.in",
        lastUpdated="2026-10-24",
        sourceUrl="https://scholarships.gov.in",
        sourceDomain="scholarships.gov.in",
        academicYear="2026-27"
    )

    # 1. First sync -> Should be "inserted"
    action1, details1 = sync_scholarship(mock_scheme)
    assert action1 == "inserted"
    assert details1["id"] == test_uid

    # 2. Duplicate sync with same data -> Should be "unchanged" (no duplicate row)
    action2, details2 = sync_scholarship(mock_scheme)
    assert action2 == "unchanged"

    # 3. Update with extended deadline -> Should be "updated"
    mock_scheme.applicationDeadline = "2026-12-31"
    action3, details3 = sync_scholarship(mock_scheme)
    assert action3 == "updated"

    # Verify in DB that only ONE row exists
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM scholarships WHERE id = ?;", (test_uid,)).fetchall()
    assert len(rows) == 1
    assert rows[0]["application_deadline"] == "2026-12-31"

    # Clean up
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()
    conn.close()

def test_sync_service_preserves_rich_data_on_sparse_update():
    test_uid = "unit-test-preserve-rich-data"
    conn = get_db_connection()
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()

    rich_scheme = ExtractedScholarship(
        id=test_uid,
        slug=test_uid,
        name="Rich Data Preservation Scheme",
        shortName="Rich Scheme",
        provider="Department of Higher Education",
        state="Gujarat",
        type="Government",
        educationLevels=["Undergraduate"],
        courses=["Engineering"],
        categories=["All"],
        genderEligibility="All",
        incomeLimit=600000,
        minimumPercentage=80.0,
        yearEligibility=["All"],
        benefits=ScholarshipBenefitsModel(amountDescription="₹50,000/year", maxAnnualAmount=50000),
        applicationStart="2026-08-01",
        applicationDeadline="2026-10-31",
        status="Open",
        documents=["Class 12 Marksheet", "Income Certificate", "Aadhaar Card", "College Fee Receipt"],
        description="Detailed description with rich requirements.",
        whoCanApply=["Students with >80 percentile in 12th"],
        howToApplySteps=["Step 1: Register", "Step 2: Upload documents"],
        officialWebsite="https://scholarships.gujarat.gov.in",
        applicationWebsite="https://scholarships.gujarat.gov.in",
        lastUpdated="2026-10-24",
        sourceUrl="https://scholarships.gujarat.gov.in",
        sourceDomain="scholarships.gujarat.gov.in"
    )

    sync_scholarship(rich_scheme)

    # Now simulate a crawler scan that only extracts an updated deadline but empty documents
    sparse_update = ExtractedScholarship(
        id=test_uid,
        slug=test_uid,
        name="Rich Data Preservation Scheme",
        shortName="Rich Scheme",
        provider="Department of Higher Education",
        state="Gujarat",
        type="Government",
        educationLevels=["Undergraduate"],
        courses=["Engineering"],
        categories=["All"],
        genderEligibility="All",
        incomeLimit=600000,
        minimumPercentage=80.0,
        yearEligibility=["All"],
        benefits=ScholarshipBenefitsModel(amountDescription="₹50,000/year", maxAnnualAmount=50000),
        applicationStart="2026-08-01",
        applicationDeadline="2026-11-30", # Extended deadline!
        status="Open",
        documents=[], # Empty!
        description="", # Sparse!
        whoCanApply=[], # Empty!
        howToApplySteps=[], # Empty!
        officialWebsite="https://scholarships.gujarat.gov.in",
        applicationWebsite="https://scholarships.gujarat.gov.in",
        lastUpdated="2026-10-24",
        sourceUrl="https://scholarships.gujarat.gov.in",
        sourceDomain="scholarships.gujarat.gov.in"
    )

    action, _ = sync_scholarship(sparse_update)
    assert action == "updated"

    # Verify that rich documents and description were preserved and NOT wiped out
    row = conn.execute("SELECT * FROM scholarships WHERE id = ?;", (test_uid,)).fetchone()
    import json
    saved_docs = json.loads(row["documents"])
    assert len(saved_docs) == 4
    assert "Aadhaar Card" in saved_docs
    assert row["application_deadline"] == "2026-11-30"

    # Cleanup
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()
    conn.close()

def test_verification_and_rejection_workflow():
    from fastapi.testclient import TestClient
    from backend.main import app

    client = TestClient(app)
    test_uid = "unit-test-verify-reject-workflow"

    conn = get_db_connection()
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()

    test_scheme = ExtractedScholarship(
        id=test_uid,
        slug=test_uid,
        name="Workflow Test Scheme",
        shortName="Workflow Scheme",
        provider="Ministry of Social Justice",
        state="All India",
        type="Government",
        educationLevels=["Undergraduate"],
        courses=["All"],
        categories=["All"],
        genderEligibility="All",
        incomeLimit=250000,
        minimumPercentage=50.0,
        yearEligibility=["All"],
        benefits=ScholarshipBenefitsModel(amountDescription="₹20,000/year", maxAnnualAmount=20000),
        applicationStart="2026-08-01",
        applicationDeadline="2026-12-31",
        status="Open",
        documents=["Aadhaar Card"],
        description="Workflow test scheme.",
        whoCanApply=["Students"],
        howToApplySteps=["Apply online"],
        officialWebsite="https://scholarships.gov.in",
        applicationWebsite="https://scholarships.gov.in",
        lastUpdated="2026-10-24",
        sourceUrl="https://scholarships.gov.in",
        sourceDomain="scholarships.gov.in"
    )

    sync_scholarship(test_scheme)

    # 1. Reject the scholarship via Admin API
    reject_res = client.post(f"/api/intelligence/reject/{test_uid}", json={"rejectionReason": "Duplicate or invalid criteria"})
    assert reject_res.status_code == 200
    assert reject_res.json()["status"] == "rejected"

    # 2. Public /api/scholarships endpoint MUST NOT return this rejected scheme
    public_res = client.get("/api/scholarships")
    public_items = public_res.json()
    assert not any(s["id"] == test_uid for s in public_items)

    # 3. /api/intelligence/flagged endpoint MUST include it
    flagged_res = client.get("/api/intelligence/flagged")
    flagged_items = flagged_res.json()
    assert any(s["id"] == test_uid for s in flagged_items)

    # 4. Now Verify / Approve it via Admin API
    verify_res = client.post(f"/api/intelligence/verify/{test_uid}", json={"isVerified": True, "verificationNotes": "Confirmed valid"})
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "verified"

    # 5. Public /api/scholarships endpoint MUST now include it
    public_res_after = client.get("/api/scholarships")
    public_items_after = public_res_after.json()
    assert any(s["id"] == test_uid for s in public_items_after)

    # Cleanup
    conn = get_db_connection()
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()
    conn.close()

def test_ai_extractor_fallback():
    # When GROQ_API_KEY is not configured or dummy, it must gracefully return None without crashing
    res = extract_scholarship_details_with_ai("Sample text from portal")
    if not is_groq_available():
        assert res is None

def test_dst_inspire_collector_extracts_schemes():
    from backend.collectors.dst_inspire_collector import DSTInspireCollector
    collector = DSTInspireCollector()
    schemes = collector.collect()
    assert len(schemes) >= 2
    she = next((s for s in schemes if "SHE" in s.shortName or "Higher Education" in s.name), None)
    assert she is not None
    assert she.benefits.maxAnnualAmount == 80000
    assert "online-inspire.gov.in" in she.sourceDomain
    assert len(she.documents) >= 4

def test_foundations_collector_extracts_schemes():
    from backend.collectors.foundations_collector import FoundationsCollector
    collector = FoundationsCollector()
    schemes = collector.collect()
    assert len(schemes) >= 3
    rf_ug = next((s for s in schemes if "reliance-foundation-ug-scholarship" in s.id), None)
    assert rf_ug is not None
    assert rf_ug.incomeLimit == 1500000
    assert rf_ug.minimumPercentage == 60.0

    tata = next((s for s in schemes if "tata-trusts-means-grant" in s.id), None)
    assert tata is not None
    assert tata.incomeLimit == 450000

def test_granular_change_detection_across_all_categories():
    test_uid = "unit-test-granular-change-detection"
    conn = get_db_connection()
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()

    base_scheme = ExtractedScholarship(
        id=test_uid,
        slug=test_uid,
        name="Granular Change Detection Test Scheme",
        shortName="Change Test",
        provider="Ministry of Education",
        state="All India",
        type="Government",
        educationLevels=["Undergraduate"],
        courses=["All"],
        categories=["General"],
        genderEligibility="All",
        incomeLimit=300000,
        minimumPercentage=55.0,
        yearEligibility=["All"],
        benefits=ScholarshipBenefitsModel(amountDescription="₹30,000/year", maxAnnualAmount=30000),
        applicationStart="2026-08-01",
        applicationDeadline="2026-11-15",
        status="Open",
        documents=["Aadhaar Card", "Income Certificate"],
        description="Initial scheme description.",
        whoCanApply=["Students"],
        howToApplySteps=["Apply online"],
        officialWebsite="https://scholarships.gov.in",
        applicationWebsite="https://scholarships.gov.in",
        lastUpdated="2026-10-24",
        sourceUrl="https://scholarships.gov.in/scheme-initial",
        sourceDomain="scholarships.gov.in"
    )

    action, _ = sync_scholarship(base_scheme)
    assert action == "inserted"

    # Test 1: Change income limit & education levels
    updated_scheme = base_scheme.model_copy(deep=True)
    updated_scheme.incomeLimit = 400000
    updated_scheme.educationLevels = ["Undergraduate", "Postgraduate"]
    action_upd1, details_upd1 = sync_scholarship(updated_scheme)
    assert action_upd1 == "updated"
    assert "income_limit" in details_upd1["changes"]
    assert "education_levels" in details_upd1["changes"]

    # Test 2: Add new document (union merge)
    updated_scheme2 = updated_scheme.model_copy(deep=True)
    updated_scheme2.documents = ["Aadhaar Card", "Income Certificate", "Caste Certificate"]
    action_upd2, details_upd2 = sync_scholarship(updated_scheme2)
    assert action_upd2 == "updated"
    assert "new_documents" in details_upd2["changes"]

    # Verify documents union in DB
    row = conn.execute("SELECT documents FROM scholarships WHERE id = ?;", (test_uid,)).fetchone()
    import json
    saved_docs = json.loads(row["documents"])
    assert "Caste Certificate" in saved_docs
    assert len(saved_docs) == 3

    # Cleanup
    conn.execute("DELETE FROM scholarships WHERE id = ?;", (test_uid,))
    conn.commit()
    conn.close()

