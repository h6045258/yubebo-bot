const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: `ping`,
    description: `Xem thông số độ trễ của bot`,
    cooldown: 3,
    run: async (client, interaction, args, prefix, message, lang) => {

        try {
            // await interaction.deferReply({ content: `${client.e.load} | ${lang.utils.loading}`, fetchReply: true });

            const embed = client.embed();
            const messageTimestamp = new Date(interaction.createdTimestamp);

            const shardPings = await client.cluster.broadcastEval(c => c.ws.ping);
            const clusterPings = shardPings.map((ping, index) => `Cluster ${index + 1}: \`${Math.floor(ping - 200)}ms\``).join('\n* ');

            const string = lang.utils.ping_1
                .replace('{value1}', (Math.floor(new Date() - messageTimestamp) - 200).toString())
                .replace('{value2}', Math.floor(client.ws.ping - 200).toString())
                .replace('{value3}', clusterPings)
                .replace('{value4}', Math.floor(client.readyTimestamp / 1000).toString())
                .replace('{value5}', Math.floor(client.readyTimestamp / 1000).toString());

            embed
                .setColor(client.color.y)
                .setAuthor({ name: interaction.guild.members.me.displayName, iconURL: client.user.displayAvatarURL({}) })
                .setDescription(string)
                .setFooter({ text: lang.utils.ping_2 })
                .setTimestamp();

            const vote = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Vote Nhận Quà')
                        .setEmoji('1123672139988484176')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://top.gg/bot/936872532932440065/vote')
                )

            await interaction.reply({ content: null, embeds: [embed], components: [vote] });

        } catch (e) {
            client.logger.error(e.stack);
        }

    }
}
