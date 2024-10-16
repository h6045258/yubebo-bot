const mongoose = require('mongoose');

const lotterySchema = new mongoose.Schema({
    userId: { type: String, default: 0 },
    bet: { type: Number, default: 0 },
    rate: { type: Number, default: 0 }
});

module.exports = mongoose.model('lottery', lotterySchema);
