# User Service - FastAPI Microservice  

This is the **User Service** for the Event Booking System, built using **FastAPI** with **PostgreSQL** as the database and **REST API** for communication.  

---

## 📂 Project Setup  

### 1️⃣ **Set Up Virtual Environment**  
To keep dependencies isolated, we use a virtual environment.  

#### ➤ **Create and Activate Virtual Environment**  
**Windows:**  
```sh
python -m venv venv
venv\Scripts\activate
```  
**Mac/Linux:**  
```sh
python3 -m venv venv
source venv/bin/activate
```  

---

If you ever want to deactivate the virtual env, use these commands in the folder/dictory you crearted the virtaul env:

#### **Deactivate the Virtual Environment**  
If it's currently activated, run:  
```sh
deactivate
```

#### **Delete the Virtual Environment Folder**  
Find the virtual environment folder (likely named `venv` or `.venv`) in the root of your repository and delete it manually, or run:  
```sh
rm -rf venv  # Mac/Linux
rmdir /s /q venv  # Windows (PowerShell)
```

---

### 2️⃣ **Install Dependencies**  
```sh
pip install fastapi uvicorn sqlalchemy psycopg2-binary
```  

---

### 3️⃣ **Generate `requirements.txt`**  
```sh
pip freeze > requirements.txt
```  
This allows others to install the same dependencies by running:  
```sh
pip install -r requirements.txt
```  

---

No problem! The `requirements.txt` file is used to keep track of dependencies, but it won't exist until you create it. Here's how to fix everything:  

---

### **📌 Fixing the Virtual Environment & Dependencies**
Now that you have the virtual environment inside `user-service`, let's set up dependencies properly.

#### **1️⃣ Activate the Virtual Environment**  
Make sure you're inside `user-service` and activate it:  

For **Mac/Linux**:
```sh
source venv/bin/activate
```
For **Windows**:
```sh
venv\Scripts\activate
```

---

#### **2️⃣ Install Required Packages**  
Since you're using **FastAPI** and **PostgreSQL**, install the necessary dependencies:

```sh
pip install fastapi uvicorn
```

- `fastapi` → The framework  
- `uvicorn` → ASGI server to run FastAPI  
- `psycopg2` → PostgreSQL driver  
- `sqlalchemy` → ORM to interact with PostgreSQL  

After installing, run the command:

```sh
pip install --upgrade pip
```

---

#### **3️⃣ Create a `requirements.txt` File**  
After installing the dependencies, **generate a `requirements.txt` file** so others can install the same dependencies easily:

```sh
pip freeze > requirements.txt
```

Now, your project has all the necessary packages documented.

---

#### **4️⃣ Verify Everything Works**  
Try running a basic FastAPI server to check that everything is set up correctly:

Create a file called `main.py` (if not present already) inside `user-service` and add this:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI User Service is running!"}
```

Then, run the server:

```sh
uvicorn main:app --reload
```

If you see output like this:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

You’re good to go! 🎉 You can visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser to see the API.

---

## 📂 Database Setup  

If you don’t have PostgreSQL installed yet, the next step is to **install and set up PostgreSQL** on your laptop.  

---

## **Step 1: Install PostgreSQL**
### **For Mac (Recommended: Using Homebrew)**
1. **Install PostgreSQL using Homebrew:**  
   ```sh
   brew install postgresql
   ```
2. **Start the PostgreSQL service:**  
   ```sh
   brew services start postgresql
   ```
3. **Verify installation by logging into PostgreSQL:**  
   ```sh
   psql -U postgres
   ```

---

### **For Windows (Using Installer)**
1. **Download PostgreSQL** from the official site:  
   👉 [Download Here](https://www.postgresql.org/download/)
2. **Run the installer** and follow these steps:
   - Choose the latest version.
   - Select **pgAdmin** (GUI for PostgreSQL).
   - Set a password for the `postgres` user.
3. **Verify installation**  
   Open **pgAdmin** or run this in the terminal:  
   ```sh
   psql -U postgres
   ```

---

## **Step 2: Create a Database**
Once PostgreSQL is installed, create a database for your user service.

1. **Access PostgreSQL CLI**  
   ```sh
   psql -U postgres
   ```
2. **Create a new database (Replace `user_service_db` with your preferred name)**  
   ```sql
   CREATE DATABASE user_service_db;
   ```
3. **Verify the database**  
   ```sql
   \l
   ```

--- 

## 📂 Integrate Database with the Project

Once your PostgreSQL database is set up and running, follow these steps for the User Service:

1. **Step 1: Install PostgreSQL Client Library**  
   Since you're using PostgreSQL as the database, install `asyncpg` and `SQLAlchemy`:  
   ```sh
   pip install asyncpg sqlalchemy
   ```

2. **Step 2: Set Up Database Connection**  
   - Create a new file, e.g., `database.py` (if not present already), and add the connection logic:
   ```python
    from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
    from sqlalchemy.orm import sessionmaker
    import os

    DATABASE_URL = "postgresql+asyncpg://yourusername:yourpassword@localhost:5432/yourdbname"  # Replace yourusername, yourpassword and yourdbname with your actual PostgreSQL credentials.

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
   ```

3. **Create User Model**  
   - Create a new file `models.py`(if not present already) inside `UserService` and define the `User` table:
   ```python
    from sqlalchemy import Column, Integer, String
    from sqlalchemy.ext.declarative import declarative_base

    Base = declarative_base()

    class User(Base):
        __tablename__ = "users"

        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, nullable=False)
        email = Column(String, unique=True, nullable=False)
        password = Column(String, nullable=False)
   ```

4. **Apply Migrations**  
   - Install Alembic for database migrations:
     ```sh
     pip install alembic
     alembic init migrations
     ```
   - Configure Alembic to use your `DATABASE_URL`.
    Edit `migrations/env.py`, find:
    ```python
    from sqlalchemy import create_engine
    ```
    Change it to:
    ```python
    from sqlalchemy.ext.asyncio import create_async_engine
    from UserService.database import DATABASE_URL
    ```
    Then modify `engine`:
    ```python
    engine = create_async_engine(DATABASE_URL, echo=True)
    ```
   - Run migrations:
     ```sh
     alembic revision --autogenerate -m "create users table"
     alembic upgrade head
     ```

5. **Verify in PostgreSQL**
1. Connect to your PostgreSQL database:
   ```bash
   psql -U your_username -d your_database
   ```
   (Replace `your_username` and `your_database` with the actual values.)
   
2. Check if the `users` table exists:
   ```sql
   \dt
   ```

3. Check the table structure:
   ```sql
   \d users
   ```

6. **Next Steps**
- If you need to add more tables or modify the schema, update your `models.py` and generate a new revision:
  ```bash
  alembic revision --autogenerate -m "your message"
  ```
- Then apply the changes:
  ```bash
  alembic upgrade head
  ```

6. **Create API Endpoints for User Service**  
   - Example in `main.py`:
   ```python
   from fastapi import FastAPI, Depends
   from sqlalchemy.ext.asyncio import AsyncSession
   from database import get_db
   from models import User

   app = FastAPI()

   @app.get("/users/")
   async def get_users(db: AsyncSession = Depends(get_db)):
       result = await db.execute("SELECT * FROM users")
       return result.fetchall()
   ```

---

Now that your **User Service** is set up with **FastAPI**, **PostgreSQL**, and **Alembic migrations**, the next steps are:  

---

## **1️⃣ Implement User Authentication**  
Your service needs authentication for user management. You'll implement:  
✅ **Password Hashing** using `bcrypt`  
✅ **User Registration**  
✅ **User Login** with JWT Authentication  

### **Install Required Packages**  
```sh
pip install "passlib[bcrypt]" "python-jose[cryptography]" "python-multipart"
```  

---

### **Update `models.py`** – Add Password Hashing  
Modify your `User` model to **hash passwords** instead of storing them in plaintext:  

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext

Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)  # Store hashed password

    def set_password(self, password: str):
        self.password_hash = pwd_context.hash(password)

    def verify_password(self, password: str):
        return pwd_context.verify(password, self.password_hash)
```

