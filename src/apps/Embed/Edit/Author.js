const Embed = require('../../../models/embedSchema');

module.exports = {
    name: 'author',
    description: 'Chỉnh sửa author của embed',
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
            description: 'Chỉnh văn bản của author',
            type: 'String',
            required: false
        },
        {
            name: 'icon',
            description: 'Chỉnh link ảnh của author icon',
            type: 'String',
            required: false
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const name = options.getString('embed');
        const text = options.getString('text');
        let icon = options.getString('icon');

        const embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
        if (!embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\`!`
            });
        }

        let updateText = text ? await client.variable(text, interaction) : null;
        let updateIcon = null;

        const isVariable = icon && (icon.includes("{user_avatar}") || icon.includes("{server_icon}"));

        if (icon) {
            const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(icon);
            const isValidImageFormat = /\.(jpg|jpeg|png|gif)/i.test(icon);
            if (isValidUrl && isValidImageFormat || isVariable) {
                updateIcon = icon;
            } else {
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(embed.embed ? embed.embed.color : client.color.y)
                            .setAuthor({
                                name: updateText || (embed.embed.author ? await client.variable(embed.embed.author.text, interaction) : null),
                                iconURL: embed.embed.author ? await client.variable(embed.embed.author.icon, interaction) : null
                            })
                            .setTitle(embed.embed ? await client.variable(embed.embed.title, interaction) : null)
                            .setDescription(embed.embed ? await client.variable(embed.embed.description, interaction) : '\u200b')
                            .setFooter({
                                text: embed.embed.footer ? await client.variable(embed.embed.footer.text, interaction) : null,
                                iconURL: embed.embed.footer ? await client.variable(embed.embed.footer.icon, interaction) : null
                            })
                            .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, interaction) : null)
                            .setImage(embed.embed ? await client.variable(embed.embed.image, interaction) : null)
                            .setTimestamp(embed.embed.timestamp === true ? new Date() : null)
                    ]
                });
            }
        }

        if (text) embed.embed.author.text = updateText;
        if (icon !== undefined) embed.embed.author.icon = updateIcon;

        await embed.save();

        return interaction.editReply({
            content: `${client.e.done} | Author đã được cập nhật.`,
            embeds: [
                client.embed()
                    .setColor(embed.embed ? embed.embed.color : client.color.y)
                    .setAuthor({
                        name: text ? updateText : (embed.embed.author ? await client.variable(embed.embed.author.text, interaction) : null),
                        iconURL: icon ? await client.variable(updateIcon, interaction) : (embed.embed.author ? await client.variable(embed.embed.author.icon, interaction) : null)
                    })
                    .setTitle(embed.embed ? await client.variable(embed.embed.title, interaction) : null)
                    .setDescription(embed.embed ? await client.variable(embed.embed.description, interaction) : '\u200b')
                    .setFooter({
                        text: embed.embed.footer ? await client.variable(embed.embed.footer.text, interaction) : null,
                        iconURL: embed.embed.footer ? await client.variable(embed.embed.footer.icon, interaction) : null
                    })
                    .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, interaction) : null)
                    .setImage(embed.embed ? await client.variable(embed.embed.image, interaction) : null)
                    .setTimestamp(embed.embed.timestamp === true ? new Date() : null)
            ]
        });
    }
}
