let animal = require("../../configs/animal.json")
const { BatThuThuong, Captcha } = require("../../handlers/Huntings.js");
const { handleRewardTrungThu } = require('../../handlers/rewardTrungThu.js');

module.exports = {
	name: "hunt",
	category: 'Animal',
	aliases: ["h", "catch"],
	cooldown: 15,
	description: {
		content: "Bắt thú và bán chúng để có một ít Ycoin",
		example: "hunt",
		usage: "hunt"
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
		const author = message.author.id
		let cash = await client.cash(author)
		let errorCash = `${client.e.fail} | **${message.author.username}**, bạn còn không có nổi 10 đồng Ycoin hunt thú??`
		if (cash < 10) return await message.channel.send(errorCash).catch(e => console.log(e))
		await client.tru(author, 10)
		let a = await BatThuThuong(client, message)
		let ar1 = a.hunted
		let buffmsg = a.buffmsg
		let thusanduoc = ar1.join(" ")
		let point = a.point
		let huntmsg = `**${message.author.username}**, ${buffmsg.length > 10 ? `\`Sức mạnh đá quý:\` ${buffmsg}` : buffmsg}\n🌱 | Bạn hunt được: ${thusanduoc}\n🐾 | \`Điểm zoo : +${point}\``
		await message.channel.send(huntmsg).catch(e => console.log(e))
		let count = {}
		ar1.forEach(thu => {
			if (count[thu]) {
				count[thu] += 1
				return
			}
			count[thu] = 1
		})
		for (let item in count) {
			let type = checkthu(animal.common, animal.uncommon, animal.rare, animal.superrare, animal.epic, animal.pro, animal.glory, animal.devil, animal.vip, item)
			await client.animal(author, item, count[item], type)
		}
		await client.addpoint(message.author.id, point);
		
		const rand = Math.floor(Math.random() * 100);
		if (rand <= 8) {
			const reward = await handleRewardTrungThu(client, message.author.id);
			await message.reply(`Bạn đã nhận được 1 ${reward.rewardName} ${reward.rewardEmoji}`);
		}

		await Captcha(client, message)
	}
}
function checkthu(c, u, r, sr, e, p, g, d, v, thu) {
	let result
	if (c.includes(thu)) result = `common`
	if (u.includes(thu)) result = `uncommon`
	if (r.includes(thu)) result = `rare`
	if (sr.includes(thu)) result = `superrare`
	if (e.includes(thu)) result = `epic`
	if (p.includes(thu)) result = `pro`
	if (g.includes(thu)) result = `glory`
	if (d.includes(thu)) result = `devil`
	if (v.includes(thu)) result = `vip`
	return result
}