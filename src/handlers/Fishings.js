const { AttachmentBuilder } = require("discord.js")
const animal = require("../configs/fishes.json")
const buffSchema = require('../models/buffSchema')
const vipSchema = require('../models/vipSchema')
const number = require('../configs/nbxs.json');
let rate = 0
const { QuickDB } = require("quick.db")
const db = new QuickDB({table: "DB"})

const BatThuThuong = async (client, message) => {
	const provip = await vipSchema.findOne({ memberid: message.author.id })
	let pro = false
	let vip = false
	let limit = 1000
	if (provip) {
		const date = await client.datepassport(message.author.id)
		const status = await client.checkpassport(date)
		let end = status.after
		if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true, limit = 50
		if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true, limit = 75
		if (end) {
			await vipSchema.deleteOne({ memberid: message.author.id })
			await message.reply(`Passport của bạn đã hết hạn! Cảm ơn bạn đã đồng hành cùng tôi trong suốt tháng qua! <3`)
		}
	}
	let author = message.author.id
	const buffs = await buffSchema.find({
		memberid: author
	})
	let heso = 1
	let x2 = false
	let lucky = false
	let digit = 0
	let buffmsg = `<:Fishing:1034936032807890984>`
	for (let b in buffs) {
		let buf = buffs[b]
		let type = buf.type
		let quanlity = buf.quanlity
		if (quanlity > 0 && type == 5) {
			heso = buf.heso;
			x2 = true;
			lucky = true;
			digit = Math.trunc(Math.log10(heso) + 1);
			let so1 = await client.sonho(number, heso, digit)
			buffmsg += `**x**${so1} : \`${quanlity - 1}\``;
			await client.trubuff(message.author.id, 5, 1)
		};
		if (quanlity > 0 && type == 6) {
			heso = buf.heso;
			x2 = true;
			lucky = true;
			buffmsg += `<:buffx2:983135005872111626> : \`${quanlity - 1}\``
			await client.trubuff(message.author.id, 6, 1)
		};
		if (quanlity > 0 && type == 7) {
			heso = buf.heso;
			x2 = true;
			lucky = true;
			buffmsg += `<:bufflucky:983135001300307968> : \`${quanlity - 1}\``
			await client.trubuff(message.author.id, 7, 1)
		}
		if (quanlity > 0 && type == 8) {
			heso = buf.heso;
			x2 = true;
			lucky = true;
			digit = Math.trunc(Math.log10(heso) + 1);
			let so4 = await client.sonho(number, heso, digit)
			buffmsg += `**x**${so4} : \`${quanlity - 1}\` <:buffx2:983135005872111626> : \`${quanlity - 1}\` <:bufflucky:983135001300307968> : \`${quanlity - 1}\``
			await client.trubuff(message.author.id, 8, 1)
		};
	}
	const array = chonthu(animal, lucky, pro, vip, heso, x2)
	let point = array.point
	let hunted = array.arr
	return { hunted: hunted, point: point, buffmsg: buffmsg, limit: limit }
}

