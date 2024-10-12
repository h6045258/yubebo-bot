const mongoose = require("mongoose");
const { Schema } = mongoose;

const zoopointSchema = new Schema({ zooid: String, quanlity: Number });

module.exports = mongoose.model("zoopointSchema", zoopointSchema);
