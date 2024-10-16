module.exports = {
    name: 'shardReady',
    run: async (client, id, unavailableGuilds) => {
        client.logger.info(`Shard ${id} đang sẵn sàng!`);
    }
};
