const mongoose = require('mongoose');

const praySchema = new mongoose.Schema({
    id: String,
    prays: Number,
})
module.exports = mongoose.model('praySchema', praySchema)
