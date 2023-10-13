const mongoose = require("mongoose");

const ResetCode = mongoose.model(
  "ResetCode",
  new mongoose.Schema({
    code: Number,
    used: Boolean,
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref:'User'
    }
  })
);

module.exports = ResetCode;