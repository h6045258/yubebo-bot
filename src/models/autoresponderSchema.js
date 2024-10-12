const mongoose = require('mongoose');

const autoresponderSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    trigger: { type: String, required: true },
    options: {
        reply: { type: String, default: null },
        embed: { type: String, default: null },
        matchMode: { type: String, enum: ['exactly', 'startswith', 'endswith', 'includes'], default: 'exactly' },
        cooldown: { type: Number, default: 0 },
        requiredPermissions: { type: [String], default: [] },
        deniedPermissions: { type: [String], default: [] },
        requiredRoles: { type: [String], default: [] },
        deniedRoles: { type: [String], default: [] },
        requiredChannels: { type: [String], default: [] },
        deniedChannels: { type: [String], default: [] },
        requiredUsers: { type: [String], default: [] },
        sendToChannel: { type: String, default: null },
        dm: { type: Boolean, default: false },
        deleteTrigger: { type: Number, default: 0 },
        deleteReply: { type: Number, default: 0 },
        addRole: { type: String, default: null },
        removeRole: { type: String, default: null },
        setNick: { type: String, default: null },
        reactEmojisTrigger: { type: [String], default: [] },
        reactEmojisReply: { type: [String], default: [] },
        replyNoMention: { type: Boolean, default: false },
        messageNoMention: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Autoresponder', autoresponderSchema);