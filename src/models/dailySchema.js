const mongoose = require("mongoose");

const dailySchema = new mongoose.Schema({
  id: String,
  name: String,
  streak: Number,
});

module.exports = mongoose.model("dailySchema", dailySchema);
