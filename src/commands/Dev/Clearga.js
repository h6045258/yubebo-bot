const data = require('../../models/giveawaySchema');

module.exports = {
  name: 'clearga',
  aliases: [],
  description: 'Xóa dữ liệu giveaway đã kết thúc',
  category: "Dev",
  permissions: {
    dev: true
  },
  cooldown: 3,
  /**
   * 
   * @param {import('discord.js').Client} client
   * @param {*} message 
   * @param {*} args 
   * @returns 
   */
  run: async (client, message, args) => {
    const ctx = await message.channel.send({ content: `${client.e.load} | Đang xóa dữ liệu giveaway đã kết thúc...` });
    await data.deleteMany({ ended: true }).then(async () => {
      ctx.edit({
        content: `${client.e.done} | Đã xóa toàn bộ các giveaway đã kết thúc!`
      })
    })
  }
}