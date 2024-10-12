module.exports = {
  name: 'balance',
  category: 'Economy',
  cooldown: 5,
  aliases: ['bal', 'cash', 'coin', 'money'],
  description: {
    content: "Xem và kiểm tra số tiền của bạn đang có",
    example: "cash",
    usage: "cash"
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
    
    const balance = await client.cash(message.author.id);
    if(message.author.id === "869614723283435602") {
      await message.channel.send(`<:emoji_247:1276532401522085960> | **Qi cuti:** tui đang có đang có **${balance.toLocaleString('En-us')} Ycoin <a:yb_thodao:1253530446776500225>**`)
    }
    else {
       message.channel.send({
      content: lang.economy.balance_1
      .replace('{value1}', message.member.displayName)
      .replace('{value2}', balance.toLocaleString())
    });
    }
   
  },
}