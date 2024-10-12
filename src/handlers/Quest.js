const { CronJob } = require('cron');
const questModel = require('../models/questSchema');
const { Collection } = require('discord.js');

module.exports = (client) => {
    client.isDeleteQuest = new Collection();
    if (client.cluster.id == 0) CronJob.from({
        cronTime: "0 0 * * *",
        onTick: async () => {
            client.isDeleteQuest.set('quest', true);
            try {
                await questModel.deleteMany();
            } catch (error) {
                await questModel.deleteMany();
            } finally {
                client.isDeleteQuest.delete('quest');
            }
        },
        start: true,
        timeZone: "Asia/Ho_Chi_Minh"
    });
};