const Captcha = async (client, message) => {

	const provip = await vipSchema.findOne({ memberid: message.author.id })
	let pro = false
	let vip = false
	let limit = 100
	if (provip) {
		const date = await client.datepassport(message.author.id)
		const status = await client.checkpassport(date)
		let end = status.after
		if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true, limit = 50
		if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true, limit = 75
		if (end) {
			await vipSchema.deleteOne({ memberid: message.author.id })
			await message.reply(`Passport của bạn đã hết hạn! Cảm ơn bạn đã đồng hành cùng tôi trong suốt tháng qua! <3`)
		}
	}
	const a = Math.floor(Math.random() * 1999)
	const b = Math.floor(Math.random() * 1999)
	if (a + b < limit) {
		function randomColor() {
			const r = Math.floor(Math.random() * 256);
			const g = Math.floor(Math.random() * 256);
			const b = Math.floor(Math.random() * 256);
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		}
		const Canvas = require('canvas');
		const Char_array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		const Char_length = Char_array.length;
		const canvasW = 150; // rộng
		const canvasH = 50; // cao
		const canvas = Canvas.createCanvas(canvasW, canvasH);
		const context = canvas.getContext('2d');
		// Background
		context.beginPath();
		context.rect(0, 0, canvasW, canvasH);
		context.fillStyle = '#000000'; // background màu đen
		context.fill();
		context.closePath();
		// End background
		const captchaLength = 6; // Best, max: 7 (độ dài captcha)
		const stringNumber = 3; // số đường kẻ
		const dotCount = 30; // số chấm nhiễu
		const result = []; // array chứa kết quả captcha (dạng ['a', 'b', 'c' ])
		for (let i = 0; i < captchaLength; i++) {
			const sIndex = Math.floor(Math.random() * Char_length);
			const sDeg = (Math.random() * 30 * Math.PI) / 180;
			const cTxt = Char_array[sIndex];
			result[i] = cTxt.toLowerCase();
			const x = 10 + i * 20;
			const y = 20 + Math.random() * 8;
			context.font = 'bold 23px noto'; // Font family custom
			context.translate(x, y);
			context.rotate(sDeg);
			context.fillStyle = randomColor();
			context.fillText(cTxt, 0, 0);
			context.rotate(-sDeg);
			context.translate(-x, -y);
		}
		for (let i = 0; i < stringNumber; i++) {
			context.strokeStyle = randomColor();
			context.beginPath();
			context.moveTo(Math.random() * canvasW, Math.random() * canvasH);
			context.lineTo(Math.random() * canvasW, Math.random() * canvasH);
			context.stroke();
		}
		for (let i = 20; i < dotCount; i++) {
			context.strokeStyle = randomColor();
			context.beginPath();
			const x = Math.random() * canvasW;
			const y = Math.random() * canvasH;
			context.moveTo(x, y);
			context.lineTo(x + 1, y + 1);
			context.stroke();
		}
		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), 'profile-image.png'); const content = result.join('')
		let messagess = [
			`<@${message.author.id}>, bạn có 50 giây, hãy nhập CAPTCHA bên dưới!`,
			`<@${message.author.id}>, you have 50 seconds, please type the Captcha below!`
		]
		await message.channel.send({ content: messagess, files: [attachment] }).catch(e => console.log(e))
		await db.set(`${message.author.id}_oncaptcha2`, true)
		const filter = m => m.author.id === message.author.id && m.content.toLowerCase() == content
		const collector = message.channel.createMessageCollector({ filter, time: 50_000 });
		collector.on('collect', async m => {

			if (m.content.toLowerCase() == content) {
				let messagess = 
					`<@${message.author.id}>, bạn đã nhập đúng, bạn có thể sử dụng bot tiếp!`
				await message.channel.send(messagess).catch(e => console.log(e))
				await db.set(`${message.author.id}_oncaptcha2`, false)
			}
		});
		collector.on('end', async collected => {
			if (collected.size > 0) {
				let messagess = 
					`<@${message.author.id}>, cảm ơn bạn đã nhập Captcha!`
				await message.channel.send(messagess).catch(e => console.log(e))
			}
			else if (collected.size < 1) {
				const banned = new BanSchema({ memberid: message.author.id, guildid: message.guild.id, username: message.author.username, guildname: message.guild.name })
				banned.save()
				let messagess = 
					`**${message.author.username}**! Bạn đã bị BAN vì treo auto! Xin hãy liên lạc tại server support : https://discord.gg/ZbAT9jt5Ak
với screenshot để được xem xét gỡ ban!`
				await message.channel.send(messagess).catch(e => console.log(e))
				const yukii = client.users.cache.find(u => u.id == `696893548863422494`)
				await yukii.send(`:x: Người chơi ${message.author.username} đã bị ban!`)
			}
		});
	}
}