---

### **Create a `schemas.py` File**  
Define Pydantic models for request validation:  

```python
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True
```

---

### **Update `main.py` – Implement User Registration**  
Now, add an endpoint to **register users**:  

```python
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
```

✅ **Now, you can register a user!** 🎉  
Send a `POST` request to `/register/` with a JSON body:  
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
}
```

---

## **2️⃣ Implement JWT Authentication**  
Your service should return a **JWT token** after login.  

### **Update `schemas.py`**
Add a schema for login:  

```python
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
```

---

### **Update `main.py` – Implement Login & JWT Token Generation**  

#### **Install JWT Dependencies**  
```sh
pip install "passlib[bcrypt]" "python-jose[cryptography]"
```

#### **Add JWT Authentication Logic**  
Modify `main.py`:

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# Secret key for JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/token", response_model=TokenResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await db.execute(select(User).where(User.email == form_data.username))
    user = user.scalars().first()
    
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return {"access_token": access_token, "token_type": "bearer"}
```

✅ **Now, you can log in!** 🎉  
Send a `POST` request to `/token` with `application/x-www-form-urlencoded` body:  
```sh
curl -X 'POST' 'http://127.0.0.1:8000/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'username=john@example.com' \
--data-urlencode 'password=securepassword'
```
**Response:**  
```json
{
    "access_token": "your_jwt_token_here",
    "token_type": "bearer"
}
```

---

## **3️⃣ Secure Endpoints with Authentication**
Now that users can log in, let's secure routes by requiring a JWT token.

### **Update `main.py` – Add Token Authentication**
Modify `main.py`:

```python
from fastapi import Security
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
```

✅ **Now, `/users/me` requires authentication!**  
Try calling it without a token:
```sh
curl -X 'GET' 'http://127.0.0.1:8000/users/me'
```
You'll get:  
```json
{
    "detail": "Not authenticated"
}
```
Pass the token in the header:
```sh
curl -X 'GET' 'http://127.0.0.1:8000/users/me' -H "Authorization: Bearer your_jwt_token_here"
```

🎉 Now it works! You'll see:
```json
{
    "email": "john@example.com"
}
```

---

## **4️⃣ Dockerize the Microservice**  
To deploy your FastAPI service, let's containerize it using **Docker**.

#### **Step 1: Create a `Dockerfile`**
Inside your `user-service/` directory, create a `Dockerfile`:
```dockerfile
FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### **Step 2: Create `docker-compose.yml`**
If you want to run PostgreSQL along with the FastAPI service, create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:latest
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: user_service_db
    ports:
      - "5432:5432"

  user-service:
    build: .
    container_name: user_service
    restart: always
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/user_service_db
    ports:
      - "8000:8000"
```

---

## 🚀 **Next Steps**
✅ **Unit Tests** (Using `pytest`)  
✅ **Implement CRUD (Create, Read, Update, Delete) for Users**  
✅ **Deploy to AWS/GCP using Docker**  

Would you like me to guide you on any of these next steps? 😊

## ⚠️ **Important Notes**  
- **DO NOT commit the `venv/` folder**.  
- Add `venv/` to `.gitignore`.  
- Commit & push `requirements.txt` to GitHub.  

---
