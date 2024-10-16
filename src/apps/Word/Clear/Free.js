const wordConnectionGameModel = require('../../../models/wordConnectionGame');
const wordData = require('../../../configs/word.json');


module.exports = {
    name: 'free',
    description: 'reset lại nối từ mà không phải xoá',
    cooldown: 3,
    options: [
        {
            name: 'channelname',
            description: "Tên channel mà bạn muốn reset setup nối từ",
            type: "String",
            required: true,
            autocomplete: true
        }
    ],
    permission: {
        bot: ['ManageGuild', 'ManageThreads'],
        user: ""
    },
    /**
     * 
     * @param {*} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     * @param {*} user 
     * @param {*} prefix 
     * @param {*} message 
     * @param {*} lang 
     * @returns 
     */
    run: async (client, interaction, user, prefix, message, lang) => {
        const channelId = interaction.options.getString("channelname");

        const existingBotSetup = await wordConnectionGameModel.findOne({ channelId: channelId, mode: "free" });

        if (!existingBotSetup) {
            return await interaction.reply(`Không tìm thấy setup nào cho trò chơi nối từ trong channel này.`);
        }
        existingBotSetup.replay = true;
        await existingBotSetup.save();
        
        await interaction.reply(`Setup trò chơi nối từ trong channel <#${channelId}> đã được reset về ban đầu.`);
        await interaction.guild.channels.cache.get(existingBotSetup.channelId).send("Đã có người tái thiệt lập chế độ chơi free tại đây~, Người đầu tiên có thể đưa ra từ mới...")
    }
};
