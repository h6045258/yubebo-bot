module.exports = {
    event: "ready",
    run: async (client) => {
        const totalClusters = client.cluster.count;
        const totalShards = client.cluster.info.TOTAL_SHARDS;

        const guildNum =
            await client.cluster.fetchClientValues("guilds.cache.size");
        const memberNum = await client.cluster.broadcastEval((c) =>
            c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
        );
        const totalMembers = memberNum.reduce(
            (prev, memberCount) => prev + memberCount,
            0,
        );
        const totalGuilds = guildNum.reduce((total, shard) => total + shard, 0);

        client.logger.info(
            `${client.user.username} Đang hoạt động: ${client.cluster.count} clusters, ${totalGuilds} servers, và ${totalMembers} members.`,
        );
        await client.user.setPresence({
            activities: [
                {
                    name: `Cluster #${totalClusters} - Shard #${totalShards}`,
                    type: 0,
                    state: `${totalGuilds.toLocaleString()} servers & ${totalMembers.toLocaleString()} members`,
                    url: "https://www.twitch.tv/nocopyrightsounds",
                    assets: {
                        large_image: "https://cdn.discordapp.com/avatars/429926615242244096/ae74ade4468097be6e1126092b25d3d9.png?size=4096",
                        large_text: "Yubabe Pro Max"
                    }
                },
            ],
            status: "online",
        });
    },
};
