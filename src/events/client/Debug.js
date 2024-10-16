module.exports = {
    event: "debug",
    /**
     * 
     * @param {*} client 
     * @param {*} info 
     */
    run: async (client, info) => {
        if (info.includes('Heartbeat')) {
            client.logger.info(`[Heartbeat] ${info}`);
        } else if (info.includes('WebSocket')) {
            client.logger.info(`[WebSocket] ${info}`);
        }
    },
};
