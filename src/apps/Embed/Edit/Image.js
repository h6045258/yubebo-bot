const Embed = require('../../../models/embedSchema');

module.exports = {
    name: 'image',
    description: 'Chỉnh sửa image của embed',
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
            name: 'url',
            description: 'Link ảnh đính kèm cho image',
            type: 'String',
            required: false
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const name = options.getString('embed');
        const url = options.getString('url');

        const embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
        if (!embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\``
            });
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

        const isValidUrlOrVariable = (input) => {
            const allowedVariables = ["{user_avatar}", "{server_icon}"];
            if (allowedVariables.includes(input)) return true;
            const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
            const validImageExtensions = /\.(jpg|jpeg|png|gif)/i;
            return urlPattern.test(input) && validImageExtensions.test(input);
        };

        if (!url) {
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

        if (!isValidUrlOrVariable(url)) {
            embed.embed.image = null;
            await embed.save();
            return interaction.editReply({
                embeds: [
                    client
                        .embed()
                        .setColor(embed.embed ? embed.embed.color : client.e.color)
                        .setAuthor({ name: embed.embed ? await variable(embed.embed.author.text, interaction) : null, iconURL: embed.embed ? await variable(embed.embed.author.icon, interaction) : null })
                        .setTitle(embed.embed ? await client.variable(embed.embed.title, interaction) : null)
                        .setDescription(embed.embed ? await client.variable(embed.embed.description, interaction) : '\u200b')
                        .setFooter({ text: embed.embed ? await variable(embed.embed.footer.text, interaction) : null, iconURL: embed.embed ? await variable(embed.embed.footer.icon, interaction) : null })
                        .setThumbnail(embed.embed ? await variable(embed.embed.thumbnail, interaction) : null)
                        .setImage(null)
                ]
            });
        }

        embed.embed.image = url;
        await embed.save();

        await interaction.editReply({
            content: `${client.e.done} | Hình ảnh của embed \`${name}\` đã được cập nhật.`,
            embeds: [
                client
                    .embed()
                    .setColor(embed.embed ? embed.embed.color : client.e.color)
                    .setAuthor({ name: embed.embed ? await variable(embed.embed.author.text, interaction) : null, iconURL: embed.embed ? await variable(embed.embed.author.icon, interaction) : null })
                    .setTitle(embed.embed ? await client.variable(embed.embed.title, interaction) : null)
                    .setDescription(embed.embed ? await client.variable(embed.embed.description, interaction) : '\u200b')
                    .setFooter({ text: embed.embed ? await variable(embed.embed.footer.text, interaction) : null, iconURL: embed.embed ? await variable(embed.embed.footer.icon, interaction) : null })
                    .setThumbnail(embed.embed ? await variable(embed.embed.thumbnail, interaction) : null)
                    .setImage(url ? await variable(url, interaction) : null)
            ]
        });
    },
};
