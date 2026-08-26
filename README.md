# OptiMeal – Context-Aware Food Recommender System

> A responsive Single Page Application (SPA) designed to solve the **"Paradox of Choice"** in food delivery platforms through strict context constraint filtering and dynamic XGBoost item ranking.

**Live Deployment**: `[Deployment Link Will Go Here]`

---

## 1. Problem Statement
Modern food delivery platforms like Zomato and UberEats present users with endless scroll feeds and thousands of restaurant options. When hungry, users face **Choice Overload** (The Paradox of Choice), spending 20+ minutes scrolling through listings instead of placing an order. Current recommendation engines optimize for absolute engagement (dwell time) rather than immediate user constraints (budget, speed, diet).

## 2. Use Case and Motivation
**OptiMeal** flips this paradigm by enforcing an **Intent-First Selection** use case.
Instead of showing generic "Popular Near You" carousels, the system asks for the user's strict current context (Budget limits, Max Delivery Time, and Dietary preferences). The motivation is to build a system that guarantees the user will only see the top 10 meals they can actually afford to order right now.

## 3. Approach & Recommendation Methodology
OptiMeal uses a **Two-Stage Hybrid Architecture**:
1. **Stage 1: Candidate Generation (SQL)**: When a request is made, the PostgreSQL/SQLite database instantly filters out any food items that violate the user's hard constraints (e.g., dropping anything over ₹500 or taking longer than 30 minutes). This narrows the 14,000+ item dataset down to ~40 candidates in under 15ms.
2. **Stage 2: Ranking Engine (XGBoost ML)**: The remaining candidates are passed to an XGBoost Regressor model. The model ranks items by weighting four key signals:
   - *Budget Savings Margin* (40%)
   - *ETA Speed Advantage* (30%)
   - *Dietary Alignment* (20%)
   - *Bayesian Rating Quality Prior* (10%)
3. **Stage 3: Maximal Marginal Relevance (MMR)**: A final diversity pass ensures no duplicate categories flood the top 10 list.

## 4. System Architecture
```
+-----------------------------------------------------------------------------------+
|                           React SPA (Vite + Tailwind CSS)                         |
|  +-----------------------------+     +-----------------------------------------+  |
|  | Refine Search Panel         |     | Main Feed / UI                          |  |
|  | - Budget Slider (<₹1000)    |     | - Top 10 Dynamic Grid                   |  |
|  | - ETA Slider (<60m)         |     | - "Why this meal?" Details Modal        |  |
|  | - Dietary & Cuisine Toggles |     | - Transparent Metrics & Explainability  |  |
|  +--------------+--------------+     +-----------------------------------------+  |
+-----------------|-----------------------------------------------------------------+
                  | Dynamic JSON Payload Fetch 
                  v
+-----------------------------------------------------------------------------------+
|                             FastAPI REST Backend                                  |
|   Stage 1: SQL Candidate Generation (SQLite/Postgres Composite Indexing)          |
|                                       | Candidate Items (<15ms)                   |
|   Stage 2: ML Item Ranking            v                                           |
|   - XGBoost Regressor Model Inference + MMR Diversity Filter                      |
+-----------------------------------------------------------------------------------+
```

## 5. Dataset Selection
- **Dataset Source**: Inspired by and derived from the Kaggle Zomato Restaurants & Food Dataset (`shrutimehta/zomato-restaurants-data`).
- **Scale**: 14,512 cleaned food item records across global and Indian cities.
- **Features**: Structured SQL entities containing real dish names, categories, ratings, prices, prep_times, ETAs, and calculated macro-nutrients (Calories, Protein, Carbs) with dietary flags (`is_veg`, `is_high_protein`, `is_keto`, `is_gluten_free`).

## 6. Technologies Used
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Python, FastAPI, SQLAlchemy (SQLite/PostgreSQL).
- **Machine Learning**: XGBoost, Scikit-learn, Pandas, NumPy.

