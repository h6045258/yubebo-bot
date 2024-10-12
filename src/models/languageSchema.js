const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    GuildId: {
        type: String,
        require: true
    },
    language: {
        type: String,
        required: true,
        default: 'vi'
    }
});

module.exports = mongoose.model('Guild Language', languageSchema);