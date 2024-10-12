const language_data = require('../../models/languageSchema');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    name: 'language',
    aliases: ['lang', 'languages'],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Thay đổi ngôn ngữ của bot !',
        example: 'lang',
        usage: 'lang'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {

        let data = await language_data.findOne({ GuildId: message.guild.id });
        if (!data) {
            data = new language_data({
                GuildId: message.guild.id,
                language: 'vi'
            });
            await data.save();
        }

        const langJson = {
            'vi': '🇻🇳 Tiếng Việt',
            'en': '🇺🇸 English'
        }

        const vi = new ButtonBuilder()
            .setCustomId('vi')
            .setEmoji('🇻🇳')
            .setStyle(ButtonStyle.Secondary);

        const en = new ButtonBuilder()
            .setCustomId('en')
            .setEmoji('🇺🇸')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(vi, en);

        const embed = client.embed()
            .setColor(client.color.y)
            .setDescription(lang.utils.language_1
                .replace('{value}', langJson[data.language])
                .replace('{value2}', data.language));

        const msg = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                return i.reply({ content: lang.interaction.error, ephemeral: true });
            }

            data.language = i.customId;
            await data.save();

            const updateEmbed = client.embed()
                .setColor(client.color.y)
                .setDescription(lang.utils.language_2
                    .replace('{value}', langJson[i.customId])
                    .replace('{value2}', i.customId));

            await i.update({ embeds: [updateEmbed], components: [] });
        });

        collector.on('end', (collected, reason) => {
            if (collected.size < 0) {
                const timeoutEmbed = client.embed()
                    .setColor(client.color.y)
                    .setDescription(lang.utils.timeout);

                msg.edit({ embeds: [timeoutEmbed], components: [] });
            }
        });
    }
};