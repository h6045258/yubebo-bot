const { PermissionsBitField } = require("discord.js")
module.exports = {
  name: 'reroll',
  aliases: ['gareroll', 'rr', 'rerollga'],
  category: 'Giveaway',
  cooldown: 5,
  description: {
      content: 'Đổi người thắng sau khi đã end giveaways!',
      example: 'rr 231938102983093820',
      usage: 'rr <id giveaways>'
  },
  permissions: {
      bot: ['ViewChannel', 'SendMessages'],
      user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply('Bạn phải có quyền `Quản Lý Tin Nhắn` mới được reroll g.a')
    const query = args[0]
    const giveaway = await client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === query);
    // If no giveaway was found
    if (!giveaway) return message.reply(`**Không tìm thấy giveaways với ID \`${query}\`. Xin hãy kiểm tra lại**`);
    const messageId = query
    await client.giveawaysManager.reroll(messageId, {
      messages: {
        congrat: '<a:Ybia:936408211492323348> Người trúng giveaway mới: {winners}! Xin chúc mừng, bạn đã thắng Giveaways **{this.prize}**!\n{this.messageURL}',
        error: `${client.e.fail} | Chỉ có một người tham gia, không thể reroll !`
      }
    })
      .then(() => {
        message.reply('Done!');
      })
      .catch((err) => {
        message.reply(`Đã xảy ra lỗi, vui lòng thử lại!`);
      });
  }
};
