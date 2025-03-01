from fastapi import FastAPI, Depends, HTTPException, Security
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from sqlalchemy.future import select
import bcrypt
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from routes.event_routes import router as event_router
import requests

# Import your database session function
from database import get_db  # Ensure this is correct
from models import User  # Import User model

app = FastAPI()

# Add CORS Middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(event_router)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')  # Convert bytes to string for storage

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

@app.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await db.execute(select(User).where(User.email == user.email))
    if existing_user.scalar():
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, password_hash=hashed_password)

    db.add(new_user)
    await db.commit()

    return {"message": "User registered successfully"}

# Secret key for JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Define TokenResponse model
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# Function to create access token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/token", response_model=TokenResponse)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return TokenResponse(access_token=access_token, token_type="bearer")

async def get_current_user(token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"email": current_user}

EVENT_SERVICE_URL = "http://localhost:5002/api/events"  

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["event_db"]
events_collection = db["events"]

# Event Schema
class Event(BaseModel):
    title: str
    description: str
    date: str
    location: str
    price: float

# Convert MongoDB document to JSON format
def event_serializer(event):
    return {
        "_id": str(event["_id"]),  # Convert ObjectId to string
        "title": event["title"],
        "description": event["description"],
        "date": event["date"],
        "location": event["location"],
        "price": event["price"],
        "createdAt": event["createdAt"],
    }

# ✅ Get all events (from MongoDB)
@app.get("/events")
async def get_events():
    events = list(events_collection.find())
    return [event_serializer(event) for event in events]

# ✅ Add a new event (to MongoDB)
@app.post("/events")
async def add_event(event: Event):
    event_data = event.dict()
    event_data["createdAt"] = datetime.utcnow()  # Add createdAt timestamp
    result = events_collection.insert_one(event_data)
    return {"message": "Event added successfully", "event": event_serializer(events_collection.find_one({"_id": result.inserted_id}))}