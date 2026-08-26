import time
import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

@pytest.mark.asyncio
async def test_trending_cold_start():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        start_time = time.perf_counter()
        response = await client.get("/recommend/trending")
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        assert response.status_code == 200
        assert elapsed_ms < 200.0, f"Latency higher than 200ms: {elapsed_ms:.2f}ms"

        data = response.json()
        assert data["status"] == "success"
        assert "banner_text" in data
        assert len(data["items"]) > 0

@pytest.mark.asyncio
async def test_mandatory_success_scenario():
    """
    Mandatory Test Case 1: Strict constraints (Budget < ₹300, ETA < 25 mins).
    Verifies that system filters expensive/slow items and returns relevant items with explainability badges.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        start_time = time.perf_counter()
        response = await client.get("/recommend/explore?budget=300&eta=25&is_veg=true")
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        assert response.status_code == 200
        assert elapsed_ms < 200.0, f"Exploration latency exceeded 200ms: {elapsed_ms:.2f}ms"

        data = response.json()
        assert data["status"] == "success"
        items = data["items"]
        assert len(items) > 0

        for item in items:
            assert item["price"] <= 300.0
            assert item["eta_mins"] <= 25
            assert item["is_veg"] is True
            assert len(item["explainability_badges"]) > 0

        # Diversity score check
        metrics = data["metrics"]
        assert metrics["diversity_score"] >= 0.8 # High category diversity

@pytest.mark.asyncio
async def test_mandatory_failure_scenario_no_match():
    """
    Mandatory Test Case 2: Impossible constraints (Budget < ₹50, ETA < 5 mins).
    Verifies graceful handling with 'No exact matches' UI state and closest alternatives recommendation.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        start_time = time.perf_counter()
        response = await client.get("/recommend/explore?budget=50&eta=5")
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        assert response.status_code == 200
        assert elapsed_ms < 200.0, f"Fallback response latency exceeded 200ms: {elapsed_ms:.2f}ms"

        data = response.json()
        assert data["status"] == "no_match"
        assert "No exact matches" in data["message"]
        assert len(data["items"]) > 0
        for item in data["items"]:
            # Must contain closest alternative fallback badge
            badges = [b["label"] for b in item["explainability_badges"]]
            assert any("Alternative" in b or "Closest" in b or "Top" in b for b in badges)

@pytest.mark.asyncio
async def test_exploitation_drilldown():
    """
    Test Exploitation phase drilldown into a specific category (e.g. 'Rolls & Wraps')
    and check XGBoost ranking & NDCG metric calculation.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "category": "Rolls & Wraps",
            "budget": 400.0,
            "eta": 30.0,
            "is_veg": False,
            "is_high_protein": True
        }
        start_time = time.perf_counter()
        response = await client.post("/recommend/exploit", json=payload)
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        assert response.status_code == 200
        assert elapsed_ms < 200.0, f"Exploitation latency exceeded 200ms: {elapsed_ms:.2f}ms"

        data = response.json()
        assert data["status"] == "success"
        assert data["category"] == "Rolls & Wraps"
        items = data["items"]
        assert len(items) > 0

        # Check ranking order (descending predicted_score)
        scores = [item["predicted_score"] for item in items]
        assert scores == sorted(scores, reverse=True), "XGBoost ranked list must be sorted descending by predicted_score"

        # NDCG score presence
        assert "ndcg_score" in data["metrics"]
        assert data["metrics"]["ndcg_score"] > 0.0
