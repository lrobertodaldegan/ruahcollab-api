const mongoose = require("mongoose");

const Device = mongoose.model(
  "Device",
  new mongoose.Schema({
    id: String,
    deviceId: String,
    uniqueId: String,
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref:'User'
    }
  })
);

module.exports = Device;