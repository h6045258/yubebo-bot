module.exports = {
    event: "disconnect",
    run: async (client) => {
        client.logger.warn(`${client.user.username} đã bị ngắt kết nối vào lúc ${new Date()}.`);
    },
};