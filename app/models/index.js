const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.demand = require("./demand.model");
db.subscription = require("./subscription.model");

module.exports = db;