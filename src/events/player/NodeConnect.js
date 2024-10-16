module.exports = {
    event: "nodeConnect",
    run: async (client, node) => {
        client.logger.info(`Node ${node} đã kết nối.`);
    }
};
