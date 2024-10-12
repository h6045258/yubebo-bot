const { fail } = require('assert')
const BlacklistUser = require('../../models/BlacklistSchema')
const { PermissionsBitField } = require(`discord.js`)
const userReg = RegExp(/<@!?(\d+)>/)
module.exports = {
    name: "blacklist",
    description: ["Hạn chế người dùng khỏi việc dùng bot!"],
    aliases: ["blga", "banga", "gaban"],
    usage: ["{prefix}thanhtrung"],
    cooldown: 0,
    category: "Giveaway",
    permissions: {
        dev: false,
    },
    run: async (client, message, args, prefix, lang) => {
		const yukii = client.users.cache.find(u => u.id == `696893548863422494`)
        if (!args[0]) {return message.channel.send(`Lệnh đúng là: \`Ygaban @user guild [reason]\` \n \`ex: Ygaban @yl_phankha guild không làm req nhiều lần.\``)}
        let reason = args.slice(2).join(' ')
        if (!reason) reason = `Không có`
        const mentionedUser = message.mentions.members.first() || client.users.cache.find(u => u.id == args[0])
        if (!mentionedUser) return message.reply(`<:yb_fail:1163479516325359666>  | Bạn phải mentions hoặc cung cấp ID người dùng cần thêm vào blacklist giveaways`)
        let username = mentionedUser.username || mentionedUser.user.username
        const existingEntry = await BlacklistUser.findOne({ memberid: mentionedUser.id });

        if (args[1] === 'global') {
            try {
                if (message.author.id !== "696893548863422494") return
                if (existingEntry) {
                    existingEntry.global = true;
                    await existingEntry.save();
                    message.reply(`<:yb_success:1163479511636123668> | Người dùng **${username}** đã bị **chuyển từ guild ban thành global ban giveaways** với lý do: **${reason}**`);
                } else {
                    const banned = new BlacklistUser({ memberid: mentionedUser.id, guildid: message.guild.id, username: username, guildname: message.guild.name, reason: reason, global: true });
                    await banned.save();
                    message.reply(`<:yb_success:1163479511636123668> | Người dùng **${username}** đã bị **ban giveaways** ở **tất cả server** với lý do: **${reason}**`);
                }
            } catch (error) {
                message.reply('Người dùng đã tồn tại trong global blacklist.');
            }
        } else if (args[1] === 'guild') {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply(`<:yb_fail:1163479516325359666>  | **Bạn phải có quyền \`ADMIN\` mới được sử dụng lệnh blacklist giveaways!**`);
            }
            try {
                const banned = new BlacklistUser({ memberid: mentionedUser.id, guildid: message.guild.id, username: username, guildname: message.guild.name, reason: reason, global: false });
                await banned.save();
                message.reply(`<:yb_success:1163479511636123668> | Người dùng **${username}** đã được thêm vào **guild blacklist** với lý do: **${reason}**`);
                await yukii.send(`**${username}** đã bị guild ban tại ${message.guild.name} với lý do: **${reason}**`)
            } catch (error) {
                message.reply('Người dùng đã tồn tại trong guild blacklist.');
            }
        }
    }
}
