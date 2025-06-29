const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config(); // Load env variables

// Route imports
const profileRoutes = require("./route/profileRoutes");
const userRoute = require("./route/userRoute");
const paymentRoutes = require('./route/paymentRoutes');
const requestRoutes = require("./route/requestroute");
const mechanicRoutes = require('./route/mechanicRoute');


const app = express();
const server = http.createServer(app);

// ✅ Proper CORS config (combine into one)
app.use(cors({
  origin: [
    "https://mechcarenew.vercel.app", // ✅ Vercel frontend
    "http://localhost:3000"           // ✅ For local testing
  ],
  credentials: true
}));

app.use(express.json());

// ✅ Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "https://mechcarenew.vercel.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"]
  }
});

// 🔌 Socket connection logs
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Use Routes
const authRoutes = require('./route/authRoutes');
console.log("✅ Loaded authRoutes");

app.use('/api/auth', authRoutes);
console.log("✅ Registered /api/auth routes");

app.use("/api/users", userRoute);
app.use("/api/users", profileRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/requests", requestRoutes);
app.use('/api/mechanics', mechanicRoutes);

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.get("/my-ip", (req, res) => {
  res.send(req.ip);
});

server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
