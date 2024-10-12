const wordData = require('../../../configs/word.json');
const wordConnectionModel = require('../../../models/wordConnectionBot');

module.exports = {
    name: 'bot',
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
        user: ['']
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

        const existingBotSetup = await wordConnectionModel.findOne({ channelId: channelId });

        if (!existingBotSetup) {
            return await interaction.reply(`Không tìm thấy setup nào cho trò chơi nối từ trong channel này.`);
        }

        const firstWord = client.randomWord();

        existingBotSetup.existed = [];
        existingBotSetup.word = firstWord;

        await interaction.guild.channels.cache.get(existingBotSetup.channelId).send(`Setup trò chơi nối từ trong channel <#${channelId}> đã được reset về ban đầu\nTừ nối lại là: ${firstWord}`)

        await existingBotSetup.save();
        

        await interaction.reply(`Setup trò chơi nối từ trong channel <#${channelId}> đã được reset về ban đầu.`);
    }
};
