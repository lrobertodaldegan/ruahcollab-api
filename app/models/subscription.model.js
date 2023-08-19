const mongoose = require("mongoose");

const Subscription = mongoose.model(
  "Subscription",
  new mongoose.Schema({
    date: Date,
    status: String,
    demand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demand"
    },
    voluntair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })
);

module.exports = Subscription;