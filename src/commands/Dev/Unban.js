module.exports = {
  name: "unban",
  description: ["Gỡ ban "],
  aliases: ["anxa", "unbanbot"],
  usage: ["{prefix}anxa"],
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
    const banSchema = require('../../models/BanSchema')
    const { QuickDB } = require("quick.db")
    const db = new QuickDB({ table: "DB" })
    let reason = args.slice(1).join(' ')
    if (!reason) reason = `Vì được xét không vi phạm quy định của bot!`
    let mentionedUser = message.mentions.members.first() || client.users.cache.find(u => u.id == args[0])
    if (!mentionedUser) return message.reply(`${client.e.fail} | Bạn phải mention hoặc nhập ID của member cần unban!`)
    let username = mentionedUser.username || mentionedUser.user.username
    await banSchema.deleteOne({ memberid: mentionedUser.id })
    await db.delete(`${mentionedUser.id}_oncaptcha2`)
    await db.delete(`${mentionedUser.id}_softban1`)
    await message.channel.send(`${client.e.done} | Đã gỡ ban **${username}**`)
    let messagess = `Bạn đã được gỡ ban từ MOD **${message.author.username}** với lý do:
\`\`\`${reason}\`\`\``
    return mentionedUser.send(messagess).catch(e => console.log(e))
  },
};