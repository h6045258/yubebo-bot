const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
    name: 'shard',
    aliases: [],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Xem trạng thái shard của bot !',
        example: 'shard',
        usage: 'shard'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args) => {
        try {
            const embeds = [];
            const promises = [
                client.cluster.fetchClientValues('guilds.cache.size'),
                client.cluster.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
            ];

            const shardInfo = await client.cluster.broadcastEval(c => {
                const ids = [];
                c.cluster.ids.forEach((_, key) => {
                    ids.push(key);
                });
                return ids.map(id => ({
                    id,
                    totalShards: c.cluster.shards,
                    status: c.presence.status,
                    guilds: c.guilds.cache.size,
                    channels: c.channels.cache.size,
                    members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
                    memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                    uptime: c.uptime,
                    ping: c.ws.ping,
                }));
            });

            const flattenedShardInfo = shardInfo.flat();
            for (let n = 0; n < flattenedShardInfo.length / 15; n++) {
                const shardArray = flattenedShardInfo.slice(n * 15, n * 15 + 15);
                const embed = client.embed()
                    .setColor(client.config.color.y)
                    .setAuthor({ name: `${message.guild.members.me.displayName} Shard Info`, iconURL: client.user.displayAvatarURL() });

                shardArray.forEach(i => {
                    const upsince = moment.duration(i.uptime).format("d[d]h[h]m[m]s[s]");
                    const status = i.status === 'online' ? '🟢' : '⚫';
                    const status2 = i.status === 'online' ? 'ready' : 'offline';
                    const shardId = parseInt(i.id);

                    const shardIdLabel = isNaN(shardId) ? 'NaN' : shardId.toString();

                    embed.addFields(
                        {
                            name: `${status} Shard ${shardIdLabel} (${status2})`,
                            value: `\`\`\`js\nSố server: ${i.guilds.toLocaleString()}\nSố kênh: ${i.channels.toLocaleString()}\nNgười dùng: ${i.members.toLocaleString()}\nBộ nhớ: ${Number(Math.floor(i.memoryUsage).toLocaleString())} MB\nUpsince: ${upsince}\nAPI: ${Math.floor(i.ping.toLocaleString() - 200)} ms\n\`\`\``,
                            inline: true,
                        },
                    );
                });

                Promise.all(promises)
                    .then(async results => {
                        let totalMemory = 0;
                        shardArray.forEach(s => totalMemory += parseInt(s.memoryUsage));
                        let totalChannels = 0;
                        shardArray.forEach(s => totalChannels += parseInt(s.channels));
                        let avgLatency = 0;
                        shardArray.forEach(s => avgLatency += s.ping);
                        avgLatency = avgLatency / shardArray.length;
                        avgLatency = Math.round(avgLatency);
                        const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                        const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

                        embed.setDescription(`* Server ${message.guild.name} đang chạy trên shard __**${client.cluster.id}**__.`);
                        embed.addFields(
                            {
                                name: '🟢 Thống Kê',
                                value: `\`\`\`js\nTổng Server: ${totalGuilds.toLocaleString()}\nTổng Kênh: ${totalChannels.toLocaleString()}\nTổng Người Dùng: ${totalMembers.toLocaleString()}\nTổng Bộ Nhớ Sử Dụng: ${Math.floor(totalMemory.toFixed(2))} MB\nĐộ Trễ Avg API: ${Math.floor(avgLatency - 200)} ms\n\`\`\``,
                            },
                        );
                        embed.setTimestamp();
                        embeds.push(embed);

                        if (embeds.length === Math.ceil(flattenedShardInfo.length / 15)) {
                            await paginate(message, embeds);
                        }
                    }).catch(error => console.error('Error in processing shard statistics:', error));
            }
        } catch (error) {
            console.error("Error in shard command: ", error);
        }
    }
};

async function paginate(message, pages, timeout = 300000, buttonRow) {
    if (pages.length < 2) return message.channel.send({ embeds: pages });
    let page = 0;
    const buttons = buttonRow ? buttonRow : new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('back')
                .setLabel('Back')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⬅️'),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('➡️'),
        );

    const msg = await message.channel.send({
        embeds: [pages[page]],
        components: [buttons],
        fetchReply: true,
    });

    const interactionCollector = msg.createMessageComponentCollector({ max: pages.length * 2 });

    interactionCollector.on('collect', async (interaction) => {
        if (interaction.customId === 'back') {
            page = page === 0 ? pages.length - 1 : page - 1;
        } else if (interaction.customId === 'next') {
            page = page === pages.length - 1 ? 0 : page + 1;
        }

        await interaction.update({
            embeds: [pages[page]],
        });
    });

    interactionCollector.on('end', async () => {
        await msg.edit({ components: [] });
    });

    setTimeout(async () => {
        interactionCollector.stop('Timeout');
        await msg.edit({ components: [] });
    }, timeout);
}