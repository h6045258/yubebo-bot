const Embed = require('../../models/embedSchema');

module.exports = {
    name: 'delete',
    description: 'Xóa embed đã tạo',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'name',
            description: 'Tên của embed muốn xóa',
            type: 'String',
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const name = options.getString('name');

        const embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
        if (!embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Tên embed bạn vừa nhập không nằm trong hệ thống, hãy thử lại!`
            });
        }

        await embed.deleteOne();
        await interaction.editReply({
            content: `${client.e.done} | Đã xóa thành công embed có tên \`${name}\``
        });
    }
}