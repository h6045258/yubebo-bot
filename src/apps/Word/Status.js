const wordConnectionGameModel = require('../../models/wordConnectionGame');
const wordConnectionBotModel = require('../../models/wordConnectionBot');
const { EmbedBuilder } = require('discord.js');
const wordRandomData = require('../../configs/wordRandom.json');
const dictionaryModel = require('../../models/WordSchema');


module.exports = {
    name: 'status',
    description: 'Xem thông tin trò chơi nối từ trong server',
    cooldown: 3,
    permission: {
        bot: [],
        user: []
    },
    /**
     * 
     * @param {} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     * @param {*} user 
     * @param {*} prefix 
     * @param {*} message 
     * @param {*} lang 
     */

    run: async (client, interaction, user, prefix, message, lang) => {
        const guildChannels = interaction.guild.channels.cache;
        const gameChannels = (await wordConnectionGameModel.find()).filter(v => guildChannels.has(v.channelId));
        const botGameChannels = (await wordConnectionBotModel.find()).filter(v => guildChannels.has(v.channelId));
        const embed = new EmbedBuilder()
            .setAuthor({ name: "Thông tin trò chơi nối từ", iconURL: interaction.guild.iconURL() })
            .addFields([
                {
                    name: `Nối từ với bot (${botGameChannels.length})`,
                    value: botGameChannels.map(v => `<#${v.channelId}>`).join(" ") || "Không có"
                },
                {
                    name: `Nối từ với Người (${gameChannels.length})`,
                    value: gameChannels.map(v => `<#${v.channelId}>`).join(" ") || "Không có"
                },
                {
                    name: `Source Từ gốc hiện tại`,
                    value: `**Easy :** \`${wordRandomData.easy.length} từ\`\n**Medium :** \`${wordRandomData.medium.length} từ\`\n**Hard :** \`${wordRandomData.hard.length} từ\``
                },
                {
                    name: `Source Từ do User góp ý`,
                    value: `**Tổng :** \`${(await dictionaryModel.find()).length}\` từ`
                }
            ]);


        await interaction.reply({embeds: [embed]});
    }
};
