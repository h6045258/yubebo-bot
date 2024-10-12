const dailySchema = require("../../models/dailySchema")
const BanSchema = require('../../models/BanSchema')
const vipSchema = require('../../models/vipSchema')
module.exports = {
  name: "work",
  aliases: ["w"],
  category: "Economy",
  cooldown: 5,
  description: {
    content: "Làm việc kiếm tiền",
    example: "work",
    usage: "work"
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: '',
  },
  /**
   * 
   * @param {import('discord.js').Client} client
   * @param {*} message 
   * @param {*} args 
   * @param {client.prefix('prefix')} prefix 
   * @param {client.la('lang')} lang 
   * @returns 
   */
  run: async (client, message, args, prefix, lang) => {
    const author = message.author
    let timeouts = 3000
    let lastused = await client.cd(message.author.id, `addngoc`)
    let used = client.checkcd(lastused, timeouts)
    let cooldown = used.after
    if (!cooldown) {
      const errorSpam =
        `${client.e.fail} | **${message.author.username}**, bạn từ từ thôi cho tôi thở phát... **${used.s}s** nữa hãy gõ tiếp!`
      const delay = await message.channel.send(errorSpam).catch(error => console.log(error))
      await client.sleep(2000)
      await delay.delete()
      return
    }
    else {
      await client.timeout(message.author.id, `addngoc`)
      let user = message.author;
      let timeout = 1800000
      let lastused = await client.cd(message.author.id, `work1`)
      let used = client.checkcd(lastused, timeout)
      let cooldown = used.after
      if (!cooldown) {
        let errorDaily =
          `${client.e.fail} | **${message.author.username}**, bạn quá mệt để đi làm... Hãy quay lại sau **${used.h + `:` + used.m + `:` + used.s}s** nữa !`
        const delay = await message.channel.send(errorDaily).catch((e) => console.log(e))
        await client.sleep(timeout - (Date.now() - lastused))
        await delay.delete()
        return
      }
      else {
        await client.timeout(message.author.id, `work1`)
        let vip = false
        let pro = false
        const provip = await vipSchema.findOne({ memberid: message.author.id })
        if (provip) {
          const date = await client.datepassport(message.author.id)
          const status = await client.checkpassport(date)
          let end = status.after
          if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true
          if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true
        }
        if (!pro && !vip) {
          await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, 1, 0)
          let lương = Math.floor(Math.random() * 9) * 100
          client.cong(user.id, parseInt(lương));
          const Works =
            `**${user.username}**, bạn đã đi làm và được trả **${parseInt(lương).toLocaleString('En-us')} Ycoin và x1 <:GEMBOX:982028743952441355> **
\`VOTE CHO BOT MỖI 12G ĐỂ NHẬN 3 GEMBOX!\``
          await message.channel.send(Works).catch(e => console.log(e))
        }
        else if (pro) {
          await client.addgem(user.id, `<:PRO_GEMBOX:982028744057298964>`, 1, 0)
          let lương = Math.floor(Math.random() * 99) * 100
          client.cong(user.id, parseInt(lương));
          const Works =
            `**${user.username}**, bạn đã đi làm và được trả **${parseInt(lương).toLocaleString('En-us')} Ycoin và x1 <:PRO_GEMBOX:982028744057298964> [PRO-PASSPORT]**
\`VOTE CHO BOT MỖI 12G ĐỂ NHẬN 3 GEMBOX!\``
          await message.channel.send(Works).catch(e => console.log(e))
        }
        else if (vip) {
          await client.addgem(user.id, `<:PRO_GEMBOX:982028744057298964>`, 1, 0)
          await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, 1, 0)
          let lương = Math.floor(Math.random() * 99) * 100
          client.cong(user.id, parseInt(lương));
          const Works =
            `**${user.username}**, bạn đã đi làm và được trả **${parseInt(lương).toLocaleString('En-us')} Ycoin, x1 <:GEMBOX:982028743952441355> và x1 <:PRO_GEMBOX:982028744057298964> [VIP-PASSPORT]**
\`VOTE CHO BOT MỖI 12G ĐỂ NHẬN 3 GEMBOX!\``
          await message.channel.send(Works).catch(e => console.log(e))
        }
      }
    }
  }
}