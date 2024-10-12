const Embed = require('../../models/embedSchema');

module.exports = {
    name: 'list',
    description: 'Xem danh sách embed đã tạo',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    run: async (client, interaction, user, prefix, message, lang) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const embed = await Embed.find({ guildId: interaction.guild.id });
        const embeds = embed.map(emb => `<:yb_gach:1259907092777537628> \`${emb.name}\``).join('\n\n') || `Chưa có embed nào đã tạo tại ${interaction.guild.name}`;

        interaction.editReply({
            embeds: [
                client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `Danh Sách Embed`, iconURL: client.user.displayAvatarURL({}) })
                    .setDescription(embeds)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({}) })
            ]
        });
    }
}