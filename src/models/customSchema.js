const mongoose = require('mongoose');

const customSchema = new mongoose.Schema({
    authorid: String,
    content: String,
    type: String
})
module.exports = mongoose.model('customSchema', customSchema)
