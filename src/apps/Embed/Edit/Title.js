const Embed = require('../../../models/embedSchema');

module.exports = {
    name: 'title',
    description: 'Chỉnh sửa title của embed',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'embed',
            description: 'Chọn embed muốn chỉnh',
            type: 'String',
            required: true,
            autocomplete: true
        },
        {
            name: 'text',
            description: 'Chỉnh tiêu đề của embed',
            type: 'String',
            required: false
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const name = options.getString('embed');
        const text = options.getString('text');

        const embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
        if (!embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\``
            });
        }

        if (!text) {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(embed.embed ? embed.embed.color : null)
                        .setAuthor(embed.embed.author ? { name: await client.variable(embed.embed.author.text, interaction), iconURL: await client.variable(embed.embed.author.icon, interaction) } : null)
                        .setTitle(embed.embed ? await client.variable(embed.embed.title, interaction) : null)
                        .setDescription(embed.embed ? await client.variable(embed.embed.description, interaction) || '\u200b' : null)
                        .setFooter(embed.embed.footer ? { text: await client.variable(embed.embed.footer.text, interaction), iconURL: await client.variable(embed.embed.footer.icon, interaction) } : null)
                        .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, interaction) : null)
                        .setImage(embed.embed ? await client.variable(embed.embed.image, interaction) : null)
                        .setTimestamp(embed.embed.timestamp === true ? new Date() : null)
                ]
            });
        }

        if (text) {
            embed.embed.title = text;
            await embed.save();

            await interaction.editReply({
                content: `${client.e.done} | Title của embed \`${name}\` đã được cập nhật.`,
                embeds: [
                    client
                        .embed()
                        .setColor(embed.embed ? embed.embed.color : client.color.y)
                        .setAuthor({ name: embed.embed ? await client.variable(embed.embed.author.text, interaction) : null, iconURL: embed.embed ? await client.variable(embed.embed.author.icon, interaction) : null })
                        .setTitle(text ? await client.variable(text, interaction) : null)
                        .setDescription(embed.embed ? await client.variable(embed.embed.description) : '\u200b')
                        .setFooter({ text: embed.embed ? await client.variable(embed.embed.footer.text, interaction) : null, iconURL: embed.embed ? await client.variable(embed.embed.footer.icon, interaction) : null })
                        .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, interaction) : null)
                        .setImage(embed.embed ? await client.variable(embed.embed.image, interaction) : null)
                        .setTimestamp(embed.embed.timestamp === true ? new Date() : null)
                ]
            });
        }
    }
};