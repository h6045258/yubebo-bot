const marrySchema = require('../../models/marrySchema');
module.exports = {
  name: 'promise',
  aliases: ['loihua', 'loithe'],
  category: 'Marry',
  cooldown: 10,
  description: {
      content: 'Thay đổi lời hứa trên profile marry !',
      example: 'loihua yêu nhau cho lắm cắn nhau cho đau',
      usage: 'loihua <content>'
  },
  permissions: {
      bot: ['ViewChannel', 'SendMessages'],
      user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    const husband = message.author
    const data = await marrySchema.findOne({ authorid: husband.id })
    const errorNOmarry = 
      `Chưa cưới mà đã thề non hẹn biển...`
    if (!data) return await message.channel.send(errorNOmarry)
    const vkid = data.wifeid
    const loihua = data.loihua
    data.loihua = args.join(' ')
    await data.save()
    let loihuamoi = args.join(' ')
    const errorNOmarry2 = 
      `<:Yquyxu:941244934797799434> | **${husband.username}** đã chuyển lời hứa *${loihua}* thành **${loihuamoi}**`
    return await message.channel.send(errorNOmarry2)
  }
}
