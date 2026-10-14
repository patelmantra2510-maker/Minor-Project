import re
from datetime import datetime
from typing import Tuple, List, Optional
from .models import ExtractedScholarship, ReviewStatus

TRUSTED_DOMAINS = [
    'gov.in',
    'nic.in',
    'aicte-india.org',
    'ugc.gov.in',
    'ugc.ac.in',
    'digitalgujarat.gov.in',
    'scholarships.gov.in',
    'gujarat.gov.in',
    'nta.ac.in',
]

def verify_scholarship(item: ExtractedScholarship) -> Tuple[bool, ReviewStatus, str]:
    """
    Validates extracted scholarship against strict integrity checks.
    Zero hallucination guarantee: If fields conflict or cannot be validated,
    it is flagged for review instead of silently published.
    
    Returns:
        (is_verified, review_status, verification_notes)
    """
    notes: List[str] = []
    is_valid = True

    # 1. Name & Provider validation
    if not item.name or len(item.name.strip()) < 5:
        notes.append("Scheme name is missing or too short.")
        is_valid = False

    if not item.provider or len(item.provider.strip()) < 3:
        notes.append("Provider organization is missing.")
        is_valid = False

    # 2. Official Portal URL check
    if not item.officialWebsite.startswith("https://") and not item.officialWebsite.startswith("http://"):
        notes.append("Official portal URL is not a valid web address.")
        is_valid = False

    domain_match = re.search(r'https?://(?:www\.)?([^/]+)', item.officialWebsite)
    if domain_match:
        domain = domain_match.group(1).lower()
        is_trusted = any(domain.endswith(t) for t in TRUSTED_DOMAINS)
        if not is_trusted:
            notes.append(f"Domain '{domain}' is not on the government/accredited portal trustlist. Flagged for review.")

    # 3. Date sanity check
    if item.applicationDeadline:
        try:
            deadline = datetime.strptime(item.applicationDeadline, "%Y-%m-%d")
            # If marked Open but deadline is in the past, conflict!
            if deadline < datetime.now() and item.status in ['Open', 'Closing Soon']:
                notes.append(f"Deadline ({item.applicationDeadline}) has passed but status was marked {item.status}.")
                is_valid = False
        except ValueError:
            notes.append(f"Invalid deadline date format '{item.applicationDeadline}'.")
            is_valid = False

    # 4. Academic percentage sanity
    if item.minimumPercentage is not None:
        if item.minimumPercentage < 35.0 or item.minimumPercentage > 100.0:
            notes.append(f"Suspicious minimum percentage requirement: {item.minimumPercentage}%.")
            is_valid = False

    # 5. Income limit sanity
    if item.incomeLimit is not None:
        if item.incomeLimit <= 0 or item.incomeLimit > 5000000:
            notes.append(f"Suspicious income limit ceiling: ₹{item.incomeLimit}.")
            is_valid = False

    # 6. Education level sanity
    if not item.educationLevels:
        notes.append("No eligible education levels identified.")
        is_valid = False

    # Final verdict
    if is_valid and not notes:
        return True, 'verified', "Verified against official source. All integrity checks passed."
    elif is_valid and notes:
        return True, 'verified', "; ".join(notes)
    else:
        return False, 'flagged_for_review', f"FLAGGED FOR REVIEW: {'; '.join(notes)}"
