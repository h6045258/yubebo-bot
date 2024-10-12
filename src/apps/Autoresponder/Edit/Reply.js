const Autoresponder = require('../../../models/autoresponderSchema');
const Embed = require('../../../models/embedSchema');

module.exports = {
    name: 'reply',
    description: 'Chỉnh sửa nội dung phản hồi của trigger autoresponder',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'trigger',
            description: 'Trigger mà bạn muốn chỉnh',
            type: 'String',
            required: true,
            autocomplete: true
        },
        {
            name: 'reply',
            description: 'Nội dung phản hồi mới cho trigger',
            type: 'String',
            required: false
        },
        {
            name: 'embed',
            description: 'Gửi kèm embed cho trigger',
            type: 'String',
            required: false,
            autocomplete: true
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });

        const { options } = interaction;
        const trigger = options.getString('trigger');
        const reply = options.getString('reply');
        const embedName = options.getString('embed');

        if (!reply && !embedName) {
            return interaction.editReply({
                content: `${client.e.fail} | Bạn cần cung cấp ít nhất một trong các tùy chọn sau: reply hoặc embed để cập nhật.`
            });
        }

        const ar = await Autoresponder.findOne({ guildId: interaction.guild.id, trigger: trigger });
        if (!ar) {
            return interaction.editReply({
                content: `${client.e.fail} | Trigger bạn vừa nhập không tồn tại!`
            });
        }

        if (reply) {
            ar.options.reply = reply;
            ar.options.embed = null;
        }

        if (embedName) {
            const embed = await Embed.findOne({ guildId: interaction.guild.id, name: embedName });
            if (!embed) {
                return interaction.editReply({
                    content: `${client.e.fail} | Không tìm thấy embed với tên '${embedName}'.`
                });
            }
            ar.options.embed = embedName;
            ar.options.reply = null;
        }

        await ar.save();

        const rawConfig = `${ar.options.reply || ''} ${ar.options.embed ? `{embed:${ar.options.embed}}` : ''}`;
        const hasDm = rawConfig.includes('{dm}');
        const hasSendTo = rawConfig.includes('{send_to:');
        const hasDeleteTrigger = rawConfig.includes('{delete_trigger:');
        const hasDeleteReply = rawConfig.includes('{delete_reply:');
        const hasCooldown = rawConfig.includes('{cooldown:');
        const hasAddRole = rawConfig.includes('{add_role:');
        const hasRemoveRole = rawConfig.includes('{remove_role:');
        const hasSetNick = rawConfig.includes('{set_nick:');
        const hasReactTrigger = rawConfig.includes('{react_trigger:');
        const hasReactReply = rawConfig.includes('{react_reply:');
        const hasReplyNoMention = rawConfig.includes('{reply_no_mention}');
        const hasMessageNoMention = rawConfig.includes('{message_no_mention}');
        const ignoreErrors = rawConfig.includes('{ignore_errors}');

        const checkArray = (arr) => Array.isArray(arr) ? arr.length > 0 : false;

        const triggerEmbed = client.embed()
            .setColor(client.color.y)
            .setAuthor({ name: 'Autoresponder Configuration', iconURL: interaction.guild.iconURL({}) })
            .setDescription(`**Kích hoạt**\n${await client.variable(trigger, interaction, ar)}\n`)
            .addFields(
                { name: 'Chế độ khớp', value: ar.options.matchMode || 'Không có', inline: true },
                { name: 'Dms', value: 'Không', inline: true },
                { name: 'Tự động xóa tin nhắn', value: `Tin nhắn gốc: ${hasDeleteTrigger ? '`Có`' : '`Không`'}\nPhản hồi: ${hasDeleteReply ? '`Có`' : '`Không`'}`, inline: true },
                { name: 'Yêu cầu Kênh', value: checkArray(ar.options.requiredChannels) ? '`Có`' : 'Không', inline: true },
                { name: 'Bỏ qua Kênh', value: checkArray(ar.options.deniedChannels) ? '`Có`' : '`Không`', inline: true },
                { name: 'Độ dài tin nhắn', value: '`0`', inline: true },
                { name: 'Yêu cầu Thành viên', value: checkArray(ar.options.requiredUsers) ? '`Có`' : '`Không`', inline: true },
                { name: 'Bỏ qua Thành viên', value: checkArray(ar.options.deniedUsers) ? '`Có`' : '`Không`', inline: true },
                { name: 'Đặt biệt danh', value: hasSetNick ? '`Có`' : '`Không`', inline: true },
                { name: 'Yêu cầu Quyền', value: checkArray(ar.options.requiredPermissions) ? '`Có`' : '`Không`', inline: true },
                { name: 'Bỏ qua Quyền', value: checkArray(ar.options.deniedPermissions) ? '`Có`' : '`Không`', inline: true },
                { name: 'Bỏ qua Lỗi', value: ignoreErrors ? '`Có`' : '`Không`', inline: true },
                { name: 'Yêu cầu Vai trò', value: checkArray(ar.options.requiredRoles) ? '`Có`' : '`Không`', inline: true },
                { name: 'Bỏ qua Vai trò', value: checkArray(ar.options.deniedRoles) ? '`Có`' : '`Không`', inline: true },
                { name: 'Thời gian chờ', value: hasCooldown ? '`Có`' : 'Sau 0 giây', inline: true },
                { name: 'Thêm Vai trò', value: hasAddRole ? '`Có`' : '`Không`', inline: true },
                { name: 'Xóa Vai trò', value: hasRemoveRole ? '`Có`' : '`Không`', inline: true },
                { name: 'Chuyển hướng trả lời đến', value: hasSendTo ? '`Có`' : '`Không`', inline: true },
                { name: 'Phản ứng', value: `Tin nhắn gốc: ${hasReactTrigger ? '`Có`' : '`Không`'}\nPhản hồi: ${hasReactReply ? '`Có`' : '`Không`'}`, inline: true },
                { name: 'Trả lời', value: await client.variable(ar.options.reply || '`Không có`', interaction, ar), inline: true },
                { name: 'Trả lời thô', value: `\`\`\`json\n${rawConfig.trim()}\`\`\``, inline: false }
            );

        return interaction.editReply({
            content: `${client.e.done} | Nội dung phản hồi cho trigger \`${trigger}\` đã được cập nhật thành công.`,
            embeds: [triggerEmbed]
        });
    }
};