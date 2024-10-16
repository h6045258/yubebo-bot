const vipSchema = require('../../models/vipSchema')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
  name: 'passport',
  aliases: ['pp', 'pre'],
  category: 'Passport',
  cooldown: 3,
  description: {
    content: 'Xem thời hạn còn lại của passport!',
    example: 'pp',
    usage: 'pp'
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    const pp = await vipSchema.findOne({
      memberid: message.author.id
    })
    let emo = ``
    if (!pp) {
      let messagess = client
        .embed()
        .setTitle(`PASSPORT YUBABE`)
        .setThumbnail(`https://cdn.discordapp.com/emojis/988093810955411456.png`)
        .setDescription(`**BẠN CHƯA CÓ PASSPORT!**
            
            Bạn có thể lấy nó bằng các tham gia máy chủ qua nút phía dưới!`)
        .setFooter({ text: `Cảm ơn bạn sử dụng Yubabe`, iconURL: message.author.displayAvatarURL() })
        .setColor(client.color.y)
      const marryRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('SUPPORT SERVER')
            .setURL('https://discord.gg/ZbAT9jt5Ak')
            .setStyle(ButtonStyle.Link)
            .setEmoji('1123672139988484176')
        )
      return message.reply({ embeds: [messagess], components: [marryRow] });
    }
    if (pp) emo = pp.type
    const date = await client.datepassport(message.author.id)
    const status = await client.checkpassport(date)
    let end = status.after
    let d = status.d
    let h = status.h
    let m = status.m
    let s = status.s
    if (end) {
      await vipSchema.deleteMany({ memberid: message.author.id })
      let messagess = `**${message.author.username}**, Passport của bạn đã hết hạn!`
      await message.reply(messagess).catch(e => console.log(e))
    } else if (!end) {
      let messagess = `${emo} | **${message.author.username}**, cảm ơn bạn đã ủng hộ YwY team và Yubabe! Passport của bạn vẫn còn \`${d + ` ngày ` + h + ` giờ ` + m + ` phút ` + s + ` giây `}\` nữa mới hết hạn!`
      await message.reply(messagess).catch(e => console.log(e))
    }
  }
}