module.exports = { Captcha, BatThuThuong }
function chonthu(animals, lucky, pro, vip, heso, double) {

	let arr = []
	let point = 0
	let price = 0
	let number = []
	//dưới mỗi vòng lặp, thêm dòng number[i] = r3, nhớ thêm bên dưới r3 cho r3 thành văn bản nha = `${}`
	let hesothat = heso
	if (double) hesothat = heso * 2
	//4 logic khi hunt thú :

	if (lucky) {//logic khi chỉ dùng gem03
		for (let i = 0; i < hesothat; i++) {
			let rand = Math.random() + 0.00231298;
			if (rand < animals.common[0]) {
				arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
				point += animals.points["common"]
				price += animals.price["common"]
			}
			else if (rand < animals.uncommon[0]) {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
			else if (rand < animals.rare[0]) {
				arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
				point += animals.points["rare"]
				price += animals.price["rare"]
			}
			else if (rand < animals.superrare[0]) {
				arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
				point += animals.points["superrare"]
				price += animals.price["superrare"]
			}
			else if (rand < animals.epic[0]) {
				arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
				point += animals.points["epic"]
				price += animals.price["epic"]
			}
			else if (rand < animals.glory[0]) {
				arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
				point += animals.points["glory"]
				price += animals.price["glory"]
			}
			else if (rand < animals.devil[0]) {
				arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
				point += animals.points["devil"]
				price += animals.price["devil"]
			}
			else {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
		}
	}
	else if (pro) {
		for (let i = 0; i < hesothat; i++) {
			let rand = Math.random() + 0.00931298;
			if (rand < animals.common[0]) {
				arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
				point += animals.points["common"]
				price += animals.price["common"]
			}
			else if (rand < animals.uncommon[0]) {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
			else if (rand < animals.rare[0]) {
				arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
				point += animals.points["rare"]
				price += animals.price["rare"]
			}
			else if (rand < animals.superrare[0]) {
				arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
				point += animals.points["superrare"]
				price += animals.price["superrare"]
			}
			else if (rand < animals.epic[0]) {
				arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
				point += animals.points["epic"]
				price += animals.price["epic"]
			}
			else if (rand < animals.pro[0]) {
				arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
				point += animals.points["pro"]
				price += animals.price["pro"]
			}
			else {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
		}
	}
	else if (vip) {
		for (let i = 0; i < hesothat; i++) {
			let rand = Math.random() + 0.01931298;
			if (rand < animals.common[0]) {
				arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
				point += animals.points["common"]
				price += animals.price["common"]
			}
			else if (rand < animals.uncommon[0]) {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
			else if (rand < animals.rare[0]) {
				arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
				point += animals.points["rare"]
				price += animals.price["rare"]
			}
			else if (rand < animals.superrare[0]) {
				arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
				point += animals.points["superrare"]
				price += animals.price["superrare"]
			}
			else if (rand < animals.epic[0]) {
				arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
				point += animals.points["epic"]
				price += animals.price["epic"]
			}
			else if (rand < animals.pro[0]) {
				arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
				point += animals.points["pro"]
				price += animals.price["pro"]
			}
			else if (rand < animals.glory[0]) {
				arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
				point += animals.points["glory"]
				price += animals.price["glory"]
			}
			else if (rand < animals.devil[0]) {
				arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
				point += animals.points["devil"]
				price += animals.price["devil"]
			}
			else if (rand < animals.vip[0]) {
				arr.push(animals.vip[Math.ceil(Math.random() * (animals.vip.length - 1))])
				point += animals.points["vip"]
				price += animals.price["vip"]
			}
			else {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
		}
	}
	else if (pro && lucky) {//logic khi dùng gem03 và propassport
		for (let i = 0; i < hesothat; i++) {
			let rand = Math.random() + 0.01231298;
			if (rand < animals.common[0]) {
				arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
				point += animals.points["common"]
				price += animals.price["common"]
			}
			else if (rand < animals.uncommon[0]) {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
			else if (rand < animals.rare[0]) {
				arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
				point += animals.points["rare"]
				price += animals.price["rare"]
			}
			else if (rand < animals.superrare[0]) {
				arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
				point += animals.points["superrare"]
				price += animals.price["superrare"]
			}
			else if (rand < animals.epic[0]) {
				arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
				point += animals.points["epic"]
				price += animals.price["epic"]
			}
			else if (rand < animals.pro[0]) {
				arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
				point += animals.points["pro"]
				price += animals.price["pro"]
			}
			else if (rand < animals.glory[0]) {
				arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
				point += animals.points["glory"]
				price += animals.price["glory"]
			}
			else if (rand < animals.devil[0]) {
				arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
				point += animals.points["devil"]
				price += animals.price["devil"]
			}
			else if (rand < animals.vip[0]) {
				arr.push(animals.vip[Math.ceil(Math.random() * (animals.vip.length - 1))])
				point += animals.points["vip"]
				price += animals.price["vip"]
			}
			else {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
		}
	}
	else if (vip && lucky) {
		for (let i = 0; i < hesothat; i++) {
			let rand = Math.random() + 0.02231298;
			if (rand < animals.common[0]) {
				arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
				point += animals.points["common"]
				price += animals.price["common"]
			}
			else if (rand < animals.uncommon[0]) {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
			else if (rand < animals.rare[0]) {
				arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
				point += animals.points["rare"]
				price += animals.price["rare"]
			}
			else if (rand < animals.superrare[0]) {
				arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
				point += animals.points["superrare"]
				price += animals.price["superrare"]
			}
			else if (rand < animals.epic[0]) {
				arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
				point += animals.points["epic"]
				price += animals.price["epic"]
			}
			else if (rand < animals.pro[0]) {
				arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
				point += animals.points["pro"]
				price += animals.price["pro"]
			}
			else if (rand < animals.glory[0]) {
				arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
				point += animals.points["glory"]
				price += animals.price["glory"]
			}
			else if (rand < animals.devil[0]) {
				arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
				point += animals.points["devil"]
				price += animals.price["devil"]
			}
			else if (rand < animals.vip[0]) {
				arr.push(animals.vip[Math.ceil(Math.random() * (animals.vip.length - 1))])
				point += animals.points["vip"]
				price += animals.price["vip"]
			}
			else {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
		}
	}
	else {//logic khi ko dùng gì cả
		for (let i = 0; i < hesothat; i++) {
			let rand = Math.random();
			if (rand < animals.common[0]) {
				arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
				point += animals.points["common"]
				price += animals.price["common"]
			}
			else if (rand < animals.uncommon[0]) {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
			else if (rand < animals.rare[0]) {
				arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
				point += animals.points["rare"]
				price += animals.price["rare"]
			}
			else if (rand < animals.superrare[0]) {
				arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
				point += animals.points["superrare"]
				price += animals.price["superrare"]
			}
			else if (rand < animals.epic[0]) {
				arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
				point += animals.points["epic"]
				price += animals.price["epic"]
			}
			else if (rand < animals.glory[0]) {
				arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
				point += animals.points["glory"]
				price += animals.price["glory"]
			}
			else if (rand < animals.devil[0]) {
				arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
				point += animals.points["devil"]
				price += animals.price["devil"]
			}
			else {
				arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
				point += animals.points["uncommon"]
				price += animals.price["uncommon"]
			}
		}
	}

	//CHAY CODE
	return { arr: arr, point: point, price: price }
}
function checkthu(c, u, r, sr, e, p, g, d, v, thu) {

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
