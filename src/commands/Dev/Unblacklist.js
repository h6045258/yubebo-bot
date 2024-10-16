const BlacklistUser = require('../../models/BlacklistSchema')
const { PermissionsBitField } = require(`discord.js`)
module.exports = {
    name: "unblacklist",
    description: "Unblacklist a user from giveaways.",
    aliases: ["unblga", "unbanga", "ungaban"],
    usage: "{prefix}unblacklist @user [guild|global]",
    cooldown: 3,
    category: "Dev",
    permissions: {
        dev: true
    },
    /**
     * 
     * @param {import('discord.js').Client} client
     * @param {*} message 
     * @param {*} args
     * @returns 
     */
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.channel.send(`Lệnh đúng là: \`Yunblacklist @user [guild|global]\``);
        }

        const mentionedUser = message.mentions.members.first() || client.users.cache.find(u => u.id === args[0]);
        if (!mentionedUser) return message.reply(`<:yb_fail:1163479516325359666>  | Bạn phải mention hoặc cung cấp ID người dùng cần xóa khỏi blacklist.`);

        let username = mentionedUser.username || mentionedUser.user.username;
        const scope = args[1];

        try {
            if (scope === 'global') {
                const removedUser = await BlacklistUser.findOneAndDelete({ memberid: mentionedUser.id, global: true })
                if (removedUser) {
                    message.reply(`<:yb_success:1163479511636123668> | Người dùng **${username}** đã được xóa khỏi global blacklist.`);
                } else {
                    message.reply(`<:yb_fail:1163479516325359666>  | Người dùng không nằm trong global blacklist.`);
                }
            } else {
                if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return message.reply(`<:yb_fail:1163479516325359666>  | **Bạn không có quyền unban giveaways, bạn cần có quyền admin để thực hiện điều này !**`);
                }
                const removedUser = await BlacklistUser.findOneAndDelete({ memberid: mentionedUser.id, guildid: message.guild.id, global: false });

                if (removedUser) {
                    message.reply(`<:yb_success:1163479511636123668> | Người dùng **${username}** đã được xóa khỏi guild blacklist.`);
                } else {
                    message.reply(`<:yb_fail:1163479516325359666>  | Người dùng không nằm trong guild blacklist.`);
                }
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng khỏi blacklist:', error);
            message.reply(`${client.e.error} | Đã xảy ra lỗi khi xóa người dùng khỏi blacklist.`);
        }
    }
}
