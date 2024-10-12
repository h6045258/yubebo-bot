module.exports = {
  name: "bank",
  category: "Economy",
  aliases: [''],
  cooldown: 5,
  description: {
    content: "Xem kiểm tra số tiền của bạn đang có trong ngân hàng",
    example: "bank",
    usage: "bank"
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
    if (message.author.id == `896739787392819240`) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author
      if (!args[0]) {
        const cash = await client.bank(message.author.id)
        message.author.send(`<a:Ykimcuonglaplanh:922597979146313830> **|** **${message.author.username}** , anh đang có **${cash.toLocaleString('En-us')} Ycoin** trong **Quỹ Đen**!`).catch((e) => console.log(e));
      } else {
        const cash = await client.bank(member.id)
        message.channel.send(`<a:Yu_cassh:942212732642537502> **|** **${member}** đang có **${cash.toLocaleString('En-us')} Ycoin** trong **ngân hàng**!`).catch((e) => console.log(e));
      }
    }
    else if (message.author.id == `893688556965466152`) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author
      if (!args[0]) {
        const cash = await client.bank(message.author.id)
        message.author.send(`<a:Ykimcuonglaplanh:922597979146313830> **|** **${message.author.username}** đang giấu **${cash.toLocaleString('En-us')} Ycoin** trong **Ngân Hàng**!`).catch((e) => console.log(e));
      } else {
        const cash = await client.bank(member.id)
        message.channel.send(`<a:Yu_cassh:942212732642537502> **|** **${member}** đang có **${cash.toLocaleString('En-us')} Ycoin** trong **ngân hàng**!`).catch((e) => console.log(e));
      }
    }
    else if (message.author.id == `696893548863422494`) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author
      if (!args[0]) {
        const cash = await client.bank(message.author.id)
        message.author.send(`<a:Ykimcuonglaplanh:922597979146313830> **|** **${message.author.username}** đang giấu **${cash.toLocaleString('En-us')} Ycoin** trong **Ngân Hàng**!`).catch((e) => console.log(e));
      } else {
        const cash = await client.bank(member.id)
        message.channel.send(`<a:Yu_cassh:942212732642537502> **|** **${member}** đang có **${cash.toLocaleString('En-us')} Ycoin** trong **ngân hàng**!`).catch((e) => console.log(e));
      }
    }
    else {
      const member = message.author;
      const cash = await client.bank(member.id);
      const bankMsg =
        `<a:Yu_cassh:942212732642537502> **|** **${message.author.username}** , bạn đang có **${cash.toLocaleString('En-us')} Ycoin** trong **YUBANK**!`
      await member.send(bankMsg);
      await message.react("💳")
        .catch(async (e) => {
          console.log(e)
          await message.channel.send("Đã xảy ra lỗi khi DMs cho người dùng !")
          }
        );
    }
  }
}