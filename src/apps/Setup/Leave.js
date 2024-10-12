const { ChannelType } = require('discord.js');
const Welcome = require('../../models/welcomeSchema');
const Embed = require('../../models/embedSchema');

module.exports = {
    name: 'leave',
    description: 'Chỉnh giao diện leave cho server',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'channel',
            description: 'Kênh leave tại server',
            type: 'Channel',
            channelTypes: [ChannelType.GuildText],
            required: true
        },
        {
            name: 'content',
            description: 'Nội dung tin nhắn rời khỏi',
            type: 'String',
            required: false
        },
        {
            name: 'embed',
            description: 'Chọn embed để hiển thị',
            type: 'String',
            required: false,
            autocomplete: true
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const channel = options.getChannel('channel');
        const content = options.getString('content');
        const embedName = options.getString('embed');

        if (!content && !embedName) {
            return interaction.editReply({
                content: `${client.e.fail} | Bạn phải chọn ít nhất một trong hai: nội dung hoặc embed.`
            });
        }

        let welcomeSettings = await Welcome.findOne({ guildId: interaction.guild.id });

        if (embedName) {
            const embed = await Embed.findOne({ guildId: interaction.guild.id, name: embedName });
            if (!embed) {
                return interaction.editReply({
                    content: `${client.e.fail} | Không tìm thấy embed với tên '${embedName}'.`
                });
            }
        }

        if (!welcomeSettings) {
            welcomeSettings = new Welcome({
                guildId: interaction.guild.id,
                options: {
                    welcome: {
                        channel: null,
                        content: null,
                        embed: null
                    },
                    leave: {
                        channel: channel.id,
                        content: content || null,
                        embed: embedName || null
                    }
                }
            });
        } else {
            welcomeSettings.options.leave.channel = channel.id;
            welcomeSettings.options.leave.content = content || null;
            welcomeSettings.options.leave.embed = embedName || null;
        }

        await welcomeSettings.save();

        const replyEmbed = client.embed()
            .setColor(client.color.y)
            .setAuthor({ name: 'Leave Update', iconURL: interaction.guild.iconURL({}) })
            .addFields(
                { name: 'Kênh', value: `<#${channel.id}>`, inline: true },
                { name: 'Nội dung', value: content || client.e.fail, inline: true },
                { name: 'Embed', value: embedName || client.e.fail, inline: true }
            )
            .setTimestamp();

        return interaction.editReply({
            content: `${client.e.done} | Cập nhật leave thành công.`,
            embeds: [replyEmbed]
        });
    }
}