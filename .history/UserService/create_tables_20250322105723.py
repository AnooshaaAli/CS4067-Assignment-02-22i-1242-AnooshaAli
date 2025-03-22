import asyncio
from database import engine
from models import Base  # Ensure 'Base' is imported from models.py

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Run the database initialization
if __name__ == "__main__":
    asyncio.run(init_db())
