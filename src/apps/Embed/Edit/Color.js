const Embed = require('../../../models/embedSchema');

module.exports = {
    name: 'color',
    description: 'Chỉnh sửa màu của embed',
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
            name: 'color',
            description: 'Chỉnh mã màu của embed',
            type: 'String',
            required: false
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const name = options.getString('embed');
        let color = options.getString('color');

        const embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
        if (!embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\`!`
            });
        }

        if (!color) {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(embed.embed ? embed.embed.color : client.color.y)
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

        const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(color);

        if (color && isValidColor) {
            embed.embed.color = color;
        } else if (color) {
            return interaction.editReply({
                content: `${client.e.fail} | Mã màu bạn vừa nhập không đúng, vui lòng thử lại!`
            });
        } else {
            color = client.color.y;
        }

        await embed.save();

        await interaction.editReply({
            content: `${client.e.done} | Color của embed \`${name}\` đã được cập nhật.`,
            embeds: [
                client
                    .embed()
                    .setColor(color)
                    .setAuthor({ name: embed.embed ? await client.variable(embed.embed.author.text, interaction) : null, iconURL: embed.embed ? await client.variable(embed.embed.author.icon, interaction) : null })
                    .setTitle(embed.embed ? await client.variable(embed.embed.title, interaction) : null)
                    .setDescription(embed.embed ? await client.variable(embed.embed.description, interaction) : '\u200b')
                    .setFooter({ text: embed.embed ? await client.variable(embed.embed.footer.text, interaction) : null, iconURL: embed.embed ? await client.variable(embed.embed.footer.icon, interaction) : null })
                    .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, interaction) : null)
                    .setImage(embed.embed ? await client.variable(embed.embed.image, interaction) : null)
                    .setTimestamp(embed.embed.timestamp === true ? new Date() : null)
            ]
        });
    }
}
