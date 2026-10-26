import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = Path(os.getenv("EDVORA_DB_PATH", str(BASE_DIR / "database" / "edvora.sqlite")))

# Scheduler Configuration
DEFAULT_SCAN_INTERVAL_HOURS = int(os.getenv("INTELLIGENCE_INTERVAL_HOURS", "24"))
REQUEST_TIMEOUT_SECONDS = int(os.getenv("INTELLIGENCE_TIMEOUT_SECONDS", "15"))
REQUEST_DELAY_SECONDS = float(os.getenv("INTELLIGENCE_REQUEST_DELAY", "1.2"))
MAX_RETRIES = int(os.getenv("INTELLIGENCE_MAX_RETRIES", "3"))

# HTTP Client Headers
DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 EdvoraScholarshipIntelligence/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,gu;q=0.8,hi;q=0.7",
}

# Supported Official Sources
OFFICIAL_SOURCES = [
    {
        "id": "nsp",
        "name": "National Scholarship Portal (NSP)",
        "url": "https://scholarships.gov.in",
        "schemes_url": "https://scholarships.gov.in",
        "source_type": "central_portal",
        "priority": 1,
    },
    {
        "id": "digital_gujarat",
        "name": "Digital Gujarat Scholarship Portal",
        "url": "https://www.digitalgujarat.gov.in",
        "schemes_url": "https://www.digitalgujarat.gov.in",
        "source_type": "state_portal",
        "priority": 1,
    },
    {
        "id": "aicte",
        "name": "All India Council for Technical Education (AICTE)",
        "url": "https://www.aicte-india.org",
        "schemes_url": "https://www.aicte-india.org/schemes/students-development-schemes",
        "source_type": "technical_authority",
        "priority": 2,
    },
    {
        "id": "ugc",
        "name": "University Grants Commission (UGC)",
        "url": "https://www.ugc.gov.in",
        "schemes_url": "https://www.ugc.gov.in",
        "source_type": "higher_education_authority",
        "priority": 2,
    },
    {
        "id": "mysy_gujarat",
        "name": "Mukhyamantri Yuva Swavalamban Yojana (MYSY)",
        "url": "https://scholarships.gujarat.gov.in",
        "schemes_url": "https://scholarships.gujarat.gov.in",
        "source_type": "state_portal",
        "priority": 1,
    },
    {
        "id": "dst_inspire",
        "name": "Department of Science & Technology (INSPIRE)",
        "url": "https://online-inspire.gov.in",
        "schemes_url": "https://online-inspire.gov.in",
        "source_type": "central_department",
        "priority": 2,
    },
    {
        "id": "foundations",
        "name": "Higher Education Foundations (Reliance & Tata Trusts)",
        "url": "https://scholarships.reliancefoundation.org",
        "schemes_url": "https://scholarships.reliancefoundation.org",
        "source_type": "foundation_portal",
        "priority": 2,
    },
    {
        "id": "announcements_discovery",
        "name": "Official Circulars & Search Discovery Feed",
        "url": "https://socialjustice.gov.in",
        "schemes_url": "https://socialjustice.gov.in",
        "source_type": "discovery_feed",
        "priority": 3,
    },
]
