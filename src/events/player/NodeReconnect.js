module.exports = {
    event: "nodeReconnect",
    run: async (client, node) => {
        this.logger.info(`Node ${node} đã được kết nối lại.`);
    }
};
