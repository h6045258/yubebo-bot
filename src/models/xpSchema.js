const mongoose = require('mongoose');

const xpSchema = new mongoose.Schema({
    UserId: { type: String, require: true },
    xp: {
       count: { type: Number, default: 0 },
       cooldown: { type: Number, default: 0 },
       maxes: { type: Boolean, default: false },
       
    }
});

module.exports = mongoose.model('XP', xpSchema);