import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.models import Base, FoodItem
from ml.ingest_kaggle_dataset import load_kaggle_zomato_items

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./intenteats.db")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    """
    Initializes schema and seeds items into database directly from the Kaggle Zomato dataset.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        from sqlalchemy import select, func
        result = await session.execute(select(func.count(FoodItem.id)))
        count = result.scalar()
        if count > 0:
            print(f"Database already contains {count} items. Skipping ingestion.")
            return

        print("Ingesting real food dataset from Kaggle Zomato JSONs...")
        kaggle_items = load_kaggle_zomato_items()

        # Insert Swiggy food items into database
        food_objects = [FoodItem(**item) for item in kaggle_items] # Seed all diverse items
        session.add_all(food_objects)
        await session.commit()
        print(f"Successfully seeded {len(food_objects)} real Swiggy food items with image URLs into database!")

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
