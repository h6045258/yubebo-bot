module.exports = {
  name: "say",
  aliases: ['thongbao'],
  description: "Lệnh SAY",
  usage: "Thông Báo Bằng Bot ",
  category: "Dev",
  permissions: {
    dev: true,
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
  async run(client, message, args, prefix, lang) {
    let msg;
    let textChannel = message.mentions.channels.first()
    message.delete()
    if (textChannel) {
      msg = args.slice(1).join(" ");
      textChannel.send(msg)
    } else {
      msg = args.join(" ");
      message.channel.send(msg)
    }
  }
}