const Autoresponder = require('../../models/autoresponderSchema');
const Embed = require('../../models/embedSchema');

module.exports = {
    name: 'add',
    description: 'Tạo 1 trigger autoresponder mới',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'trigger',
            description: 'Tên của tigger của bạn',
            type: 'String',
            required: true,
        },
        {
            name: 'reply',
            description: 'Phản hồi khi sử dụng trigger',
            type: 'String',
            required: false,
        },
        {
            name: 'embed',
            description: 'Phản hồi kèm embed khi sử dụng trigger',
            type: 'String',
            required: false,
            autocomplete: true,
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const trigger = options.getString('trigger');
        const reply = options.getString('reply');
        const name = options.getString('embed');

        if (!reply && !name) {
            return interaction.editReply({
                content: `${client.e.fail} | Bạn phải chọn ít nhất một trong hai tùy chọn\n* \`reply\` Phản hồi 1 đoạn tin nhắn thông thường khi dùng trigger\n* \`embed\` Gửi kèm embed khi dùng trigger!`
            });
        }

        const ar = await Autoresponder.findOne({ guildId: interaction.guild.id, trigger: trigger });
        if (ar) {
            return interaction.editReply({
                content: `${client.e.fail} | Trigger \`${trigger}\` đã tồn tại, vui lòng chọn tên khác!`
            });
        }

        if (reply && (reply.includes('@everyone') || reply.includes('@here'))) {
            return interaction.editReply({
                content: `${client.e.fail} | Trigger reply không được chứa \`@everyone\` hoặc \`@here!\``
            });
        }

        const embed = name ? await Embed.findOne({ guildId: interaction.guild.id, name: name }) : null;
        if (name && !embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\`!`
            });
        }

        const ares = new Autoresponder({
            guildId: interaction.guild.id,
            trigger: trigger,
            options: {
                reply: reply,
                embed: embed ? name : null,
            }
        });

        await ares.save();
        return interaction.editReply({
            content: `${client.e.done} | Autoresponder mới đã được tạo với trigger \`${trigger}\`\n\n\`\`\`diff\n+ Reply: ${reply}\`\`\`\n\n\`\`\`diff\n+ Embed: ${name}\`\`\``
        });
    }
}