module.exports = {
    name: 'shardResume',
    run: async (client, id, replayedEvents) => {
        client.logger.info(`Shard ${id} tiếp tục chạy lại ${replayedEvents} events!`);
    }
};