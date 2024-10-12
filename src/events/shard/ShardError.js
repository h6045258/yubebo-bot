module.exports = {
    name: 'shardError',
    run: async (client, error, shardId) => {
        client.logger.error(`Shard ${shardId} đã bị lỗi!`, error.stack);
    }
};
