module.exports = {
    event: "guildDelete",
    run: async (client, guild) => {
        try {
            const [totalGuilds] = await Promise.all([
                client.cluster
                    .fetchClientValues("guilds.cache.size")
                    .then((sizes) =>
                        sizes.reduce((acc, size) => acc + size, 0),
                    ),
                client.cluster
                    .broadcastEval((c) =>
                        c.guilds.cache.reduce(
                            (acc, g) => acc + g.memberCount,
                            0,
                        ),
                    )
                    .then((memberCounts) =>
                        memberCounts.reduce((acc, count) => acc + count, 0),
                    ),
            ]);

            const guildName = guild.name || "Tên Server không xác định";
            const guildId = guild.id || "ID Server không xác định";
            const totalGuildCount = totalGuilds || "0";

            const embed = client
                .embed()
                .setColor(client.color.x)
                .setAuthor({
                    name: "Yubabe Đã Bị Kick Ra Khỏi Server",
                    iconURL: client.user.displayAvatarURL({}),
                })
                .setFields(
                    { name: "Tên Server", value: guildName, inline: true },
                    { name: "ID Server", value: guildId, inline: true },
                    {
                        name: "Số lượng Server Hiện Tại",
                        value: `${totalGuildCount}`,
                        inline: true,
                    },
                )
                .setFooter({ text: `Tổng ${totalGuildCount} servers` })
                .setTimestamp();

            const logChannel = client.channels.cache.get(
                client.config.channels.guild_log,
            );
            if (!logChannel) return;
            if (logChannel) {
                logChannel.send({ embeds: [embed] });
            } else {
                client.logger.warn(
                    `Không tìm thấy kênh với ID ${client.config.channels.guild_log}`,
                );
            }
        } catch (error) {
            client.logger.error(
                "Đã xảy ra lỗi khi xử lý sự kiện guildDelete:",
                error.stack,
            );
            client.logger.error(error.stack);
        }
    },
};
