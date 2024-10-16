const banSchema = require('../../models/BanSchema')

module.exports = {
	name: "checkban",
	description: ["Kiểm tra người chơi có bị ban hay không!"],
	aliases: [],
	usage: ["{prefix}checkban"],
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
		const user = message.mentions.members.first() || args[0];
		const isThisuserBanned = await banSchema.findOne({ memberid: user.id });
		const reason = isThisuserBanned?.reason || "captcha"
		if (isThisuserBanned) return message.reply(`Người chơi này đã bị ban với lý do: ${reason}`)
		if (!isThisuserBanned) return message.reply("Người chơi này không bị ban!")
	},
};
