from database import engine
from models import Base  # Import your declarative Base

import asyncio

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)  # Creates tables

asyncio.run(init_db())  # Run the function
