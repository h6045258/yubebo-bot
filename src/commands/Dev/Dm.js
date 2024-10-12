module.exports = {
  name: "dm",
  description: ["DMs user"],
  aliases: ["modreply"],
  usage: ["{prefix}dm <id> <message>"],
  cooldown: 3,
  category: "Dev",
  permissions: {
    dev: true
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
    let reason = args.slice(1).join(' ')
    if (!reason) return message.channel.send(`Không thể gửi nội dung trống`)
    const mentionedUser = message.mentions.members.first() || client.users.cache.find(u => u.id == args[0])
    await mentionedUser
      .send(reason)
      .catch(e => console.log(e))
    return message.react(client.e.done)
  },
};