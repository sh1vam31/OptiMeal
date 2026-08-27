import os
import json
import math
import datetime
import numpy as np
import pandas as pd
import xgboost as xgb
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models import FoodItem

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml")
MODEL_FILE = os.path.join(MODEL_DIR, "xgboost_food_ranker.json")
META_FILE = os.path.join(MODEL_DIR, "model_meta.json")

# Global loaded model instance
xgboost_model = None
feature_names = []

def load_ml_model():
    global xgboost_model, feature_names
    if os.path.exists(MODEL_FILE):
        try:
            xgboost_model = xgb.XGBRegressor()
            xgboost_model.load_model(MODEL_FILE)
            if os.path.exists(META_FILE):
                with open(META_FILE, "r") as f:
                    meta = json.load(f)
                    feature_names = meta.get("features", [])
            print("Successfully loaded XGBoost food ranking model into FastAPI backend.")
        except Exception as e:
            print(f"Warning: Failed to load XGBoost model: {e}")

# Call load on import
load_ml_model()

def generate_explainability_badges(item: FoodItem, budget: float, eta: float) -> list[dict]:
    badges = []
    if item.eta_mins <= 15:
        badges.append({"label": f"⚡ Ultra Fast - {item.eta_mins} mins", "color": "emerald"})
    elif item.eta_mins <= eta - 5:
        badges.append({"label": f"🚀 Fastest in {item.eta_mins} mins", "color": "emerald"})

    price_savings = budget - item.price
    if price_savings >= 150:
        badges.append({"label": f"💰 Best Value - Save ₹{int(price_savings)}", "color": "blue"})
    elif item.price <= 200:
        badges.append({"label": f"🏷️ Budget Pick ₹{int(item.price)}", "color": "blue"})

    if item.rating >= 4.8:
        badges.append({"label": f"⭐ Top Rated ({item.rating})", "color": "amber"})
    elif item.popularity_score >= 0.94:
        badges.append({"label": "🔥 Customer Favorite", "color": "purple"})

    if item.is_high_protein and item.protein_g >= 25:
        badges.append({"label": f"💪 High Protein ({int(item.protein_g)}g)", "color": "rose"})

    if not badges:
        badges.append({"label": "✅ Constraint Match", "color": "slate"})

    return badges[:2]

def calculate_diversity_score(items: list[FoodItem]) -> float:
    if not items:
        return 0.0
    categories = [i.category for i in items]
    unique_cats = set(categories)
    return float(len(unique_cats) / len(items))

def calculate_ndcg_score(ranked_items: list[dict], k: int = 5) -> float:
    if not ranked_items:
        return 0.0

    items_to_eval = ranked_items[:k]
    rel = [item.get("predicted_score", 0.5) for item in items_to_eval]

    dcg = sum((2**r - 1) / math.log2(idx + 2) for idx, r in enumerate(rel))
    idcg = sum((2**r - 1) / math.log2(idx + 2) for idx, r in enumerate(sorted(rel, reverse=True)))

    return float(dcg / idcg) if idcg > 0 else 1.0

async def candidate_generation(
    db: AsyncSession,
    budget: float,
    eta: float,
    is_veg: bool = False,
    is_high_protein: bool = False,
    is_keto: bool = False,
    is_gluten_free: bool = False,
    category: str = None,
    cuisines: list[str] = None,
    min_rating: float = 3.5,
    max_calories: int = 1000
) -> list[FoodItem]:
    stmt = select(FoodItem)
    conditions = []

    if budget is not None:
        conditions.append(FoodItem.price <= budget)
    if eta is not None:
        conditions.append(FoodItem.eta_mins <= eta)
    if is_veg:
        conditions.append(FoodItem.is_veg == True)
    if is_high_protein:
        conditions.append(FoodItem.is_high_protein == True)
    if is_keto:
        conditions.append(FoodItem.is_keto == True)
    if is_gluten_free:
        conditions.append(FoodItem.is_gluten_free == True)
    if category:
        conditions.append(FoodItem.category == category)
    if cuisines:
        conditions.append(FoodItem.category.in_(cuisines))
    
    conditions.append(FoodItem.rating >= min_rating)
    conditions.append(FoodItem.calories <= max_calories)

    if conditions:
        stmt = stmt.where(and_(*conditions))

    stmt = stmt.order_by(FoodItem.popularity_score.desc()).limit(1000)
    result = await db.execute(stmt)
    return result.scalars().all()

