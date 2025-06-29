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
const authRoutes = require('./route/authRoutes');// 👈 changed name for socket injection

const app = express();
const server = http.createServer(app); // 💡 Required for Socket.io

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 🔁 Change this in production (Vercel link)
    methods: ["GET", "POST"]
  }
});

// 🔌 Handle socket connection
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Temporary in-memory OTP store
const otpStore = {}; // ✅ You can move this to Redis or DB in future

// ✅ Routes (inject io + otpStore into authRoutes)
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoute);
app.use("/api/users", profileRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/requests", requestRoutes);
app.use('/api/mechanics', mechanicRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
