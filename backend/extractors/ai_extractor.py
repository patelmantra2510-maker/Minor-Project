"""
AI-Assisted Scholarship Processing Module (Groq & Search Integrations)
Operates strictly on the backend to avoid exposing credentials.
Gracefully degrades to rule-based extraction when API keys are not provided.
"""

import os
import json
import logging
import requests
from pathlib import Path
from typing import Optional, Dict, Any

logger = logging.getLogger("edvora.extractor.ai")

def get_env_variable(key: str) -> Optional[str]:
    """Retrieves an environment variable from os.environ or .env file."""
    val = os.getenv(key)
    if val and not val.startswith("your_"):
        return val

    # Try reading .env file if available
    try:
        env_path = Path(__file__).resolve().parent.parent.parent / ".env"
        if env_path.exists():
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith(f"{key}=") and not line.startswith("#"):
                        candidate = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if candidate and not candidate.startswith("your_") and not candidate.startswith("gsk_your"):
                            return candidate
    except Exception:
        pass
    return None

def is_groq_available() -> bool:
    """Checks whether a valid Groq API key is configured."""
    key = get_env_variable("GROQ_API_KEY")
    return bool(key and len(key) > 15)

def is_tavily_available() -> bool:
    """Checks whether a valid Tavily API key is configured."""
    key = get_env_variable("TAVILY_API_KEY")
    return bool(key and len(key) > 10)

def search_scholarship_announcements(query: str) -> Optional[Dict[str, Any]]:
    """
    Optional Tavily Search integration for discovering new official notifications.
    Only triggered if TAVILY_API_KEY is configured.
    """
    key = get_env_variable("TAVILY_API_KEY")
    if not key:
        return None

    try:
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": key,
            "query": query,
            "search_depth": "basic",
            "include_domains": [
                "scholarships.gov.in",
                "digitalgujarat.gov.in",
                "aicte-india.org",
                "ugc.gov.in",
                "scholarships.gujarat.gov.in"
            ],
            "max_results": 5
        }
        res = requests.post(url, json=payload, timeout=10)
        if res.status_code == 200:
            return res.json()
    except Exception as e:
        logger.warning(f"Tavily search attempt failed: {e}")
    return None

def extract_scholarship_details_with_ai(raw_text: str) -> Optional[Dict[str, Any]]:
    """
    Uses Groq LLM (e.g. llama-3.3-70b-versatile or llama-3.1-8b-instant) to parse unstructured scheme text.
    Zero-Hallucination: Prompts strictly require extracting only stated facts or returning null.
    """
    key = get_env_variable("GROQ_API_KEY")
    if not key:
        return None

    try:
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
        system_prompt = (
            "You are a strict data extraction engine for Indian scholarship notifications. "
            "Extract verified facts from the text into valid JSON with keys: "
            "name, provider, deadline (YYYY-MM-DD), income_limit (number or null), "
            "minimum_percentage (number or null), benefits_description, documents (list). "
            "NEVER invent dates, amounts, or criteria. If a field is not explicitly present, use null."
        )
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Extract details from this notification text:\n\n{raw_text[:3000]}"}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1,
            "max_tokens": 800
        }
        res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=15)
        if res.status_code == 200:
            data = res.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)
    except Exception as e:
        logger.warning(f"AI extraction attempt failed, falling back to rule-based engine: {e}")
    return None
