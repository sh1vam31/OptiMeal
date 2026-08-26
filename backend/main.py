import time
from typing import List, Optional
from fastapi import FastAPI, Depends, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import init_db, get_db
from backend.recommender import (
    get_trending_recommendations,
    get_exploration_recommendations,
    get_exploitation_recommendations,
    get_hybrid_seed_recommendations,
    handle_no_match_fallback,
    xgboost_model
)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="IntentEats API",
    description="Context-Aware Food Recommender API powered by FastAPI, PostgreSQL Candidate Generation, and XGBoost Ranking",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React SPA frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Latency tracking middleware to ensure < 200ms API response time
@app.middleware("http")
async def add_latency_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time_ms = (time.perf_counter() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time_ms:.2f}"
    return response

class ExploitRequest(BaseModel):
    category: str = Field(..., json_schema_extra={"example": "Rolls & Wraps"})
    budget: float = Field(..., ge=10, le=1000, json_schema_extra={"example": 350.0})
    eta: float = Field(..., ge=1, le=60, json_schema_extra={"example": 30.0})
    is_veg: bool = Field(False)
    is_high_protein: bool = Field(False)
    is_keto: bool = Field(False)
    is_gluten_free: bool = Field(False)

class SeedRecommendRequest(BaseModel):
    seed_ids: List[int] = Field(..., json_schema_extra={"example": [1, 2, 3, 4, 5]})
    persona: Optional[str] = Field(None)
    budget: float = Field(500.0, ge=10, le=1000)
    eta: float = Field(30.0, ge=1, le=60)
    is_veg: bool = Field(False)
    is_high_protein: bool = Field(False)
    is_keto: bool = Field(False)
    is_gluten_free: bool = Field(False)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "database": "connected",
        "xgboost_model_loaded": xgboost_model is not None
    }

@app.get("/recommend/trending")
async def recommend_trending(db: AsyncSession = Depends(get_db)):
    return await get_trending_recommendations(db)

@app.get("/recommend/explore")
async def recommend_explore(
    budget: float = Query(500.0, ge=10, le=1000),
    eta: float = Query(30.0, ge=1, le=60),
    is_veg: bool = Query(False),
    is_high_protein: bool = Query(False),
    is_keto: bool = Query(False),
    is_gluten_free: bool = Query(False),
    db: AsyncSession = Depends(get_db)
):
    return await get_exploration_recommendations(
        db=db,
        budget=budget,
        eta=eta,
        is_veg=is_veg,
        is_high_protein=is_high_protein,
        is_keto=is_keto,
        is_gluten_free=is_gluten_free
    )

@app.post("/recommend/exploit")
async def recommend_exploit(
    payload: ExploitRequest,
    db: AsyncSession = Depends(get_db)
):
    return await get_exploitation_recommendations(
        db=db,
        category=payload.category,
        budget=payload.budget,
        eta=payload.eta,
        is_veg=payload.is_veg,
        is_high_protein=payload.is_high_protein,
        is_keto=payload.is_keto,
        is_gluten_free=payload.is_gluten_free
    )

@app.post("/recommend/hybrid")
async def recommend_hybrid(
    payload: SeedRecommendRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Hybrid Seed-Based Recommendation Endpoint (MARQUEE Style):
    Analyzes the 5+ selected seed dishes and outputs the #1 best recommendation + top picks.
    """
    return await get_hybrid_seed_recommendations(
        db=db,
        seed_ids=payload.seed_ids,
        persona=payload.persona,
        budget=payload.budget,
        eta=payload.eta,
        is_veg=payload.is_veg,
        is_high_protein=payload.is_high_protein,
        is_keto=payload.is_keto,
        is_gluten_free=payload.is_gluten_free
    )

@app.get("/benchmark/compare")
async def benchmark_comparison():
    return {
        "product_name": "IntentEats",
        "benchmark_against": "Zomato",
        "similarities": [
            "Horizontal category browsing carousels",
            "ETA and delivery time predictions",
            "Rich food cards with ratings, prices, and high-res imagery"
        ],
        "differences": [
            "IntentEats forces intent/constraint selection first (Budget & ETA sliders) to eliminate Endless Scroll Fatigue.",
            "Zomato defaults to infinite scrolling discovery leading to choice overload.",
            "IntentEats provides transparent ML Explainability Badges for every item."
        ]
    }
