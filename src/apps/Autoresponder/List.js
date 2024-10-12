const Autoresponder = require('../../models/autoresponderSchema');

module.exports = {
    name: 'list',
    description: 'Xem danh sách autorespond đã tạo',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const ar = await Autoresponder.find({ guildId: interaction.guild.id });
        const autorespond = ar.map(ar => `<:yb_gach:1259907092777537628> ${ar.trigger}`).join('\n\n') || `Chưa có autorespond nào đã tạo tại ${interaction.guild.name}`;

        interaction.editReply({
            embeds: [
                client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: 'Danh Sách Autorespond', iconURL: client.user.displayAvatarURL({}) })
                    .setDescription(autorespond)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({}) })
            ]
        })
    }
};