const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();

const router = express.Router();

// ✅ Razorpay instance setup
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("👉 Received amount:", amount); // ADD THIS

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    console.log("✅ Order created:", order); // ADD THIS

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error); // This will help us
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
