# Setting Up Express.js Booking Service

#### **1️⃣ Create the Project**
```sh
mkdir booking-service && cd booking-service
npm init -y
```

#### **2️⃣ Install Dependencies**
```sh
npm install express pg dotenv amqplib cors body-parser
```
- `express` → Backend framework  
- `pg` → PostgreSQL driver  
- `dotenv` → Manage environment variables  
- `amqplib` → RabbitMQ client  
- `cors` → Enable cross-origin requests  
- `body-parser` → Parse request bodies  

---

## **Define Folder Structure**
```
📂 booking-service
├── 📂 src
│   ├── 📂 routes       # API routes
│   ├── 📂 controllers  # Business logic
│   ├── 📂 models       # Database schemas
│   ├── 📂 services     # RabbitMQ logic
├── 📄 server.js        # Main entry point
├── 📄 .env             # Environment variables
├── 📄 package.json     # Dependencies
```

---

##**Connect to PostgreSQL**

#### **🔹 Add .env File**
```ini
PORT=5003
DATABASE_URL=postgres://your_user:your_password@localhost:5432/booking_db
RABBITMQ_URL=amqp://localhost
```

#### **🔹 Create Database Connection (📂 src/config/db.js)**
```javascript
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("📦 Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
```

---

## **Create a Basic Server**
#### **🔹 Create `server.js`**
```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bookingRoutes = require("./src/routes/bookingRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Booking Service running on http://localhost:${PORT}`);
});
```

---

## **Define API Routes**
#### **🔹 Create `src/routes/bookingRoutes.js`**
```javascript
const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getBookings);

module.exports = router;
```

#### **🔹 Create `src/controllers/bookingController.js`**
```javascript
const pool = require("../config/db");

exports.createBooking = async (req, res) => {
  const { user_id, event_id, tickets } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO bookings (user_id, event_id, tickets, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [user_id, event_id, tickets]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
```

---

## **Set Up PostgreSQL Database**
#### **🔹 Run These SQL Commands**
```sql
CREATE DATABASE booking_db;

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  tickets INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **Test the API**
#### **🔹 Start the Server**
```sh
node server.js
```

#### **🔹 Test with Postman or cURL**
**1️⃣ Create a Booking**
```sh
curl -X POST "http://localhost:5003/api/bookings" \
     -H "Content-Type: application/json" \
     -d '{ "user_id": 1, "event_id": 10, "tickets": 2 }'
```
**2️⃣ Fetch All Bookings**
```sh
curl -X GET "http://localhost:5003/api/bookings"
```

---

You can install RabbitMQ on your **MacBook (macOS)** using **Homebrew** (recommended) or **Docker** (if you prefer containers).  

---

## **🔹 Option 1: Install RabbitMQ Using Homebrew (Recommended)**
### **Step 1: Install Homebrew (If not installed)**
Check if **Homebrew** is installed:  
```sh
brew --version
```
If not installed, install it using:  
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### **Step 2: Install RabbitMQ**
Run the following command:
```sh
brew install rabbitmq
```

### **Step 3: Start RabbitMQ**
```sh
brew services start rabbitmq
```

### **Step 4: Enable RabbitMQ Management UI**
```sh
rabbitmq-plugins enable rabbitmq_management
```
Now, you can access the **RabbitMQ Dashboard** in your browser:  
👉 **http://localhost:15672**  
- **Username:** `guest`  
- **Password:** `guest`

### **Step 5: Verify RabbitMQ is Running**
Run:
```sh
rabbitmqctl status
```
If it’s running, you’ll see details about the RabbitMQ node.

---


