
const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const BanSchema = require('../../models/BanSchema')
module.exports = {
  name: "tietkiem",
  category: "Economy",
  aliases: ["deposit", "tk"],
  cooldown: 5,
  description: {
    content: "Gửi tiền vào ngân hàng",
    example: "tietkiem all",
    usage: "tk <amount>/all",
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
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
      let member = message.author;
      let all = await client.cash(member.id);
      let bank = await client.bank(member.id)
      if (args[0] === "all") args[0] = all


      const errorAmount = 
        `**Bạn muốn gửi tiết kiệm bao nhiêu?**`
      if (!args[0]) {
        return await message.channel.send(errorAmount).catch(e => console.log(e))
      }

      const errorAmountLessThanZero = [
        `**Không thể nhập số âm!**`,
        `**The amount must be greater than Zero?**`
      ]
      if (args[0] < 0) return await message.channel.send(errorAmountLessThanZero).catch(e => console.log(e))
      const errorBankLessThanZero = 
        `**Tiền của bạn đang âm,xin hãy liên lạc support Server để được hỗ trợ !!**`
      if (all < 0) return await message.channel.send(errorBankLessThanZero).catch(e => console.log(e))

      const errorNumber = 
        `**Số không hợp lệ!**`

      if (isNaN(args[0])) return await message.channel.send(errorNumber).catch(e => console.log(e))

      const errorBankNotEnough = 
        `**Bạn không đủ tiền để tiết kiệm, xin vui lòng kiếm thêm tiền và thử lại !!**`
      if (parseInt(args[0]) > all) return await message.channel.send(errorBankNotEnough).catch(e => console.log(e))
      const banking = parseInt(args[0])
      client.tietkiem(member.id, banking);
      await client.tru(member.id, banking);
      const bankBal = await client.bank(member.id);
      const Success = 
        `<a:Yu_cassh:942212732642537502> **|** **${message.author.username}**, bạn đã gửi tiết kiệm thành công : **${parseInt(args[0]).toLocaleString('En-us')}**`
      await member.send(Success).catch(async e => {
        console.log(e)
        await message.channel.send(Success)
      })
    
  }
}
