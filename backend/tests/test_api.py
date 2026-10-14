import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_api_status_endpoint():
    res = client.get("/api/intelligence/status")
    assert res.status_code == 200
    data = res.json()
    assert "isSchedulerActive" in data
    assert "totalScholarshipsInDb" in data
    assert data["totalScholarshipsInDb"] >= 16
    assert "sources" in data
    assert len(data["sources"]) >= 4

def test_api_sources_endpoint():
    res = client.get("/api/intelligence/sources")
    assert res.status_code == 200
    sources = res.json()
    assert len(sources) >= 4
    source_ids = [s["id"] for s in sources]
    assert "nsp" in source_ids
    assert "digital_gujarat" in source_ids

def test_api_scholarships_endpoint():
    res = client.get("/api/scholarships")
    assert res.status_code == 200
    scholarships = res.json()
    assert isinstance(scholarships, list)
    assert len(scholarships) >= 16

    # Test filtering by state
    gujarat_res = client.get("/api/scholarships?state=Gujarat")
    assert gujarat_res.status_code == 200
    gujarat_items = gujarat_res.json()
    assert all(s["state"] == "Gujarat" for s in gujarat_items)

def test_api_trigger_endpoint():
    res = client.post("/api/intelligence/trigger")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["triggered", "already_in_progress"]
