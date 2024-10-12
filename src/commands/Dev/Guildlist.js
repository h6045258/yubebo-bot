const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "guildlist",
    aliases: ["glt"],
    description: "Xem danh sách tất cả server bot đang hoạt động",
    category: 'Dev',
    permissions: {
        dev: true
    },
    /**
     * 
     * @param {import('discord.js').Client} client
     * @param {*} message 
     * @param {*} args 
     * @param {client.prefix('prefix')} prefix 
     * @param {client.la('lang')} lang 
     * @returns 
     */
    run: async (client, message, args, prefix) => {
        const guilds = client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((g, index) => `${index + 1} | **${g.name}** [${g.id}] - ${g.memberCount}`);

        const itemsPerPage = 10;
        const totalPages = Math.ceil(guilds.length / itemsPerPage);

        let currentPage = 1;

        const generateEmbed = (page) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const guildList = guilds.slice(start, end).join("\n");

            return client.embed()
                .setColor(client.config.color.y)
                .setDescription(guildList)
                .setFooter({ text: `Trang ${page} / ${totalPages}` });
        };

        const firstEmbed = generateEmbed(currentPage);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prevPage')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 1),
                new ButtonBuilder()
                    .setCustomId('nextPage')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages)
            );

        const msg = await message.channel.send({ embeds: [firstEmbed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.reply({ content: 'Bạn không có quyền sử dụng các nút này.', ephemeral: true });
            }

            if (i.customId === 'prevPage' && currentPage > 1) {
                currentPage--;
            } else if (i.customId === 'nextPage' && currentPage < totalPages) {
                currentPage++;
            }

            const newEmbed = generateEmbed(currentPage);

            const updatedRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prevPage')
                        .setLabel('◀')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 1),
                    new ButtonBuilder()
                        .setCustomId('nextPage')
                        .setLabel('▶')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === totalPages)
                );

            await i.update({ embeds: [newEmbed], components: [updatedRow] });
        });

        collector.on('end', () => {
            row.components.forEach(button => button.setDisabled(true));
            msg.edit({ components: [row] });
        });
    }
};
