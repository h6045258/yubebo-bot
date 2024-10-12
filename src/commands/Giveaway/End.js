const { PermissionsBitField } = require("discord.js")
module.exports = {
  name: 'end',
  aliases: ['endga', 'gaend'],
  category: 'Giveaway',
  cooldown: 5,
  description: {
      content: 'End một giveaways đang hoạt động!',
      example: 'end 231938102983093820',
      usage: 'end <id giveaways>'
  },
  permissions: {
      bot: ['ViewChannel', 'SendMessages'],
      user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    const query = args[0]
    const giveaway = await client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === query);

    // If no giveaway was found
    if (!giveaway) return message.reply(`**Không tìm thấy giveaways với ID \`${query}\`. Xin hãy kiểm tra lại`);
    //if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply('Tôi phải được bật quyền `Quản Lý Tin Nhắn` trong kênh này thì mới có thể quản lý g.a')
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply(`Bạn phải có quyền \`Quản Lý Tin Nhắn\` mới được kết thúc g.a`)
    let des = `Đi Tới Giveaways"`
    const messageId = query
    await client.giveawaysManager
      .end(messageId)
      .then(async (g) => {
        /** let guild = message.guild
         let channel = guild.channels.cache.find(c => {c.id== g.channelId})
         console.log(channel.id) */
        await g.message.channel.send({
          content: `Giveaways Ended!`, embeds: [
            new EmbedBuilder()
              .setDescription(`[${des}](${g.messageURL})`)
          ]
        })
      })
    await message.react("<:yb_success:1163479511636123668>")
      .catch((err) => {
        console.log(`Đã xảy ra lỗi, vui lòng thử lại.\n\`${err}\``)
      })
  }
};
