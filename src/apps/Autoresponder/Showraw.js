const Autoresponder = require('../../models/autoresponderSchema');

module.exports = {
    name: 'showraw',
    description: 'Hiển thị nội dung raw của reply cho trigger đã tạo',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'trigger',
            description: 'Trigger mà bạn muốn xem nội dung reply',
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
                content: `${client.e.info} | Không tìm thấy trigger nào với tên \`${ar}\`.`
            });
        }

        return interaction.editReply({ content: `\`\`\`${ar.options.reply}\`\`\`` });
    }
}