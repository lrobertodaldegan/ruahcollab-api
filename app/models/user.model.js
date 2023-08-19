const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    contactPhone: String,
    contactEmail: String,
    resume: String,
    site: String,
    address: String,
    zipcode: String,
    photos:[String],
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  })
);

module.exports = User;