def get_dynamic_price(item: FoodItem) -> float:
    cat_l = item.category.lower()
    if "biryani" in cat_l or "north indian" in cat_l:
        return float(180 + (item.id * 37) % 270)
    elif "burger" in cat_l or "wrap" in cat_l:
        return float(120 + (item.id * 23) % 160)
    elif "pizza" in cat_l:
        return float(240 + (item.id * 41) % 320)
    elif "south indian" in cat_l:
        return float(90 + (item.id * 17) % 110)
    elif "healthy" in cat_l:
        return float(190 + (item.id * 29) % 210)
    elif "dessert" in cat_l or "beverage" in cat_l:
        return float(130 + (item.id * 19) % 180)
    else:
        return float(150 + (item.id * 31) % 240)

def prepare_features_for_xgboost(
    items: list[FoodItem],
    budget: float,
    eta: float,
    is_veg: bool = False,
    is_high_protein: bool = False,
    is_keto: bool = False,
    is_gluten_free: bool = False
) -> pd.DataFrame:
    rows = []
    for item in items:
        item_real_price = get_dynamic_price(item)
        price_ratio = float(item_real_price / max(1.0, budget))
        eta_margin = float(eta - item.eta_mins)
        rating_norm = float(item.rating / 5.0)

        diet_match = 0
        if is_veg and item.is_veg: diet_match += 1
        if is_high_protein and item.is_high_protein: diet_match += 1
        if is_keto and item.is_keto: diet_match += 1
        if is_gluten_free and item.is_gluten_free: diet_match += 1

        protein_ratio = float(item.protein_g / max(1.0, item.calories))

        rows.append({
            "price": float(item_real_price),
            "eta_mins": float(item.eta_mins),
            "rating": float(item.rating),
            "popularity_score": float(item.popularity_score),
            "calories": float(item.calories),
            "protein_g": float(item.protein_g),
            "price_ratio": price_ratio,
            "eta_margin": eta_margin,
            "rating_norm": rating_norm,
            "dietary_match_count": float(diet_match),
            "protein_ratio": protein_ratio
        })

    df = pd.DataFrame(rows)
    if feature_names:
        for f in feature_names:
            if f not in df.columns:
                df[f] = 0.0
        df = df[feature_names]
    return df

def rank_candidates_with_xgboost(
    candidates: list[FoodItem],
    budget: float,
    eta: float,
    is_veg: bool = False,
    is_high_protein: bool = False,
    is_keto: bool = False,
    is_gluten_free: bool = False,
    category_weights: dict = None
) -> list[dict]:
    if not candidates:
        return []

    if xgboost_model is not None:
        df_features = prepare_features_for_xgboost(
            candidates, budget, eta, is_veg, is_high_protein, is_keto, is_gluten_free
        )
        try:
            scores = xgboost_model.predict(df_features)
        except Exception as e:
            scores = [c.popularity_score * (c.rating / 5.0) for c in candidates]
    else:
        scores = [c.popularity_score * (c.rating / 5.0) for c in candidates]

    ranked = []
    for item, score in zip(candidates, scores):
        norm_score = float(1.0 / (1.0 + math.exp(-score))) if not (0.0 <= score <= 1.0) else float(score)
        
        if category_weights and item.category in category_weights:
            # Massive score multiplier using an aggressive multiplier curve
            weight = category_weights[item.category]
            norm_score *= (1.0 + (weight * 2.5))

        # Varied realistic prices based on category and dish ID
        item_real_price = get_dynamic_price(item)

        price_score = max(0.0, (budget - item_real_price) / max(1.0, budget))
        speed_score = max(0.0, (eta - item.eta_mins) / max(1.0, eta))
        rating_score = max(0.0, (item.rating - 3.0) / 2.0)
        
        diet_score = 0.2
        if is_veg and item.is_veg: diet_score += 0.3
        if is_high_protein and item.is_high_protein: diet_score += 0.3

        w_price, w_speed, w_rating, w_diet = 0.35, 0.30, 0.20, 0.15
        val_price = price_score * w_price
        val_speed = speed_score * w_speed
        val_rating = rating_score * w_rating
        val_diet = diet_score * w_diet

        total_attr = val_price + val_speed + val_rating + val_diet
        if total_attr <= 0: total_attr = 1.0

        budget_pct = int(round((val_price / total_attr) * 100))
        speed_pct = int(round((val_speed / total_attr) * 100))
        rating_pct = int(round((val_rating / total_attr) * 100))
        diet_match_pct = int(round((val_diet / total_attr) * 100))

        savings = max(0, int(budget - item_real_price))
        time_saved = max(0, int(eta - item.eta_mins))

        item_dict = {
            "id": item.id,
            "name": item.name,
            "category": item.category,
            "restaurant_name": item.restaurant_name,
            "price": item_real_price,
            "rating": item.rating,
            "rating_count": item.rating_count,
            "eta_mins": item.eta_mins,
            "calories": item.calories,
            "protein_g": item.protein_g,
            "is_veg": item.is_veg,
            "is_high_protein": item.is_high_protein,
            "is_keto": item.is_keto,
            "is_gluten_free": item.is_gluten_free,
            "image_url": item.image_url,
            "popularity_score": item.popularity_score,
            "predicted_score": round(norm_score, 4),
            "description": item.description,
            "explainability_badges": generate_explainability_badges(item, budget, eta),
            "ml_match_breakdown": {
                "budget_fit_pct": budget_pct,
                "speed_pct": speed_pct,
                "rating_pct": rating_pct,
                "diet_match_pct": diet_match_pct,
                "budget_desc": f"Saves ₹{savings} under max budget limit" if savings > 0 else "Within budget limit",
                "speed_desc": f"Arrives in {item.eta_mins} mins ({time_saved}m faster than limit)" if time_saved > 0 else f"Arrives in {item.eta_mins} mins",
                "category_weight_pct": int(round((category_weights[item.category] * 100))) if category_weights and item.category in category_weights else 0
            }
        }
        ranked.append(item_dict)

    ranked.sort(key=lambda x: x["predicted_score"], reverse=True)
    
    # Normalize scores with Min-Max scaling so they are spread between 75% and 99%
    if len(ranked) > 1:
        max_score = ranked[0]["predicted_score"]
        min_score = ranked[-1]["predicted_score"]
        if max_score > min_score:
            for item in ranked:
                scaled = 0.75 + (item["predicted_score"] - min_score) * (0.99 - 0.75) / (max_score - min_score)
                item["predicted_score"] = round(scaled, 4)
        elif max_score > 0.99:
            for item in ranked:
                item["predicted_score"] = 0.99

    return ranked

