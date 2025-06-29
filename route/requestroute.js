const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// POST: Create a help request
router.post("/", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Request sent successfully" });
  } catch (err) {
    console.error("Error saving request:", err);
    res.status(500).json({ error: "Failed to create request" });
  }
});

// GET: All requests (for mechanic dashboard)
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// GET: Requests by user email
router.get("/user/:email", async (req, res) => {
  try {
    const requests = await Request.find({ userEmail: req.params.email });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user's requests" });
  }
});

// PATCH: Accept request
router.patch("/accept/:id", async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.id, { status: "Accepted" });
    res.json({ message: "Request accepted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept request" });
  }
});

// PATCH: Reject request
router.patch("/reject/:id", async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.id, { status: "Rejected" });
    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject request" });
  }
});

module.exports = router;
