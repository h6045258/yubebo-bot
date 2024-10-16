const Embed = require('../../models/embedSchema');

module.exports = {
    name: 'create',
    description: 'Tạo 1 embed mới',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'name',
            description: 'Tên của embed là gì?',
            type: 'String',
            required: true
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { options } = interaction;
        const name = options.getString('name');

        if (name.length > 18) {
            return interaction.editReply({
                content: `${client.e.fail} | Tên embed không được quá 18 ký tự!`
            });
        }

        const embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
        if (embed) {
            return interaction.editReply({
                content: `${client.e.fail} | Tên embed đã nằm trong hệ thống, hãy sử dụng 1 tên khác!`
            });
        }

        const data = new Embed({
            guildId: interaction.guild.id,
            name: name,
            embed: {}
        });

        await data.save();

        interaction.editReply({
            content: `${client.e.done} | Đã tạo thành công embed có tên là \`${name}\``
        });
    }
}
