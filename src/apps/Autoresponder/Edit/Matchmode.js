const Autoresponder = require("../../../models/autoresponderSchema");

module.exports = {
    name: "matchmode",
    description: "Chỉnh sửa chế độ khớp cho trigger autoresponder",
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: "trigger",
            description: "Trigger mà bạn muốn chỉnh",
            type: "String",
            required: true,
            autocomplete: true,
        },
        {
            name: "mode",
            description: "Loại chế độ khớp",
            type: "String",
            required: true,
            choices: [
                { name: "exactly", value: "exactly" },
                { name: "includes", value: "includes" },
                { name: "startswith", value: "startswith" },
                { name: "endswith", value: "endswith" },
            ],
        },
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });

        const { options } = interaction;
        const trigger = options.getString("trigger");
        const matchMode = options.getString("mode");

        const ar = await Autoresponder.findOne({
            guildId: interaction.guild.id,
            trigger: trigger,
        });
        if (!ar) {
            return interaction.editReply({
                content: `${client.e.fail} | Trigger bạn vừa nhập không tồn tại!`,
            });
        }

        ar.options.matchMode = matchMode;
        await ar.save();

        return interaction.editReply({
            content: `${client.e.done} | Chế độ khớp cho trigger \`${trigger}\` đã được cập nhật thành \`${matchMode}\`.`,
        });
    },
};
