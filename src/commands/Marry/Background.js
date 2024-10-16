const marrySchema = require('../../models/marrySchema');
const anhcuoi = require(`../../models/anhcuoi`);
module.exports = {
  name: 'background',
  aliases: ['bg', 'anhcuoi'],
  category: 'Marry',
  cooldown: 300,
  description: {
    content: 'Đổi ảnh cưới của bạn và người ấy!',
    example: 'anhcuoi https://',
    usage: 'anhcuoi <link ảnh>'
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    let link = args[0]
    if (link.startsWith(`https://`)) {
      const husband = message.author
      const data = await marrySchema.findOne({ authorid: husband.id })
      if (!data) return message.channel.send(`${client.e.fail} | Chưa cưới mà đã đòi chụp hình cưới...`)
      await anhcuoi.deleteOne({ authorid: message.author.id })
      await anhcuoi.deleteOne({ authorid: data.wifeid })
      const hinhcuoi3 = new anhcuoi({ authorid: husband.id, wifeid: data.wifeid, anhcuoi: args[0] })
      const hinhcuoi4 = new anhcuoi({ authorid: data.wifeid, wifeid: husband.id, anhcuoi: args[0] })
      await hinhcuoi4.save()
      await hinhcuoi3.save()
      await message.channel.send(`${client.e.fail} | **${husband.username}** đã thay đổi ảnh cưới: ${args[0]}`)
    }
    else return message.channel.send(`${client.e.fail} | Xin hãy nhập link có định dạng: https://`)
  }
}
