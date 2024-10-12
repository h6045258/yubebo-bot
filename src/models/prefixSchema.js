const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
    GuildId: String,
    prefix: String
});

module.exports = mongoose.model('Guild Prefix', prefixSchema);
