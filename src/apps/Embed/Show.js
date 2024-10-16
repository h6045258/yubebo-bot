const Embed = require('../../models/embedSchema');

module.exports = {
    name: 'show',
    description: 'Xem chi tiết các tùy chỉnh của embed',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'embed',
            description: 'Chọn embed bạn muốn xem',
            type: 'String',
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        try {
            await interaction.deferReply({ ephemeral: false, fetchReply: true });
            const { options } = interaction;
            const name = options.getString('embed');
            const embedData = await Embed.findOne({ guildId: interaction.guild.id, name: name });

            if (!embedData) {
                return interaction.editReply({ content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\`!` });
            }

            const variable = async (variable, interaction) => {
                if (!variable) return null;
                try {
                    const result = await client.variable(variable, interaction);
                    if (!result && !variable.includes('{ignore_errors}')) {
                        return null;
                    }
                    return result;
                } catch (error) {
                    if (variable.includes('{ignore_errors}')) {
                        return variable;
                    }
                    throw error;
                }
            };

            const embedInterface = client
                .embed()
                .setColor(embedData.embed.color ? embedData.embed.color : client.color.y)
                .setAuthor({
                    name: await variable(embedData.embed.author ? embedData.embed.author.text : null, interaction),
                    iconURL: await variable(embedData.embed.author ? embedData.embed.author.icon : null, interaction)
                })
                .setTitle(await variable(embedData.embed.title ? embedData.embed.title : null, interaction))
                .setDescription(await variable(embedData.embed.description ? embedData.embed.description : '\u200b', interaction))
                .setFooter({
                    text: await variable(embedData.embed.footer ? embedData.embed.footer.text : null, interaction),
                    iconURL: await variable(embedData.embed.footer ? embedData.embed.footer.icon : null, interaction)
                })
                .setThumbnail(await variable(embedData.embed.thumbnail ? embedData.embed.thumbnail : null, interaction))
                .setImage(await variable(embedData.embed.image ? embedData.embed.image : null, interaction))
                .setTimestamp(embedData.embed.timestamp === true ? new Date() : null);

            return interaction.editReply({
                embeds: [embedInterface]
            });

        } catch (error) {
            client.logger.error(String(error.stack));
            interaction.editReply({ content: `${client.e.fail} | Đã xảy ra lỗi khi tải thông tin embed.` });
        }
    }
};
