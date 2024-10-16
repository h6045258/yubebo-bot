const BanSchema = require('../../models/BanSchema')
module.exports = {
  name: "ruttien",
  category: "Economy",
  aliases: ["withdraw", "rt", "rut"],
  cooldown: 5,
  description: {
    content: "Rút tiền ra khỏi ngân hàng của bạn",
    example: "ruttien all",
    usage: "rt <amount>/all",
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

    let all = await client.bank(member.id);

    if (args[0] === "all") args[0] = all

    const errorAmount =
      `**Bạn muốn rút bao nhiêu?**`
    if (!args[0]) {
      return await message.channel.send(errorAmount).catch(e => console.log(e))
    }
    const errorAmountLessThanZero =
      `**Không thể nhập số âm!**`
    if (args[0] < 0) return await message.channel.send(errorAmountLessThanZero).catch(e => console.log(e))
    const errorBankLessThanZero =
      `**Ngân hàng của bạn đang âm, xin vui lòng nạp thêm tiền và thử lại !!**`
    if (all < 0) return await message.channel.send(errorBankLessThanZero).catch(e => console.log(e))

    const errorNumber =
      `**Số không hợp lệ!**`

    if (isNaN(args[0])) return await message.channel.send(errorNumber).catch(e => console.log(e))

    const errorBankNotEnough =
      `**Ngân hàng của bạn không đủ, xin vui lòng nạp thêm tiền và thử lại !!**`
    if (parseInt(args[0]) > all) return await message.channel.send(errorBankNotEnough).catch(e => console.log(e))

    const banking = parseInt(args[0])
    client.ruttien(member.id, banking);
    await client.cong(member.id, banking);
    const bankBal = await client.bank(member.id);
    const money = await client.cash(member.id)
    let Success =
      `<a:Yu_cassh:942212732642537502> | **${message.author.username}**, bạn rút tiền thành công : **${parseInt(args[0]).toLocaleString('En-us')}**, bạn đang có : **${parseInt(args[0]).toLocaleString('En-us')} Ycoin**`
    await member.send(Success).catch(async e => {
      console.log(e)
      await message.channel.send(Success)
    })

  }
}
