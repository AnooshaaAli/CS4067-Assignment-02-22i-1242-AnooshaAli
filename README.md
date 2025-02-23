# Event Booking System  

A **Microservices-based Event Booking System** built using **FastAPI**, **PostgreSQL**, and **RabbitMQ**. This system allows users to register, book events, and receive notifications through an event-driven architecture.

---

## **Project Structure**  

```bash
/Event-Booking-System
│── user-service/       # User Management (FastAPI, PostgreSQL)
│── event-service/      # Event Management (FastAPI, MongoDB)
│── booking-service/    # Booking & Payment (FastAPI, PostgreSQL, RabbitMQ)
│── notification-service/  # Notifications (RabbitMQ Consumer)
│── api-docs/           # OpenAPI/Swagger Documentation
│── docker-compose.yml  # Containerized Setup (Optional)
│── README.md           # Project Documentation
│── .gitignore          # Ignore Unnecessary Files
```

---

## **Tech Stack**  

| Service        | Framework  | Database   | Communication |
|---------------|-----------|------------|--------------|
| User Service  | FastAPI   | PostgreSQL | REST API     |
| Event Service | FastAPI   | MongoDB    | REST API     |
| Booking Service | FastAPI | PostgreSQL | REST + RabbitMQ |
| Notification Service | FastAPI | - | RabbitMQ |

---

## 🔧 **Setup Instructions**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/yourusername/Event-Booking-System.git
cd Event-Booking-System
```

### **2️⃣ Set Up Virtual Environments (For Each Microservice)**
Each microservice should have its own virtual environment to manage dependencies.  
**Example for `user-service`:**  
```sh
cd user-service
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

### **3️⃣ Install Dependencies**  
```sh
pip install -r requirements.txt
```

### **4️⃣ Set Up Environment Variables (`.env`)**  
Create a `.env` file inside each microservice folder and configure database & service URLs.  

Example for `user-service/.env`:  
```ini
DATABASE_URL=postgresql://username:password@localhost:5432/event_booking
SECRET_KEY=your_jwt_secret_key
```

### **5️⃣ Run the Microservices**
Start each service separately.  
Example: **Run User Service**  
```sh
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Run other services on different ports (`8002`, `8003`, `8004`).

---

## 🔄 **Jira & GitHub Integration**  
✔ Created a **Jira Project** (`CS4067_EventBooking`).  
✔ Linked **GitHub Issues** to **Jira Tasks**.  
✔ Pushed code to **GitHub** with branch-based development.  

---

## 📌 **Next Steps**
🔹 Implement **API Endpoints** for each service.  
🔹 Set up **RabbitMQ** for event-driven communication.  
🔹 Write **unit tests** for all microservices.  
🔹 Deploy using **Docker** & **CI/CD**.  

---

## 📝 **Contributing**  
- Fork this repo & create a new branch for your feature.  
- Follow best practices for commits and PRs.  
- Run tests before merging.  

---

## 📜 **License**  
MIT License  


