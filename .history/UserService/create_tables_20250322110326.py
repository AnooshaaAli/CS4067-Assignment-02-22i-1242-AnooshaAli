from sqlalchemy import create_engine
from models import Base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:123456@localhost:5432/user_service_db")

engine = create_engine(DATABASE_URL, echo=True)

Base.metadata.create_all(engine)  # Force table creation
