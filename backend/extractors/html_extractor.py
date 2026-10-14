import re
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from bs4 import BeautifulSoup
from ..models import (
    EducationLevel,
    SocialCategory,
    Gender,
    ScholarshipType,
    ApplicationStatus,
    ScholarshipBenefitsModel,
    ScholarshipSpecialConditionsModel,
)

DATE_PATTERNS = [
    # YYYY-MM-DD
    r'\b(\d{4})-(\d{1,2})-(\d{1,2})\b',
    # DD/MM/YYYY or DD-MM-YYYY
    r'\b(\d{1,2})[/\.-](\d{1,2})[/\.-](\d{4})\b',
    # 31st October 2026 or 31 Oct 2026
    r'\b(\d{1,2})(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\b',
]

MONTH_MAP = {
    'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
    'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6, 'jul': 7, 'july': 7,
    'aug': 8, 'august': 8, 'sep': 9, 'september': 9, 'oct': 10, 'october': 10,
    'nov': 11, 'november': 11, 'dec': 12, 'december': 12
}

def parse_iso_date(text: str) -> Optional[str]:
    """Finds and parses the first valid date string into ISO YYYY-MM-DD format."""
    if not text:
        return None

    # Try Month Year text format
    for match in re.finditer(DATE_PATTERNS[2], text, re.IGNORECASE):
        day = int(match.group(1))
        month_str = match.group(2).lower()
        year = int(match.group(3))
        month = MONTH_MAP.get(month_str, 1)
        try:
            return f"{year:04d}-{month:02d}-{day:02d}"
        except Exception:
            pass

    # Try DD/MM/YYYY or DD-MM-YYYY
    for match in re.finditer(DATE_PATTERNS[1], text):
        day = int(match.group(1))
        month = int(match.group(2))
        year = int(match.group(3))
        if 1 <= month <= 12 and 1 <= day <= 31 and 2020 <= year <= 2035:
            return f"{year:04d}-{month:02d}-{day:02d}"

    # Try YYYY-MM-DD
    for match in re.finditer(DATE_PATTERNS[0], text):
        year = int(match.group(1))
        month = int(match.group(2))
        day = int(match.group(3))
        if 1 <= month <= 12 and 1 <= day <= 31 and 2020 <= year <= 2035:
            return f"{year:04d}-{month:02d}-{day:02d}"

    return None

def extract_income_limit(text: str) -> Optional[int]:
    """Extracts numeric family income ceiling (e.g. 6 Lakh, ₹2,50,000, 4.5 LPA)."""
    if not text:
        return None

    lower = text.lower()

    # Match "X lakh" or "X.Y lakh" / "X LPA"
    lakh_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lakhs|lpa|lac|lacs)', lower)
    if lakh_match:
        val = float(lakh_match.group(1))
        return int(val * 100000)

    # Match numeric amounts with rupees e.g. "₹2,50,000" or "Rs. 600000"
    amount_match = re.search(r'(?:rs\.?|₹|inr)\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]{5,7})', lower)
    if amount_match:
        raw_num = amount_match.group(1).replace(',', '')
        val = int(raw_num)
        if 50000 <= val <= 2000000:
            return val

    return None

def extract_minimum_percentage(text: str) -> Optional[float]:
    """Extracts academic percentage requirement (e.g. 80%, 60%, 50%)."""
    if not text:
        return None

    # Matches "at least 80%", "minimum 60% marks", "80% or above"
    pct_match = re.search(r'(?:minimum|at\s+least|secured|securing|with)?\s*([0-9]{2}(?:\.[0-9]+)?)\s*%\s*(?:marks|percentage|or\s+above)?', text, re.IGNORECASE)
    if pct_match:
        val = float(pct_match.group(1))
        if 35 <= val <= 95:
            return val

    return None

