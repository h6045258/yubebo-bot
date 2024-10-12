const wordConnectionBot = require('../../models/wordConnectionBot');
const wordConnectionGame = require('../../models/wordConnectionGame');

module.exports = {
    name: 'help',
    description: 'giải cứu nối từ',
    cooldown: 18000,
    options: [
        {
            name: "word",
            description: "nhập từ cần gợi ý vào đây",
            required: true,
            type: "String"
        }
    ],

    run: async (client, interaction, user, prefix, message, lang) => {
        const word = interaction.options.getString('word');
        const [wordConnectionBotData, wordConnectionGameData] = await Promise.all([
            wordConnectionBot.findOne({ channelId: interaction.channel.id }),
            wordConnectionGame.findOne({ channelId: interaction.channel.id })
        ]);
        const wordHelps = (await client.getExistedWord(word)).filter(w => {
            if (wordConnectionBotData) return !wordConnectionBotData.existed.includes(w);
            else if (wordConnectionGameData) return !wordConnectionGameData.existed.includes(w);
            return true;
        });
        await interaction.reply(wordHelps.length > 0 ? `Từ gợi ý của tôi là: ${wordHelps.map(w => `**${w}**`)[0]}` : "Hết roài ;-;");
    }
};