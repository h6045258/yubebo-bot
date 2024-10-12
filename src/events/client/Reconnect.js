module.exports = {
    event: "reconnect",
    run: async (client) => {
        client.logger.info(`${client.user.username} đã kết nối lại vào lúc ${new Date()}.`);
    },
};