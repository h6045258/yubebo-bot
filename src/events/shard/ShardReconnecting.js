module.exports = {
    name: 'shardReconnecting',
    run: async (client, id) => {
        client.logger.info(`Shard ${id} đang khởi động lại!`);
    }
};