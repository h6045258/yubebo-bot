const mongoose = require('mongoose');
const { Schema } = mongoose;

const fishpointSchema = new Schema({ zooid: String, quanlity: Number });

module.exports = mongoose.model('fishpointSchema', fishpointSchema);