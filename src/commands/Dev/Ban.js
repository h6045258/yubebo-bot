const banSchema = require('../../models/BanSchema');

module.exports = {
  name: "ban",
  description: ["Hạn chế người dùng khỏi việc dùng bot!"],
  aliases: ["thanhtrung", "banbot"],
  usage: ["{prefix}thanhtrung", "{prefix}banbot"],
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
    const { QuickDB } = require("quick.db");
    const db = new QuickDB({ table: "DB" });
    let reason = args.slice(1).join(' ');
    if (!reason) reason = `Lợi dụng bug và khai thác tài nguyên trái phép!`;
    let mentionedUser = message.mentions.members.first();
    if (!mentionedUser) {
      try {
        mentionedUser = await client.users.fetch(args[0])
      } catch (error) {
        console.error(error);
        return message.reply(`${client.e.fail} | Không thể tìm thấy người dùng.`);
      }
    }
    let username = mentionedUser.username || mentionedUser.user.username;
    const banned = new banSchema({ admins: message.author.username, memberid: mentionedUser.id, guildid: message.guild.id, username: username, guildname: message.guild.name, reason: reason });
    await banned.save();
    await db.set(`${mentionedUser.id}_softban1`, true);
    await mentionedUser.send(`**☠ |** Bạn đã bị cấm sử dụng bot vĩnh viễn!\n**      | Lý do:** ${reason}`).catch(() => { });
    return message.channel.send(`${client.e.done} | Đã ban **${username}**`);
  },
};
