import os
import json
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(MODEL_DIR, "xgboost_food_ranker.json")

FEATURE_NAMES = [
    "price",
    "prep_time",
    "eta_mins",
    "rating",
    "is_veg",
    "is_high_protein",
    "is_keto",
    "is_gluten_free",
    "popularity_score",
    "budget_constraint",
    "eta_constraint",
    "budget_diff",
    "eta_diff",
    "budget_fit_ratio",
    "eta_fit_ratio",
    "diet_match_score",
]

def generate_synthetic_dataset(num_samples: int = 5000):
    """
    Generates synthetic training dataset mimicking food delivery user-item interactions
    under dynamic context constraints (budget, ETA, dietary preferences).
    """
    np.random.seed(42)

    data = []
    categories = [
        "Burgers", "Pizzas", "Rolls & Wraps", "Biryani", "Asian & Bowls",
        "Desserts", "South Indian", "North Indian", "Healthy & Salads", "Beverages"
    ]

    for _ in range(num_samples):
        cat = np.random.choice(categories)
        price = round(float(np.random.uniform(100, 950)), 2)
        prep_time = int(np.random.randint(10, 40))
        dist_mins = int(np.random.randint(5, 25))
        eta_mins = prep_time + dist_mins
        rating = round(float(np.random.uniform(3.6, 4.9)), 1)

        is_veg = bool(np.random.choice([True, False], p=[0.45, 0.55]))
        is_high_protein = bool(np.random.choice([True, False], p=[0.35, 0.65]))
        is_keto = bool(np.random.choice([True, False], p=[0.2, 0.8]))
        is_gluten_free = bool(np.random.choice([True, False], p=[0.25, 0.75]))
        popularity_score = round(float(np.random.uniform(0.3, 0.99)), 2)

        # Context constraints simulated from user session
        budget_constraint = float(np.random.choice([150, 250, 350, 500, 750, 1000]))
        eta_constraint = float(np.random.choice([20, 30, 45, 60]))

        req_veg = bool(np.random.choice([True, False], p=[0.4, 0.6]))
        req_protein = bool(np.random.choice([True, False], p=[0.3, 0.7]))
        req_keto = bool(np.random.choice([True, False], p=[0.15, 0.85]))

        # Computed features
        budget_diff = budget_constraint - price
        eta_diff = eta_constraint - eta_mins
        budget_fit_ratio = price / max(budget_constraint, 1.0)
        eta_fit_ratio = eta_mins / max(eta_constraint, 1.0)

        # Diet match computation
        diet_match = 1.0
        if req_veg and not is_veg:
            diet_match -= 0.5
        if req_protein and not is_high_protein:
            diet_match -= 0.3
        if req_keto and not is_keto:
            diet_match -= 0.3
        diet_match_score = max(0.0, diet_match)

        # Target relevance score calculation
        # Higher score if fits budget, fast ETA, high rating, and matches dietary needs
        budget_score = 1.0 if budget_diff >= 0 else max(0.0, 1.0 + (budget_diff / 200.0))
        eta_score = 1.0 if eta_diff >= 0 else max(0.0, 1.0 + (eta_diff / 30.0))
        rating_score = (rating - 3.5) / 1.5

        relevance = (
            0.35 * budget_score +
            0.30 * eta_score +
            0.20 * rating_score +
            0.10 * diet_match_score +
            0.05 * popularity_score
        )
        # Add slight noise
        relevance += np.random.normal(0, 0.02)
        relevance = float(np.clip(relevance, 0.0, 1.0))

        data.append({
            "price": price,
            "prep_time": prep_time,
            "eta_mins": eta_mins,
            "rating": rating,
            "is_veg": int(is_veg),
            "is_high_protein": int(is_high_protein),
            "is_keto": int(is_keto),
            "is_gluten_free": int(is_gluten_free),
            "popularity_score": popularity_score,
            "budget_constraint": budget_constraint,
            "eta_constraint": eta_constraint,
            "budget_diff": budget_diff,
            "eta_diff": eta_diff,
            "budget_fit_ratio": budget_fit_ratio,
            "eta_fit_ratio": eta_fit_ratio,
            "diet_match_score": diet_match_score,
            "relevance_score": relevance
        })

    return pd.DataFrame(data)

def train_and_save_model():
    print("Generating synthetic food recommendation dataset...")
    df = generate_synthetic_dataset(num_samples=8000)

    X = df[FEATURE_NAMES]
    y = df["relevance_score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training XGBoost Regressor model...")
    model = xgb.XGBRegressor(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    print(f"Model Training Completed. Test MSE: {mse:.6f}")

    # Save model
    model.save_model(MODEL_FILE)
    print(f"Saved XGBoost model to {MODEL_FILE}")

    # Save feature names list metadata
    meta_path = os.path.join(MODEL_DIR, "model_meta.json")
    with open(meta_path, "w") as f:
        json.dump({"features": FEATURE_NAMES, "mse": float(mse)}, f, indent=2)
    print(f"Saved metadata to {meta_path}")

if __name__ == "__main__":
    train_and_save_model()