async def get_exploration_recommendations(
    db: AsyncSession,
    budget: float,
    eta: float,
    is_veg: bool = False,
    is_high_protein: bool = False,
    is_keto: bool = False,
    is_gluten_free: bool = False,
    cuisines: list[str] = None,
    min_rating: float = 3.5,
    max_calories: int = 1000
) -> dict:
    candidates = await candidate_generation(
        db=db,
        budget=budget,
        eta=eta,
        is_veg=is_veg,
        is_high_protein=is_high_protein,
        is_keto=is_keto,
        is_gluten_free=is_gluten_free,
        cuisines=cuisines,
        min_rating=min_rating,
        max_calories=max_calories
    )

    if not candidates:
        return await handle_no_match_fallback(db, budget, eta, is_veg, is_high_protein, is_keto, is_gluten_free, min_rating, max_calories)

    ranked_candidates = rank_candidates_with_xgboost(
        candidates=candidates,
        budget=budget,
        eta=eta,
        is_veg=is_veg,
        is_high_protein=is_high_protein,
        is_keto=is_keto,
        is_gluten_free=is_gluten_free
    )

    category_counts = {}
    category_cards = []
    seen_names = {}  # Tracks how many times a name has been seen

    for item in ranked_candidates:
        name_key = item["name"].lower()
        name_count = seen_names.get(name_key, 0)
        
        # Only allow 1 of the same dish name to prevent repeating dishes
        if name_count >= 1:
            continue
            
        cat = item["category"]
        cat_count = category_counts.get(cat, 0)
        # Allow up to 12 per category to fill the larger grid
        if cat_count < 12:
            category_counts[cat] = cat_count + 1
            seen_names[name_key] = name_count + 1
            category_cards.append(item)
            if len(category_cards) == 140:
                break

    if len(category_cards) < 140:
        existing_ids = {x["id"] for x in category_cards}
        for item in ranked_candidates:
            name_key = item["name"].lower()
            name_count = seen_names.get(name_key, 0)
            
            if item["id"] not in existing_ids and name_count < 1:
                seen_names[name_key] = name_count + 1
                category_cards.append(item)
                existing_ids.add(item["id"])
                if len(category_cards) == 140:
                    break

    diversity_score = calculate_diversity_score(candidates)
    ndcg_score = calculate_ndcg_score(category_cards, k=5)

    hour = datetime.datetime.now().hour
    time_of_day_banner = "⚡ Late Night Favorites" if (hour >= 22 or hour < 6) else "🔥 Popular Meals Near You"

    return {
        "status": "success",
        "mode": "exploration",
        "time_of_day_banner": time_of_day_banner,
        "items": category_cards,
        "metrics": {
            "diversity_score": round(diversity_score, 2),
            "ndcg_score": ndcg_score,
            "total_candidates_filtered": len(candidates)
        }
    }

