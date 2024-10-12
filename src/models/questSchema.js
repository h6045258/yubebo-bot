const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    rewardName: { type: String, default: "" },
    reward: { type: Number, default: 0 }
}, { _id: false });

const progressSchema = new mongoose.Schema({
    isComplete: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    maxProgress: { type: Number, default: 0 },
    reward: { type: rewardSchema, default: () => ({}) }
}, { _id: false });

const randomProgressSchema = new mongoose.Schema({
    isComplete: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    maxProgress: { type: Number, default: 0 },
    commandName: { type: String, default: "" },
    reward: { type: rewardSchema, default: () => ({}) }
}, { _id: false });


const userQuestSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    isCreatedNewQuest: { type: Boolean, default: false },
    chat: { type: progressSchema, default: () => ({}) },
    voice: { type: progressSchema, default: () => ({}) },
    gambling: { type: randomProgressSchema, default: () => ({}) },
    plant: { type: progressSchema, default: () => ({}) },
    action: { type: randomProgressSchema, default: () => ({}) },
    daily: { type: progressSchema, default: () => ({}) },
    vote: { type: progressSchema, default: () => ({}) }
});

module.exports = mongoose.model('quest', userQuestSchema);
