const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Get user by UID
router.get("/get-profile/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json(null); // Return null for frontend compatibility
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("User Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Save or update user profile
router.post("/save-profile", async (req, res) => {
  try {
    const { uid, name, email, photoURL, phone, vehicle, location } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }
    const profileData = {
      uid,
      name: name || "",
      email: email || "",
      photoURL: photoURL || "",
      phone: phone || "",
      vehicle: vehicle || "",
      location: location || "",
    };
    // Upsert: update if exists, create if not
    const user = await User.findOneAndUpdate(
      { uid },
      profileData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error("User Save Error:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

module.exports = router;