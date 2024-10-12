const Embed = require('../../../models/embedSchema');

module.exports = {
    name: 'timestamp',
    description: 'Chỉnh sửa timestamp của embed',
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
            name: 'timestamp',
            description: 'Chọn có nếu muốn hiển thị hoặc không',
            type: 'Boolean',
            required: false
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const name = options.getString('embed');
        const time = options.getBoolean('timestamp');

        const embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
        if (!embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\``
            });
        }

        if (time === null) {
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

        if (time) {
            embed.embed.timestamp = time;
        } else {
            delete embed.embed.timestamp;
        }

        await embed.save();

        await interaction.editReply({
            content: `${client.e.done} | Timestamp của embed \`${name}\` đã được cập nhật.`,
            embeds: [
                client
                    .embed()
                    .setColor(embed.embed ? embed.embed.color : client.color.y)
                    .setAuthor(embed.embed.author ? { name: await client.variable(embed.embed.author.text, interaction), iconURL: await client.variable(embed.embed.author.icon, interaction) } : null)
                    .setTitle(embed.embed ? await client.variable(embed.embed.title, interaction) : null)
                    .setDescription(embed.embed ? await client.variable(embed.embed.description, interaction) || '\u200b' : null)
                    .setFooter(embed.embed.footer ? { text: await client.variable(embed.embed.footer.text, interaction), iconURL: await client.variable(embed.embed.footer.icon, interaction) } : null)
                    .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, interaction) : null)
                    .setImage(embed.embed ? await client.variable(embed.embed.image, interaction) : null)
                    .setTimestamp(time ? new Date() : null)
            ]
        });
    }
};