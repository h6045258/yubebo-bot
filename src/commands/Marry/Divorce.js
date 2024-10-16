const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const marrySchema = require('../../models/marrySchema')
module.exports = {
  name: 'divorce',
  aliases: ['chiatay', 'lyhon'],
  category: 'Marry',
  cooldown: 60,
  description: {
    content: 'Tôi hy vọng bạn sẽ không cần xài đến lệnh này!',
    example: 'lyhon',
    usage: 'lyhon'
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages']
  },
  run: async (client, message, args, prefix, lang) => {
    const husband = message.author
    const data = await marrySchema.findOne({ authorid: husband.id })
    const wifeid = data.wifeid
    const lovedata = await marrySchema.findOne({ id: wifeid })
    if (!data && !lovedata) return message.channel.send(`${client.e.fail} | Chưa cưới mà đã đòi chia tay...`)
    else {
      let dacodoi = data.wifeid || data.husbandid
      let nhan = data.nhan || lovedata.nhan || 0
      const lyhon = new EmbedBuilder()
        .setTitle(`❤️ Ôi trời có thật là muốn ly hôn không? ❤️`)
        .setDescription(`<@!${husband.id}> <a:yl_timnhay:903011590876569630>  <@!${dacodoi}>
Bạn và người ấy đã cưới bằng nhẫn ${nhan}`)
        .setFooter({ text: `Hãy quyết định thật kỹ nhé!` })
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('break')
            .setEmoji(client.e.done)
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('thinkaboutit')
            .setEmoji(client.e.fail)
            .setStyle(ButtonStyle.Danger)
        )
      const lyhonmessage = await message.channel.send({ embeds: [lyhon], components: [row] });
      const filter = async i => {
        if (i.user.id === message.author.id || !([data.wifeid, data.husbandid].includes(i.user.id))) {
          await i.reply({ content: `${client.e.fail} | Nút này dành cho nửa kia của người này!`, ephemeral: true })
          return false;
        }
        return true;
      }
      const collector = await lyhonmessage.createMessageComponentCollector({ filter, time: 30000 });
      collector.on('collect', async (i) => {
        if (i.customId === 'break') {
          await marrySchema.deleteOne({ authorid: wifeid })
          await marrySchema.deleteOne({ authorid: message.author.id })
          return message.channel.send(`<a:Yu_traitimvo:949079502959566978> *Đường ai nấy đi, không còn vương vấn* <a:Yu_traitimvo:949079502959566978>`)
        }
        else if (i.customId === 'thinkaboutit') return message.channel.send(`💟 Vẫn còn cứu vãn... hãy thử hỏi han vài câu... 💟`)
      })
    }
  }
}
