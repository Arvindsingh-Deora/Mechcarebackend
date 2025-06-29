const express = require("express");
const router = express.Router();
const twilio = require("twilio");

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// In-memory OTP storage (use Redis or MongoDB for production)
const otpStore = {};

// Generate random 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = generateOtp();
  otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: twilioPhone,
      to: phone,
    });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Twilio Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  const storedOtp = otpStore[phone];
  if (!storedOtp) {
    return res.status(400).json({ error: "No OTP found for this phone number" });
  }

  if (Date.now() > storedOtp.expires) {
    delete otpStore[phone];
    return res.status(400).json({ error: "OTP has expired" });
  }

  if (storedOtp.otp === otp) {
    delete otpStore[phone]; // Clear OTP after successful verification
    return res.status(200).json({ verified: true });
  } else {
    return res.status(400).json({ error: "Invalid OTP", verified: false });
  }
});

module.exports = router;