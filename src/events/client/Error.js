module.exports = {
    event: "error",
    run: async (client, info) => {
        client.logger.error(String(info.stack));
    },
};