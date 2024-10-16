const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    id: String,
    name: String,
    quanlity: Number,
    type: String
});

module.exports = mongoose.model('itemSchema', itemSchema);
