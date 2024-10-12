const { EmbedBuilder } = require('discord.js');
const bl = require('../../models/BlacklistSchema');

module.exports = {
    name: 'listbanga',
    aliases: ['lbt', 'listban'],
    category: 'Giveaway',
    cooldown: 15,
    description: {
        content: 'List những người bị ban giveaways!',
        example: 'lbt',
        usage: 'lbt'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        try {
            let blacklistEntries = await bl.find(); 

            if (args[0] && args[0].toLowerCase() === 'all') {
                blacklistEntries = blacklistEntries.filter(entry => entry.global || !entry.guildid === message.guild.id);
            } else {
                blacklistEntries = blacklistEntries.filter(entry => !entry.global && entry.guildid === message.guild.id);
            }

            if (blacklistEntries.length === 0) {
                return message.channel.send('Danh sách blacklist trống.');
            }

            let blacklistInfo = `**Guild Name: ${message.guild.name}**\n\n`;

            blacklistEntries.forEach(entry => {
                const globalStatus = entry.global ? '<:yb_success:1163479511636123668>' : '<:yb_fail:1163479516325359666>';
                blacklistInfo += `User: **${entry.username}**\nReason: **${entry.reason}**\nGlobal: ${globalStatus}\nGuildname: ${entry.guildname}\n--\n`;
            });

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(blacklistInfo)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách blacklist:', error);
            message.channel.send('Đã xảy ra lỗi khi lấy danh sách blacklist.');
        }
    },
};
