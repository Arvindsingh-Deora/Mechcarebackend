const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  photoURL: { type: String, default: "" },
  phone: { type: String, default: "" },
  vehicle: { type: String, default: "" },
  location: { type: String, default: "" },
});

// Export the model, reusing it if already compiled
module.exports = mongoose.models.User || mongoose.model("User", userSchema);