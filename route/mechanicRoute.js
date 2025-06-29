const express = require("express");
const router = express.Router();
const Mechanic = require("../models/mechanic");

router.post("/register", async (req, res) => {
  try {
    const newMechanic = new Mechanic(req.body);
    await newMechanic.save();
    res.status(201).json({ message: "Mechanic registered successfully" });
  } catch (err) {
    console.error("Error saving mechanic:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const mechanics = await Mechanic.find();
    res.json(mechanics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/requests', async (req, res) => {
  const {
    mechanicId,
    mechanicName,
    userLocation,
    problemDescription,
    userEmail,
    userName,
    userPhone
  } = req.body;

  try {
    const request = new RequestModel({
      mechanicId,
      mechanicName,
      userLocation,
      problemDescription,
      userEmail,
      userName,
      userPhone,
      createdAt: new Date()
    });
    await request.save();
    res.status(200).json({ message: "Request sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending request" });
  }
});


module.exports = router;
