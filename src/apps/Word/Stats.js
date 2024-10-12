const { EmbedBuilder } = require('discord.js');
const dictionaryModel = require('../../models/WordSchema');

module.exports = {
    name: 'stats',
    description: 'Xem thông tin từ điển',
    cooldown: 3,
    permission: {
        bot: [],
        user: [],
        dev: true
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
        const embed = new EmbedBuilder()
            .setAuthor({ name: "Thông tin từ điển", iconURL: interaction.guild.iconURL() })

        await interaction.reply({ embeds: [embed] });
    }
};