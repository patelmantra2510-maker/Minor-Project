import io
import logging
from typing import Optional, Dict, Any, List
import requests
import fitz  # PyMuPDF
from ..config import DEFAULT_HEADERS, REQUEST_TIMEOUT_SECONDS

logger = logging.getLogger("edvora.pdf_extractor")

def extract_text_from_pdf_bytes(pdf_bytes: bytes, max_pages: int = 15) -> str:
    """Extracts raw clean text from a PDF byte array using PyMuPDF."""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages_text = []
        num_pages = min(len(doc), max_pages)

        for page_idx in range(num_pages):
            page = doc[page_idx]
            text = page.get_text("text")
            if text and text.strip():
                pages_text.append(text.strip())

        doc.close()
        return "\n\n".join(pages_text)
    except Exception as e:
        logger.warn(f"Failed to extract PDF text via PyMuPDF: {e}")
        return ""

def fetch_and_extract_pdf_url(pdf_url: str) -> str:
    """Downloads a public guideline PDF and extracts its textual content."""
    try:
        if not pdf_url.startswith("http"):
            return ""

        resp = requests.get(
            pdf_url,
            headers=DEFAULT_HEADERS,
            timeout=REQUEST_TIMEOUT_SECONDS,
            verify=False
        )

        if resp.status_code == 200 and len(resp.content) > 100:
            return extract_text_from_pdf_bytes(resp.content)

        return ""
    except Exception as e:
        logger.warn(f"Failed to fetch PDF at {pdf_url}: {e}")
        return ""

def extract_text_from_pdf(source: Any) -> str:
    """Extracts text from a PDF file path, URL, or bytes."""
    if isinstance(source, bytes):
        return extract_text_from_pdf_bytes(source)
    if isinstance(source, str):
        if source.startswith("http://") or source.startswith("https://"):
            return fetch_and_extract_pdf_url(source)
        try:
            with open(source, "rb") as f:
                return extract_text_from_pdf_bytes(f.read())
        except Exception as e:
            logger.warn(f"Failed to read local PDF {source}: {e}")
    return ""

def parse_scholarship_guideline_pdf(pdf_source: Any) -> Dict[str, Any]:
    """Parses key guideline sections from a scholarship document PDF."""
    text = extract_text_from_pdf(pdf_source)
    from .html_extractor import (
        parse_iso_date,
        extract_income_limit,
        extract_minimum_percentage,
        extract_education_levels,
        extract_documents,
    )
    return {
        "raw_text_length": len(text),
        "deadline": parse_iso_date(text),
        "income_limit": extract_income_limit(text),
        "minimum_percentage": extract_minimum_percentage(text),
        "education_levels": extract_education_levels(text),
        "documents": extract_documents(text),
    }
