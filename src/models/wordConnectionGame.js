const mongoose = require('mongoose');

const wordConnectionGameSchema = new mongoose.Schema({
    guildId: { type: String, default: "" },
    channelId: String,
    word: String,
    existed: [String],
    players: [String],
    currentTurn: Number,
    mode: { type: String, enum: ["pvp", "free"] }, // pvp, free,
    replay: { type: Boolean, default: false }
});

module.exports = mongoose.model('WordConnectionGame', wordConnectionGameSchema);
