const number = require('../../configs/number.json');
const animals = require('../../configs/fishes.json');
const fishesSchema = require('../../models/fishesSchema')
const fishpointSchema = require('../../models/fishpointSchema')
module.exports = {
	name: "tank",
	category: "Animal",
	aliases: ["hoca"],
	cooldown: 0,
	description: ["Check xem bạn đã câu được những con cá thú vị nào!", "Check fishes you have caught!"],
	description: {
		content: "Check xem bạn đã câu được nững con cá thú vị nào",
		example: "tank",
		usage: "tank"
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

		let header = `<a:Yvayduoi:924665374589481040><a:Yhoa:945619719355002881> | **__${message.author.username}'s__**  𝗧𝗮𝗻𝗸 | <a:Yhoa:945619719355002881><a:Yvayduoi1:924665323578359888>\n`
		let text = initDisplay();
		var prolist = "\n" + animals.ranks.pro + "    ";
		var glorylist = "\n" + animals.ranks.glory + "    ";
		var devillist = "\n" + animals.ranks.devil + "    ";
		var viplist = "\n" + animals.ranks.vip + "    ";
		const animalarr = await fishesSchema.find({ id: message.author.id })
			.sort({ quanlity: -1 })
		if (!animalarr[0]) return message.reply(`${client.e.fail} | Bạn hong có cá!`)
		let max = animalarr[0].quanlity
		let digits = Math.trunc(Math.log10(max) + 1);
		if (max == 0) digits = 1
		for (let a in animalarr) {
			let name = animalarr[a].name
			let quanlity = animalarr[a].quanlity
			let numbe = toSmallNum(quanlity, digits)
			text = text.replace(`~${name}`, name + numbe + "  ")
			if ((animals.pro).includes(name)) {
				prolist += name + numbe + "  "
			}
			else if ((animals.glory).includes(name)) {
				glorylist += name + numbe + "  "
			}
			else if ((animals.devil).includes(name)) {
				devillist += name + numbe + "  "
			}
			else if ((animals.vip).includes(name)) {
				viplist += name + numbe + "  "
			}
			// else text = 
		}
		let text2 = text.replace(/~+<+:+[a-zA-Z_0-9~]+:+[a-zA-Z_0-9~]+>/g, `❓` + toSmallNum(0, digits) + "  ");
		if (prolist.length >= 35) text2 += prolist;
		if (glorylist.length >= 35) text2 += glorylist;
		if (devillist.length >= 35) text2 += devillist;
		if (viplist.length >= 35) text2 += viplist;
		let zp = await fishpointSchema.findOne({ zooid: message.author.id })
		let footer = "\nĐiểm câu của bạn : **__" + parseInt(zp.quanlity).toLocaleString("vi") + "__**\n"
		let zooText = text2
		let zoos = chiaMessage(zooText)
		for (let z in zoos) {
			if (zoos.length == 1) await message.channel.send(header + zoos[z] + footer)
			else if (z == 0) await message.channel.send(header + zoos[z])
			else if (z == zoos.length - 1) await message.channel.send(zoos[z] + footer)
			else await message.channel.send(zoos[z])
		}

	}
}
function initDisplay() {
	let display
	var gap = "  ";
	display = animals.ranks.common + "   ";
	for (i = 1; i < animals.common.length; i++)
		display += "~" + animals.common[i] + gap;

	display += "\n" + animals.ranks.uncommon + "   ";
	for (i = 1; i < animals.uncommon.length; i++)
		display += "~" + animals.uncommon[i] + gap;

	display += "\n" + animals.ranks.rare + "   ";
	for (i = 1; i < animals.rare.length; i++)
		display += "~" + animals.rare[i] + gap;

	display += "\n" + animals.ranks.superrare + "   ";
	for (i = 1; i < animals.superrare.length; i++)
		display += "~" + animals.superrare[i] + gap;

	display += "\n" + animals.ranks.epic + "   ";
	for (i = 1; i < animals.epic.length; i++)
		display += "~" + animals.epic[i] + gap;
	return display

}
function toSmallNum(count, digits) {
	var result = '';
	var num = count;
	if (count < 0 || !count) count = 0;
	for (i = 0; i < digits; i++) {
		var digit = count % 10;
		count = Math.trunc(count / 10);
		result = number.numbers[digit] + result;
	}
	return result;
}
function chiaMessage(text) {
	text = text.split("\n");
	let pages = [];
	let page = "";
	const max = 1600;
	for (let i in text) {
		if (page.length + text[i].length >= max) {
			pages.push(page + "\n" + text[i]);
			page = "";
		} else {
			page += "\n" + text[i];
		}
	}
	if (page != "") pages.push(page);
	return pages;
}