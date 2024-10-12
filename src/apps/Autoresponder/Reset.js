const Autoresponder = require('../../models/autoresponderSchema');

module.exports = {
    name: 'reset',
    description: 'Xoá tất cả các trigger autoresponder đã tạo tại server',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });

        try {
            const triggers = await Autoresponder.find({ guildId: interaction.guild.id });
            if (triggers.length === 0) {
                return interaction.editReply({
                    content: `${client.e.fail} | Không có trigger nào để reset trong server ${interaction.guild.name} này.`
                });
            }

            await Autoresponder.deleteMany({ guildId: interaction.guild.id });

            return interaction.editReply({
                content: `${client.e.done} | Tất cả các trigger trong server ${interaction.guild.name} đã được xoá thành công!`
            });
        } catch (error) {
            return interaction.editReply({
                content: `${client.e.fail} | Đã xảy ra lỗi khi cố gắng xoá tất cả các trigger. Vui lòng thử lại!`
            });
        }
    }
}