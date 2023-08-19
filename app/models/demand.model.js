const mongoose = require("mongoose");

const Demand = mongoose.model(
  "Demand",
  new mongoose.Schema({
    title: String,
    resume: String,
    recurrence: String,
    maxSubscriptions: Number,
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })
);

module.exports = Demand;