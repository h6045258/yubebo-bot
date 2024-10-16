const mongoose = require('mongoose');
const { Schema } = mongoose;

const fishesSchema = new Schema({
    id: String,
    name: String,
    quanlity: Number,
    type: String
});

module.exports = mongoose.model('fishesSchema', fishesSchema);
