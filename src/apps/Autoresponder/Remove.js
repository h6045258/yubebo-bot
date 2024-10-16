const Autoresponder = require('../../models/autoresponderSchema');

module.exports = {
    name: 'remove',
    description: 'Xoá 1 trigger autoresponder đã tạo',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'trigger',
            description: 'Trigger ar bạn muốn xoá',
            type: 'String',
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const trigger = options.getString('trigger');

        const ar = await Autoresponder.findOne({ guildId: interaction.guild.id, trigger: trigger });
        if (!ar) {
            return interaction.editReply({
                content: `${client.e.fail} | Trigger bạn vừa nhập không tồn tại!`
            });
        }

        await Autoresponder.deleteOne({ guildId: interaction.guild.id, trigger: trigger });

        return interaction.editReply({
            content: `${client.e.done} | Trigger \`${trigger}\` đã được xoá thành công!`
        });
    }
}
