const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Check = require('../../models/giveawaySchema');

module.exports = {
    name: 'ping',
    aliases: [],
    category: 'Utils',
    cooldown: 5,
    description: {
        content: 'Xem tốc độ phản hồi của bot!',
        example: 'ping',
        usage: 'ping'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const ctx = await message.channel.send({ content: `${client.e.load} | ${lang.utils.loading}` });
        const embed = client.embed();

        const shardPings = await client.cluster.broadcastEval(c => c.ws.ping);
        const clusterPings = shardPings.map((ping, index) => `Cluster ${index + 1}: \`${Math.floor(ping - 200)}ms\``).join('\n* ');

        const botLatency = ctx.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.floor(client.ws.ping - 200);
        const dataLatency = Math.floor(await avgLatency());

        const botLatencySignal = botLatency < 600 ? '+' : '-';
        const apiLatencySignal = apiLatency < 500 ? '+' : '-';
        const dataLatencySignal = dataLatency < 100 ? '+' : '-';

        embed
            .setColor(client.color.y)
            .setAuthor({ name: message.guild.members.me.displayName, iconURL: client.user.displayAvatarURL({}) })
            .addFields([
                {
                    name: lang.utils.ping_1,
                    value: `\`\`\`diff\n${apiLatencySignal} ${apiLatency}ms\`\`\``
                },
                {
                    name: lang.utils.ping_2,
                    value: `\`\`\`diff\n${botLatencySignal} ${botLatency}ms\`\`\``
                },
                {
                    name: lang.utils.ping_3,
                    value: `\`\`\`diff\n${dataLatencySignal} ${dataLatency}ms\`\`\``
                },
                {
                    name: lang.utils.ping_4,
                    value: `<t:${Math.floor(client.readyTimestamp / 1000)}:d> <t:${Math.floor(client.readyTimestamp / 1000)}:R>`
                }
            ])
            .setFooter({ text: `${lang.utils.ping_5}`, iconURL: message.guild.iconURL({}) })
            .setTimestamp();

        /* const vote = new ActionRowBuilder()
             .addComponents(
                 new ButtonBuilder()
                     .setLabel('Vote Nhận Quà')
                     .setEmoji('1123672139988484176')
                     .setStyle(ButtonStyle.Link)
                     .setURL('https://top.gg/bot/936872532932440065/vote')
             ) */

        ctx.edit({ content: null, embeds: [embed] });
    }
}

async function avgLatency(iterations = 10) {
    let totalLatency = 0;

    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await Check.find();
        const end = Date.now();
        totalLatency += (end - start);
    }

    const averageLatency = totalLatency / iterations;
    return averageLatency;
}
