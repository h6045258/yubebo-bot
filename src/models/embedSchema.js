const mongoose = require('mongoose');

const embedSchema = new mongoose.Schema({
    guildId: { type: String, require: true },
    name: { type: String, require: true },
    embed: {
        color: { type: String, default: '#ffffff' },
        author: {
            text: { type: String, default: null },
            icon: { type: String, default: null }
        },
        title: { type: String, default: null },
        description: { type: String, default: null },
        thumbnail: { type: String, default: null },
        image: { type: String, default: null },
        footer: {
            text: { type: String, default: null },
            icon: { type: String, default: null }
        },
        fields: [{
            name: { type: String, default: '\u200b' },
            value: { type: String, default: '\u200b' },
            inline: { type: Boolean, default: false }
        }],
        timestamp: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('Embed', embedSchema);