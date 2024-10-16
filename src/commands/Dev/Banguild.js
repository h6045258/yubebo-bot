const banSchema = require("../../models/banguild");

module.exports = {
  name: "banguild",
  description: ["Ban a guild from using the bot!"],
  usage: ["{prefix}banguild <guild_id>"],
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
   * @returns 
   */
  run: async (client, message, args) => {
    const { QuickDB } = require("quick.db");
    const db = new QuickDB({ table: "DB" });

    if (!args[0]) return message.reply(`${client.e.fail} | Vui lòng nhập ID guild.`);
    const guildId = args[0];

    let guild;
    try {
      guild = await client.guilds.fetch(guildId);
    } catch (error) {
      console.error(error);
      return message.reply(`${client.e.fail} | Không tìm thấy server này.`);
    }

    const banned = new banSchema({ admins: message.author.username, guildid: guild.id, guildname: guild.name });
    await banned.save();
    await db.set(`${guild.id}_softban1`, true);
    await message.channel.send(`${client.e.done} | Đã ban guild **${guild.name}**`);
  }
};
