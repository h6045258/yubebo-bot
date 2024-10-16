const mongoose = require('mongoose');


const wordConnectionSchema = new mongoose.Schema({
    guildId: { type: String, default: "" },
    channelId: String,
    word: String,
    existed: [String]
});

module.exports = mongoose.model('word', wordConnectionSchema);
