const wordConnectionGameModel = require('../../../models/wordConnectionGame');

module.exports = {
    name: 'free',
    description: 'Xoá setup chế độ chơi tự do',
    cooldown: 3,
    options: [
        {
            name: 'channelname',
            description: "Tên channel mà bạn muốn reset xoá nối từ",
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

        const existingGameSetup = await wordConnectionGameModel.findOne({ channelId: channelId, mode: "free" });

        if (!existingGameSetup) {
            return await interaction.reply(`Không tìm thấy setup nào cho trò chơi nối từ trong channel này.`);
        }

        if (existingGameSetup) {
            await existingGameSetup.deleteOne();
        }

        await interaction.reply(`Setup trò chơi nối từ trong channel <#${channelId}> đã được xoá.`);
    }
};