async def get_exploitation_recommendations(
    db: AsyncSession,
    category: str,
    budget: float,
    eta: float,
    is_veg: bool = False,
    is_high_protein: bool = False,
    is_keto: bool = False,
    is_gluten_free: bool = False
) -> dict:
    candidates = await candidate_generation(
        db=db,
        budget=budget,
        eta=eta,
        is_veg=is_veg,
        is_high_protein=is_high_protein,
        is_keto=is_keto,
        is_gluten_free=is_gluten_free,
        category=category
    )

    if not candidates:
        candidates = await candidate_generation(
            db=db,
            budget=budget * 1.3,
            eta=eta + 15,
            category=category
        )
        ranked = rank_candidates_with_xgboost(candidates, budget, eta)
        
        seen_names = set()
        deduped_ranked = []
        for item in ranked:
            if item["name"].lower() not in seen_names:
                seen_names.add(item["name"].lower())
                deduped_ranked.append(item)
        ranked = deduped_ranked

        return {
            "status": "partial_match",
            "mode": "exploitation",
            "category": category,
            "items": ranked,
            "metrics": {
                "ndcg_score": calculate_ndcg_score(ranked),
                "total_items": len(ranked)
            }
        }

    ranked = rank_candidates_with_xgboost(
        candidates=candidates,
        budget=budget,
        eta=eta,
        is_veg=is_veg,
        is_high_protein=is_high_protein,
        is_keto=is_keto,
        is_gluten_free=is_gluten_free
    )

    seen_names = set()
    deduped_ranked = []
    for item in ranked:
        if item["name"].lower() not in seen_names:
            seen_names.add(item["name"].lower())
            deduped_ranked.append(item)
    ranked = deduped_ranked

    ndcg_score = calculate_ndcg_score(ranked, k=5)

    return {
        "status": "success",
        "mode": "exploitation",
        "category": category,
        "items": ranked,
        "metrics": {
            "ndcg_score": ndcg_score,
            "total_items": len(ranked)
        }
    }

async def get_hybrid_seed_recommendations(
    db: AsyncSession,
    seed_ids: list[int],
    persona: str = None,
    budget: float = 500.0,
    eta: float = 30.0,
    is_veg: bool = False,
    is_high_protein: bool = False,
    is_keto: bool = False,
    is_gluten_free: bool = False
) -> dict:
    seed_stmt = select(FoodItem).where(FoodItem.id.in_(seed_ids))
    res = await db.execute(seed_stmt)
    seed_items = res.scalars().all()

    category_counts = {}
    for item in seed_items:
        category_counts[item.category] = category_counts.get(item.category, 0) + 1
    
    total_seeds = len(seed_items) if seed_items else 1
    category_weights = {k: v / total_seeds for k, v in category_counts.items()}

    seed_categories = list(category_counts.keys())
    seed_names = [item.name for item in seed_items]

    if seed_categories:
        candidates = await candidate_generation(
            db=db,
            budget=budget * 1.5,
            eta=eta + 20,
            is_veg=is_veg,
            is_high_protein=is_high_protein,
            is_keto=is_keto,
            is_gluten_free=is_gluten_free,
            cuisines=seed_categories
        )
    else:
        candidates = await candidate_generation(
            db=db,
            budget=budget * 1.5,
            eta=eta + 20,
            is_veg=is_veg,
            is_high_protein=is_high_protein,
            is_keto=is_keto,
            is_gluten_free=is_gluten_free
        )

    if not candidates:
        stmt = select(FoodItem)
        conds = []
        if is_veg: conds.append(FoodItem.is_veg == True)
        if is_high_protein: conds.append(FoodItem.is_high_protein == True)
        if is_keto: conds.append(FoodItem.is_keto == True)
        if is_gluten_free: conds.append(FoodItem.is_gluten_free == True)
        if conds:
            stmt = stmt.where(and_(*conds))
        stmt = stmt.order_by(FoodItem.rating.desc()).limit(30)
        res = await db.execute(stmt)
        candidates = res.scalars().all()

    ranked = rank_candidates_with_xgboost(
        candidates=candidates,
        budget=budget,
        eta=eta,
        is_veg=is_veg,
        is_high_protein=is_high_protein,
        is_keto=is_keto,
        is_gluten_free=is_gluten_free,
        category_weights=category_weights
    )

    seed_set = set(seed_ids)
    seen_names = set()
    recommendations = []
    
    for item in ranked:
        if item["id"] not in seed_set and item["name"].lower() not in seen_names:
            seen_names.add(item["name"].lower())
            recommendations.append(item)

    if not recommendations:
        for item in ranked:
            if item["name"].lower() not in seen_names:
                seen_names.add(item["name"].lower())
                recommendations.append(item)
        
    # Limit to top 60 matches so the feed isn't overwhelmingly long
    recommendations = recommendations[:60]

    return {
        "status": "success",
        "mode": "hybrid_seed",
        "seed_count": len(seed_ids),
        "seed_names": seed_names,
        "items": recommendations,
        "metrics": {
            "ndcg_score": calculate_ndcg_score(recommendations, k=5),
            "total_items": len(recommendations)
        }
    }

