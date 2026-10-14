import pytest
from backend.extractors.html_extractor import (
    parse_iso_date,
    extract_income_limit,
    extract_minimum_percentage,
    extract_education_levels,
    extract_categories,
    compute_application_status,
)
from backend.verifier import verify_scholarship
from backend.models import ExtractedScholarship, ScholarshipBenefitsModel

def test_parse_iso_date():
    assert parse_iso_date("Application Deadline: 31st October 2026") == "2026-10-31"
    assert parse_iso_date("Closing date is 15/11/2026") == "2026-11-15"
    assert parse_iso_date("Valid till 2026-12-01") == "2026-12-01"

def test_extract_income_limit():
    assert extract_income_limit("Family income should not exceed 6 Lakh per annum") == 600000
    assert extract_income_limit("Annual income up to 2.5 LPA") == 250000
    assert extract_income_limit("Total income under ₹4,50,000") == 450000

def test_extract_minimum_percentage():
    assert extract_minimum_percentage("Candidate must have secured minimum 80% marks") == 80.0
    assert extract_minimum_percentage("Students with at least 60% in 12th standard") == 60.0

def test_extract_education_levels():
    levels = extract_education_levels("Available for diploma and polytechnic engineering students")
    assert "Diploma" in levels

    ug_levels = extract_education_levels("For students enrolled in B.E, B.Tech, or MBBS degree programs")
    assert "Undergraduate" in ug_levels

def test_compute_application_status():
    status = compute_application_status("2026-01-01", "2026-12-31")
    assert status in ["Open", "Closing Soon"]

    closed = compute_application_status("2020-01-01", "2020-12-31")
    assert closed == "Closed"

def test_verifier_flags_conflicts():
    bad_item = ExtractedScholarship(
        id="bad-test",
        slug="bad-test",
        name="Bad",  # Too short!
        shortName="Bad",
        provider="Gov",
        state="All India",
        type="Government",
        educationLevels=["Undergraduate"],
        courses=["All"],
        categories=["All"],
        genderEligibility="All",
        incomeLimit=-500,  # Negative income!
        minimumPercentage=150.0,  # 150%!
        yearEligibility=["All"],
        benefits=ScholarshipBenefitsModel(amountDescription="test"),
        applicationStart="2026-01-01",
        applicationDeadline="2020-01-01",
        status="Open",  # Marked Open but deadline was in 2020!
        description="test scheme",
        officialWebsite="http://not-trusted-domain-123.com",
        applicationWebsite="http://not-trusted-domain-123.com",
        lastUpdated="2026-09-01",
        sourceUrl="http://not-trusted-domain-123.com",
        sourceDomain="not-trusted-domain-123.com",
    )

    is_verified, review_status, notes = verify_scholarship(bad_item)
    assert is_verified is False
    assert review_status == "flagged_for_review"
    assert "FLAGGED FOR REVIEW" in notes
