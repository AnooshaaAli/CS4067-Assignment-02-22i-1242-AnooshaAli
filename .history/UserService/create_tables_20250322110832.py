import asyncio
from database import engine
from models import Base

async def init_db():
    async with engine.begin() as conn:
        print("🚀 Attempting to create tables...")  # Debugging print
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables should be created now!")

asyncio.run(init_db())  # Run the function
