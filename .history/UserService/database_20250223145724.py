from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

DATABASE_URL = "postgresql+asyncpg://postgres:123456@localhost:5432/user_service_db"

# Create Async Engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create Async Session
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Dependency for FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
