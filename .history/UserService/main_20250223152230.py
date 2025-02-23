from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import User
from schemas import UserCreate, UserResponse

app = FastAPI()

@app.post("/register/", response_model=UserResponse)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    existing_user = await db.execute(select(User).where(User.email == user.email))
    if existing_user.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(name=user.name, email=user.email)
    new_user.set_password(user.password)  # Hash password

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user
