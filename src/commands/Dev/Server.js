const { EmbedBuilder,PermissionsBitField } = require("discord.js")
module.exports = {
  name: 'server',
  description: ["Check servers!"],
  aliases: ["sv"],
  usage: ["{prefix}sv"],
  cooldown: 0,
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
    
    const promises = [
			client.cluster.fetchClientValues('guilds.cache.size'),
			client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		];

		return Promise.all(promises)
			.then(results => {
				const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      const svembed = new EmbedBuilder()
      .setTitle(`TỔNG SỐ SERVER CÓ YUBABE`)
      .setColor(`#FF0099`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Server: **__${totalGuilds}__**

Member: **__${totalMembers}__**`)
      .setTimestamp()
    return message.channel.send({embeds: [svembed]})
			})
			.catch(console.error);
   }
};