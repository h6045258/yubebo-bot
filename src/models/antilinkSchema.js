const mongoose = require('mongoose');
const { Schema } = mongoose;

const antilinkLog = new Schema({ 
    guildId: { type: String, required: true },
    channelId: { type: String },
    enabled: { type: Boolean, default: false },
    deletedCount: {type: Number, default: 0}
});

module.exports = mongoose.model('antilinkLog', antilinkLog);