## 7. Assumptions Made
1. **Static Inventory**: Assumes all food items in the database are currently available (no live "sold out" webhook hooks).
2. **Simulated Geospatial Data**: Since live routing APIs (like Google Maps) are expensive, ETA and delivery constraints are simulated using backend prep-time heuristics.
3. **Explicit Feedback**: Assumes the user is willing to explicitly state their constraints (Budget/ETA) rather than inferring them implicitly from click-stream data.

## 8. Key Design Decisions
1. **Explainability Over Black Box**: Added a click-to-open detail modal on every dish card that explicitly tells the user *why* a dish was recommended (e.g., "Saves ₹200", "High Protein match").
2. **"How It Works" Engineering Page**: Built an interactive transparency page directly into the app (inspired by Netflix's engineering blog) to explain the algorithm visually.
3. **Strict Two-Stage Split**: Decision to use SQL for hard filtering rather than relying on ML for constraints ensures 100% adherence to user budgets and sub-20ms latency.

## 9. Evaluation Methodology
The success of OptiMeal is evaluated using business logic and offline ranking metrics rather than purely stochastic accuracy:
- **Constraint Satisfaction Rate (Precision)**: Must be 100%. If a user says Budget < ₹300, 0 items above ₹300 should be returned.
- **Rank Latency**: Measured via middleware headers. Target is P50 < 15ms.
- **Diversity Score (Coverage)**: Measured by category entropy. The MMR penalty ensures users see diverse dish types (burgers, salads, bowls) rather than 10 identical chicken wraps.

## 10. Test Cases
### Successful Scenario
- **Input**: User selects Budget < ₹350, ETA < 30 mins, and "High Protein" + "Non-Veg".
- **Result**: The SQL engine instantly drops all expensive steaks and slow-cooking pizzas. The XGBoost engine ranks a ₹250 Grilled Chicken Salad (15m prep time) as #1. The UI correctly renders the "High Protein" and "Saves ₹100" explainability badges.

### Failure Scenario (Over-Constrained)
- **Input**: User selects contradictory constraints: Budget < ₹50, Minimum Rating > 4.5 Stars, "Vegan" + "Keto".
- **Result**: The system struggles because no 5-star Vegan Keto meals exist for ₹50. 
- **Handling**: The SQL candidate generator returns 0 results. The backend gracefully catches this and triggers an "Auto-Relax" fallback, returning the closest matches while informing the user their constraints were too strict.

## 11. Known Limitations
1. No collaborative filtering (user-item matrix). Recommendations are entirely content-based and constraint-driven.
2. The model relies on explicit filters rather than implicit session dwell time.
3. Cold start for completely new users requires them to manually adjust sliders rather than instantly predicting their budget context.

## 12. Future Improvements
1. **Two-Tower Neural Ranker**: Replace or ensemble the XGBoost model with a Deep Learning model to capture non-linear feature interactions.
2. **LLM Diet Planner Integration**: Pass the Top 10 shortlist to an LLM to automatically generate a week-long personalized meal plan based on the user's exact macros.
3. **Multi-Armed Bandit (MAB)**: Implement UCB (Upper Confidence Bound) to occasionally explore and surface hidden gems that users wouldn't normally search for.

## 13. Bonus Challenge: Product Inspiration (Zomato & Swiggy)
**Inspiration**: OptiMeal's UI and core food delivery context takes heavy inspiration from **Zomato** and **Swiggy**.

- **Similarities**: Like Zomato, OptiMeal utilizes high-quality food photography, clear pricing, and restaurant metadata. It relies on a multi-stage pipeline (Filter -> Rank -> Diversify) common in large-scale food aggregators.
- **Differences**: Zomato prioritizes sponsored restaurants and generic carousels optimized for maximum scroll time. OptiMeal strictly prioritizes user constraints (Budget/ETA) and cuts off the list at 10 items to prevent choice paralysis. OptiMeal also features stateless content-based constraint solving rather than massive collaborative filtering.

---

## 14. Local Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/sh1vam31/OptiMeal.git
cd OptiMeal

# 2. Install backend dependencies & Train Model
python3 -m pip install -r requirements.txt
python3 ml/train_model.py

# 3. Start Backend API
PYTHONPATH=. python3 -m uvicorn backend.main:app --reload --port 8000

# 4. Start Frontend (In a new terminal)
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to interact with the system.
