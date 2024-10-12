module.exports = {
    event: "warn",
    run: async (client, info) => {
        if (client && client.logger) {
            client.logger.warn(
                `Đã nhận cảnh báo cho bot ${client.user.tag} (${client.user.id}): ${info}`,
            );
        } else {
            console.warn(`Đã nhận cảnh báo: ${info}`);
        }
    },
};