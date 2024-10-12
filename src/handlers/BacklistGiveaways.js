const bl = require('../models/BlacklistSchema');

async function handleGiveawayReaction(giveaway, member, reaction) {
    try {
        const blacklistEntry = await bl.findOne({ memberid: member.id });

        if (blacklistEntry) {
            if (blacklistEntry.global === true) {
                reaction.users.remove(member.user);
                member.send(':no_entry_sign: | **Bạn đã bị ban giveaway ở tất cả server, không thể tham gia\nNếu bạn nghĩ đây là lỗi, hãy liên hệ dev bot thông qua [Server Support](https://discord.gg/yubabe)**');
            } else if (blacklistEntry.global === false && blacklistEntry.guildid === member.guild.id) {
                reaction.users.remove(member.user);
                member.send(`:no_entry_sign: | **Bạn đã bị guild ban giveaway tại ${member.guild.name}, không thể tham gia**`)
            }
        }
    } catch (error) {
        console.error('Error checking blacklist:', error);
    }
}

module.exports = { handleGiveawayReaction }; 