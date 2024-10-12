module.exports = {
    event: "guildCreate",
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').Guild} guild 
     */
    run: async (client, guild) => {
        if (!guild.members.me.permissions.has("ManageGuild")) return;
        try {
            const own = await guild.fetchOwner();

            let inviteLink = "Không tìm thấy link mời";
            let vanityLink = null;

            const guildss = await client.guilds.fetch(guild.id);
            const invites = await guildss.invites.fetch();
            let longestInvite = null;
            invites.forEach((invite) => {
                if (
                    !longestInvite ||
                    (invite.maxAge > longestInvite.maxAge &&
                        invite.maxUses === 0 &&
                        !invite.temporary)
                ) {
                    longestInvite = invite;
                }
            });
            if (longestInvite) {
                inviteLink = longestInvite.url;
            }
            if (guildss.vanityURLCode) {
                vanityLink = `https://discord.gg/${guildss.vanityURLCode}`;
            }

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

            const embed = client
                .embed()
                .setColor(client.color.y)
                .setAuthor({
                    name: "Yubabe Đã Được Thêm Vào Server",
                    iconURL: client.user.displayAvatarURL({}),
                })
                .setFields(
                    { name: "Tên Server", value: guild.name, inline: true },
                    { name: "ID Server", value: guild.id, inline: true },
                    {
                        name: "Số lượng thành viên",
                        value: `${guild.members.cache.size}`,
                        inline: true,
                    },
                    {
                        name: "Tên Chủ Sở Hữu",
                        value: own.user.tag,
                        inline: true,
                    },
                    {
                        name: "ID Chủ Sở Hữu",
                        value: guild.ownerId,
                        inline: true,
                    },
                    {
                        name: "Số lượng Server Hiện Tại",
                        value: `${totalGuilds}`,
                        inline: true,
                    },
                    {
                        name: "Link mời",
                        value: inviteLink || "Không có link mời",
                        inline: true,
                    },
                    {
                        name: "Vanity Link",
                        value: vanityLink || "Không có vanity link",
                        inline: true,
                    },
                )
                .setFooter({ text: `Tổng ${totalGuilds} servers` })
                .setTimestamp();

            const logChannel = client.channels.cache.get(
                client.config.channels.guild_log,
            );
            if (logChannel) {
                logChannel.send({ embeds: [embed] });
            } else {
                client.logger.warn(
                    `Không tìm thấy kênh với ID ${client.config.channels.guild_log}`,
                );
            }

            client.logger.info(`Bot đã được thêm vào GUILD ${guild.name}`);
        } catch (error) {
            client.logger.error(
                "Đã xảy ra lỗi khi xử lý events guildCreate:",
                error.stack,
            );
            client.logger.error(error.stack);
        }
    },
};
