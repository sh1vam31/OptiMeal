from sqlalchemy import Column, Integer, String, Float, Boolean, Index
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    price = Column(Float, nullable=False, index=True)
    prep_time = Column(Integer, nullable=False, index=True) # minutes
    eta_mins = Column(Integer, nullable=False, index=True) # prep + delivery
    rating = Column(Float, nullable=False, default=4.0)
    rating_count = Column(Integer, nullable=False, default=120)
    popularity_score = Column(Float, nullable=False, default=0.5)

    is_veg = Column(Boolean, nullable=False, default=False)
    is_high_protein = Column(Boolean, nullable=False, default=False)
    is_keto = Column(Boolean, nullable=False, default=False)
    is_gluten_free = Column(Boolean, nullable=False, default=False)

    image_url = Column(String(500), nullable=False)
    description = Column(String(300), nullable=True)
    calories = Column(Integer, nullable=False, default=350)
    protein_g = Column(Float, nullable=False, default=15.0)
    carbs_g = Column(Float, nullable=False, default=40.0)
    fat_g = Column(Float, nullable=False, default=12.0)
    restaurant_name = Column(String(150), nullable=False, default="IntentEats Kitchen")

    __table_args__ = (
        Index("idx_category_price_prep", "category", "price", "prep_time"),
        Index("idx_price_eta", "price", "eta_mins"),
    )
