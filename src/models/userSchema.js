const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseNextLevelXp = 1300;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    nextLevelXp: {
        type: Number,
        default: baseNextLevelXp
    },
    dailyXp: {
        type: Number,
        default: 0
    },
    lastXpReset: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);