def extract_education_levels(text: str) -> List[EducationLevel]:
    """Detects eligible education levels from descriptive text."""
    lower = text.lower()
    levels: List[EducationLevel] = []

    if any(k in lower for k in ['diploma', 'polytechnic', 'd.engg']):
        levels.append('Diploma')
    if any(k in lower for k in ['undergraduate', 'bachelor', 'degree', 'b.e', 'b.tech', 'mbbs', 'bca', 'b.sc', 'b.com', 'b.a', 'graduation']):
        levels.append('Undergraduate')
    if any(k in lower for k in ['postgraduate', 'master', 'm.tech', 'm.sc', 'm.com', 'm.a', 'post-graduation', 'post graduation']):
        levels.append('Postgraduate')
    if any(k in lower for k in ['phd', 'ph.d', 'doctoral', 'fellowship', 'research scholar']):
        levels.append('PhD')
    if any(k in lower for k in ['iti', 'industrial training']):
        levels.append('ITI')
    if any(k in lower for k in ['class 11', 'class 12', 'higher secondary', 'intermediate', 'school', 'matric']):
        levels.append('School')

    if not levels:
        levels = ['Undergraduate']

    # Remove duplicates preserving order
    return list(dict.fromkeys(levels))

def extract_categories(text: str) -> List[SocialCategory]:
    """Identifies reservation or target social categories."""
    lower = text.lower()
    cats: List[SocialCategory] = []

    if re.search(r'\bsc\b|scheduled\s+caste', lower):
        cats.append('SC')
    if re.search(r'\bst\b|scheduled\s+tribe', lower):
        cats.append('ST')
    if re.search(r'\bsebc\b|\bobc\b|other\s+backward', lower):
        cats.append('SEBC/OBC')
    if re.search(r'\bews\b|economically\s+weaker', lower):
        cats.append('EWS')

    if not cats or 'all' in lower or 'open to all' in lower or 'general' in lower:
        return ['All']

    return cats

def extract_gender(text: str) -> Gender:
    """Identifies gender targeting."""
    lower = text.lower()
    if any(w in lower for w in ['girls only', 'female only', 'girl student', 'women only', 'women candidates']):
        return 'Female'
    if any(w in lower for w in ['boys only', 'male candidates only']):
        return 'Male'
    return 'All'

def extract_documents(soup_or_text: Any) -> List[str]:
    """Finds list of required documents from tables, lists, or bullets."""
    docs = []
    text = str(soup_or_text)

    # Common document keywords in Indian scholarships
    known_doc_types = [
        'Aadhaar Card',
        'Income Certificate',
        'Caste Certificate',
        'Domicile / Residence Certificate',
        'Previous Academic Marksheet',
        'College Admission / Bonafide Certificate',
        'Current Academic Year Fee Receipt',
        'Student Bank Account Passbook (linked with Aadhaar)',
        'Hostel Certificate (if applicable)',
        'Disability Certificate (if applicable)',
    ]

    lower = text.lower()
    for doc in known_doc_types:
        short = doc.split('(')[0].split('/')[0].strip().lower()
        if short in lower:
            docs.append(doc)

    if not docs:
        docs = [
            'Aadhaar Card of the applicant',
            'Previous academic marksheets',
            'College Admission / Bonafide Certificate',
            'Annual Family Income Certificate',
            'Bank passbook copy',
        ]

    return docs

def compute_application_status(start_date: str, deadline_date: str) -> ApplicationStatus:
    """Calculates active application status based on current calendar date."""
    if not deadline_date:
        return 'Dates Not Announced'

    try:
        now = datetime.now()
        deadline = datetime.strptime(deadline_date, '%Y-%m-%d')
        days_left = (deadline - now).days

        if days_left < 0:
            return 'Closed'

        if start_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d')
                if now < start:
                    return 'Upcoming'
            except Exception:
                pass

        if 0 <= days_left <= 7:
            return 'Closing Soon'

        return 'Open'
    except Exception:
        return 'Dates Not Announced'

def sanitize_slug(name: str) -> str:
    """Generates clean SEO-friendly slug from title."""
    cleaned = re.sub(r'[^a-zA-Z0-9\s-]', '', name).strip().lower()
    return re.sub(r'[-\s]+', '-', cleaned)[:60]