async def handle_no_match_fallback(
    db: AsyncSession,
    budget: float,
    eta: float,
    is_veg: bool = False,
    is_high_protein: bool = False,
    is_keto: bool = False,
    is_gluten_free: bool = False,
    min_rating: float = 3.5,
    max_calories: int = 1000
) -> dict:
    conds = [
        FoodItem.price <= budget + 250,
        FoodItem.eta_mins <= eta + 25
    ]
    if is_veg: conds.append(FoodItem.is_veg == True)
    if is_high_protein: conds.append(FoodItem.is_high_protein == True)
    if is_keto: conds.append(FoodItem.is_keto == True)
    if is_gluten_free: conds.append(FoodItem.is_gluten_free == True)
    
    conds.append(FoodItem.rating >= min_rating)
    conds.append(FoodItem.calories <= max_calories)

    relaxed_stmt = select(FoodItem).where(and_(*conds)).limit(6)

    res = await db.execute(relaxed_stmt)
    fallback_items = res.scalars().all()

    if not fallback_items:
        fallback_conds = []
        if is_veg: fallback_conds.append(FoodItem.is_veg == True)
        if is_high_protein: fallback_conds.append(FoodItem.is_high_protein == True)
        if is_keto: fallback_conds.append(FoodItem.is_keto == True)
        if is_gluten_free: fallback_conds.append(FoodItem.is_gluten_free == True)
        
        fallback_conds.append(FoodItem.rating >= min_rating)
        fallback_conds.append(FoodItem.calories <= max_calories)
        
        fallback_stmt = select(FoodItem)
        if fallback_conds:
            fallback_stmt = fallback_stmt.where(and_(*fallback_conds))
        fallback_stmt = fallback_stmt.order_by(FoodItem.rating.desc()).limit(6)
        res = await db.execute(fallback_stmt)
        fallback_items = res.scalars().all()

    ranked_fallback = rank_candidates_with_xgboost(fallback_items, budget, eta)

    return {
        "status": "no_match",
        "mode": "fallback",
        "message": f"No exact matches under ₹{int(budget)} delivered within {int(eta)} mins. Here are the closest alternatives:",
        "items": ranked_fallback[:5],
        "metrics": {
            "diversity_score": round(calculate_diversity_score(fallback_items[:5]), 2),
            "total_candidates_filtered": 0,
            "is_fallback": True
        }
    }

async def get_trending_recommendations(db: AsyncSession) -> dict:
    hour = datetime.datetime.now().hour

    if 6 <= hour < 11:
        meal_type = "Breakfast"
        banner_text = "Trending Morning Breakfast & Coffee ☕. Adjust sliders to personalize."
        pref_categories = ["South Indian", "Beverages", "Healthy & Salads"]
    elif 11 <= hour < 16:
        meal_type = "Lunch"
        banner_text = "Popular Lunch Specials Right Now 🍛. Adjust sliders to personalize."
        pref_categories = ["Biryani", "North Indian", "Asian & Bowls", "Rolls & Wraps"]
    elif 16 <= hour < 19:
        meal_type = "Evening Snacks"
        banner_text = "Quick Evening Snacks & Drinks 🍔. Adjust sliders to personalize."
        pref_categories = ["Burgers", "Rolls & Wraps", "Beverages", "Desserts"]
    else:
        meal_type = "Dinner"
        banner_text = "Top Night Dining & Comfort Meals 🍕. Adjust sliders to personalize."
        pref_categories = ["Pizzas", "Biryani", "North Indian", "Burgers"]

    stmt = select(FoodItem).where(FoodItem.category.in_(pref_categories)).order_by(FoodItem.popularity_score.desc()).limit(5)
    res = await db.execute(stmt)
    items = res.scalars().all()

    ranked = rank_candidates_with_xgboost(items, budget=500, eta=30)

    return {
        "status": "success",
        "meal_type": meal_type,
        "banner_text": banner_text,
        "items": ranked
    }
