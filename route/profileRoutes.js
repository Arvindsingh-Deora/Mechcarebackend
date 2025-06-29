const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Import the User model

// Save or update user profile
router.post("/save-profile", async (req, res) => {
  const { uid, name, email, photoURL, phone, vehicle, location } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { name, email, photoURL, phone, vehicle, location },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Profile saved successfully", user });
  } catch (err) {
    console.error("Profile Save Error:", err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

module.exports = router;