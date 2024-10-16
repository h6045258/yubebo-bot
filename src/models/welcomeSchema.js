const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    options: {
        welcome: {
            channel: { type: String, default: null },
            content: { type: String, default: null },
            embed: { type: String, default: null }
        },
        leave: {
            channel: { type: String, default: null },
            content: { type: String, default: null },
            embed: { type: String, default: null }
        },
        boost: {
            channel: { type: String, default: null },
            content: { type: String, default: null },
            embed: { type: String, default: null }
        }
    }
});

module.exports = mongoose.model('Welcome', welcomeSchema);
