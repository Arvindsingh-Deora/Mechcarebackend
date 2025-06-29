const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    mechanicId: String,
    mechanicName: String,
    userEmail: String,
    userName: String,
    userPhone: String,
    userLocation: String,
    problemDescription: String,
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
