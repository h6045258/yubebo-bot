const wordConnectionModel = require('../../../models/wordConnectionBot');

module.exports = {
    name: 'bot',
    description: 'Xoá setup chế độ chơi với bot',
    cooldown: 3,
    options: [
        {
            name: 'channelname',
            description: "Tên channel mà bạn muốn xoá setup nối từ",
            type: "String",
            required: true,
            autocomplete: true
        }
    ],
    permission: {
        bot: ['ManageGuild', 'ManageThreads'],
        user: ["ManageGuild"]
    },
    run: async (client, interaction, user, prefix, message, lang) => {
        const channelId = interaction.options.getString('channelname');

        const existingBotSetup = await wordConnectionModel.findOne({ channelId: channelId });

        if (!existingBotSetup) {
            return await interaction.reply(`Không tìm thấy setup nào cho trò chơi nối từ trong channel này.`);
        }

        if (existingBotSetup) {
            await existingBotSetup.deleteOne();
        }

        await interaction.reply(`Setup trò chơi nối từ trong channel <#${channelId}> đã được xoá.`);
    }
};
