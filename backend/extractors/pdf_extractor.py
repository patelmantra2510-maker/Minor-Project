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
