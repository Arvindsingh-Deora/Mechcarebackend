const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  shopName: { type: String, required: true },
  address: { type: String, required: true },
  gst: String,
  phone: { type: String, required: true },
  city: { type: String, required: true },
  photo: String,
  services: String,
  prices: String
});
module.exports = mongoose.model("Mechanic", mechanicSchema);
