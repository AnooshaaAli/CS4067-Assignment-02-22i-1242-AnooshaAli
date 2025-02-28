### **Set Up Event Service (Node.js & Express with MongoDB)**  

### **1️⃣ Initialize the Project**
Run the following command in your terminal:

```sh
mkdir event-service && cd event-service
npm init -y
```

---

### **2️⃣ Install Dependencies**
```sh
npm install express mongoose dotenv cors body-parser
```
- **express** → Web framework for handling API routes.
- **mongoose** → ODM (Object Data Modeling) for MongoDB.
- **dotenv** → Manage environment variables.
- **cors** → Allow cross-origin requests.
- **body-parser** → Parse request bodies.

---

### **3️⃣ Create Folder Structure**
```sh
event-service/
│── models/
│   ├── event.js
│── routes/
│   ├── eventRoutes.js
│── config/
│   ├── db.js
│── controllers/
│   ├── eventController.js
│── .env
│── server.js
│── package.json
```

---

### **4️⃣ Connect to MongoDB**
Create a **config/db.js** file:

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### **5️⃣ Define Event Model**
Create a **models/event.js** file:

```js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Event", eventSchema);
```

---

### **6️⃣ Create Event Controller**
Create a **controllers/eventController.js** file:

```js
const Event = require("../models/event");

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

### **7️⃣ Set Up Event Routes**
Create a **routes/eventRoutes.js** file:

```js
const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
```

---

### **8️⃣ Set Up Express Server**
Create a **server.js** file:

```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/events", eventRoutes);

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Event Service running on port ${PORT}`));
```

---

### **9️⃣ Set Up Environment Variables**
Create a **.env** file:

```
MONGO_URI=mongodb://localhost:27017/eventServiceDB
PORT=5002
```

---

### **🔟 Run the Server**
```sh
node server.js
```

If everything is set up correctly, your Event Service should be running on **http://localhost:5002/events**. 🚀  

---
