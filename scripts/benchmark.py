import time
import asyncio
import numpy as np
from httpx import AsyncClient, ASGITransport
from backend.main import app

async def run_benchmarks(num_requests: int = 50):
    print(f"🚀 Running IntentEats Recommender Benchmarks ({num_requests} iterations)...")
    latencies = []
    diversity_scores = []
    ndcg_scores = []

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Benchmark Exploration Endpoint Latency & Diversity
        for i in range(num_requests):
            budget = float(np.random.choice([150, 250, 400, 600, 850]))
            eta = float(np.random.choice([20, 30, 45, 60]))
            is_veg = bool(i % 2 == 0)

            t0 = time.perf_counter()
            resp = await client.get(f"/recommend/explore?budget={budget}&eta={eta}&is_veg={is_veg}")
            t1 = time.perf_counter()

            lat_ms = (t1 - t0) * 1000
            latencies.append(lat_ms)

            if resp.status_code == 200:
                data = resp.json()
                if "metrics" in data and "diversity_score" in data["metrics"]:
                    diversity_scores.append(data["metrics"]["diversity_score"])

        # 2. Benchmark Exploitation Endpoint Latency & NDCG@5
        categories = ["Rolls & Wraps", "Burgers", "Pizzas", "Biryani", "Asian & Bowls"]
        for i in range(num_requests):
            cat = categories[i % len(categories)]
            payload = {
                "category": cat,
                "budget": 500.0,
                "eta": 35.0,
                "is_veg": False
            }
            t0 = time.perf_counter()
            resp = await client.post("/recommend/exploit", json=payload)
            t1 = time.perf_counter()

            lat_ms = (t1 - t0) * 1000
            latencies.append(lat_ms)

            if resp.status_code == 200:
                data = resp.json()
                if "metrics" in data and "ndcg_score" in data["metrics"]:
                    ndcg_scores.append(data["metrics"]["ndcg_score"])

    # Compute Summary Statistics
    p50 = np.percentile(latencies, 50)
    p95 = np.percentile(latencies, 95)
    p99 = np.percentile(latencies, 99)
    avg_div = np.mean(diversity_scores) if diversity_scores else 0.0
    avg_ndcg = np.mean(ndcg_scores) if ndcg_scores else 0.0

    print("\n" + "="*60)
    print("           INTENT EATS BENCHMARK REPORT             ")
    print("="*60)
    print(f"Total API Calls Evaluated : {len(latencies)}")
    print(f"Latency P50               : {p50:.2f} ms")
    print(f"Latency P95               : {p95:.2f} ms")
    print(f"Latency P99               : {p99:.2f} ms")
    print(f"Target Latency Boundary   : < 200.00 ms (PASSED: {p99 < 200.0})")
    print(f"Average Diversity Score   : {avg_div:.2f} / 1.00")
    print(f"Average NDCG@5 Score      : {avg_ndcg:.4f} / 1.0000")
    print("="*60 + "\n")

if __name__ == "__main__":
    asyncio.run(run_benchmarks())
