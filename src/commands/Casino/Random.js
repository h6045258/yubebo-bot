const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: "random",
	category: "Casino",
	aliases: ["rd"],
	cooldown: 3,
	description: {
		content: "Random cùng bạn bè",
		example: "rd",
		usage: "rd"
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
		let max = parseInt(args[0])
		if (!max) return message.reply("**Vui lòng nhập số !**")
		let number = Math.ceil(Math.random() * max) - 1
		await message.reply(`### Số của **${message.author.username}** là **__${number}__**`)

		const guild = client.guilds.cache.find(g => g.id === "896744428100804688")
		const channel = guild.channels.cache.find(c => c.id === "942015852310577162")
		await channel.send({
			embeds:
				[
					new EmbedBuilder()
						.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
						.setDescription(`Tin nhắn random : \`${message.content}\`\n
Số random : **__${number}__**
CHANNEL : **__${message.channel.name}__**
Guild : **__${message.guild.name}__**
 `)
				]
		})


	}
}
