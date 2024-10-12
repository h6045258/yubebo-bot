module.exports = {
	name: 'guess',
    aliases: ['gs'],
    category: 'Gambling',
    cooldown: 15,
    description: {
        content: 'Chơi đoán số của xúc xắc',
        example: 'Guess tối đa 250,000',
        usage: 'gs <số tiền> 1-6/1-6/1-6'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
	run: async (client, message, args, prefix, lang) => {
		let cash = await client.cash(message.author.id)
		let betMoney = args[0]
		if (cash < 0) return message.channel.send("Bạn đang âm tiền, nếu có bug hãy báo ngay cho admin bot thông qua lệnh \`Ygopy <noidung>\`")
		const errorMoney = 
			`${client.e.fail} | **__${message.author.username}__**, bạn không đủ tiền cược!`
		if (cash < parseInt(betMoney)) return message.channel.send(errorMoney)
		if (args[0] == "all") betMoney = cash
		const isNaNMoney = 
			`${client.e.fail} | **__${message.author.username}__**, số tiền bạn nhập không hợp lệ hoặc bạn không có tiền!`
		if (parseInt(betMoney) <= 0 || isNaN(parseInt(betMoney))) return message.channel.send(isNaNMoney);
		if (parseInt(betMoney) > 250000 && parseInt(betMoney) < cash) betMoney = 250000
		// await client.tru(message.author.id, parseInt(betMoney))
		if (parseInt(betMoney) > 250000) betMoney = 250000
		let ddd = "<a:DiceDice:1031872079500427324>"
		let numbers = [
			"<:Ytx_1:1031866523708555335>",
			"<:Ytx_2:1031866428812439562>",
			"<:Ytx_3:1031866398923816982>",
			"<:Ytx_4:1031866367089066044>",
			"<:Ytx_5:1031866336835534868>",
			"<:Ytx_6:1031866305663483944>",
		]
		let d1, d2, d3;
		d1 = numbers[Math.floor(Math.random() * numbers.length)]
		d2 = numbers[Math.floor(Math.random() * numbers.length)]
		d3 = numbers[Math.floor(Math.random() * numbers.length)]

		let g1 = parseInt(args[1])
		let g2 = parseInt(args[2])
		let g3 = parseInt(args[3])

		let dices = {
			1: "<:Ytx_1:1031866523708555335>",
			2: "<:Ytx_2:1031866428812439562>",
			3: "<:Ytx_3:1031866398923816982>",
			4: "<:Ytx_4:1031866367089066044>",
			5: "<:Ytx_5:1031866336835534868>",
			6: "<:Ytx_6:1031866305663483944>",
		}
		let gg1 = dices[g1]
		let gg2 = dices[g2]
		let gg3 = dices[g3]


		if (!gg1 || !gg2 || !gg3) return message.reply(`Cú pháp đúng là : \`Ygs <số tiền> 1 2 3\`
Đoán từ 1 đến 6 cho mỗi viên.
Đúng 2 viên hoà vốn, 3 viên x5`)
		if (gg1 === gg2 && gg2 === gg3) {
			return message.reply("Không nhận đặt ba viên giống nhau!");
		}

		await client.tru(message.author.id, betMoney)
		let all = [gg1, gg2, gg3]
		let allRes = [d1, d2, d3]
		let i = 0
		let allRes2 = []
		for (let x in all) {
			if (allRes.length < 1) break;
			let y = all[x]
			if (allRes.includes(y)) {
				i += 1
				for (let z in allRes) {
					if (allRes[z] == y) {
						let index = allRes.indexOf(allRes[z])
						allRes.splice(index, 1)
						break;
					}
					else continue;
				}
			}
		}
		let prize = 0
		let win = false
		if (i == 2) prize = 2
		else if (i == 3) prize = 5
		else if (i == 1) prize = 0

		if (i > 1) win = true
		await client.cong(message.author.id, betMoney * prize)

		let msg0 = `${message.author.tag} đã đặt ${betMoney.toLocaleString("en-us")} Ycoin
${gg1 + gg2 + gg3}
Kết quả là : ${d1 + d2 + d3}
Bạn đã thua ${prize < 0 ? (betMoney * prize).toLocaleString("en-us") : ""}...`
		if (win) msg0 = `${message.author.tag} đã đặt ${betMoney.toLocaleString("en-us")} Ycoin
${gg1 + gg2 + gg3}
Kết quả là : ${d1 + d2 + d3}
Bạn đã đoán đúng ${i} viên - Bạn lời được ${(betMoney * prize).toLocaleString("en-us")} Ycoin!!!`

		let mm1 = await message.channel.send(`${ddd + ddd + ddd}`)
		await client.sleep(1500)
		let mm2 = await mm1.edit(`${d1 + ddd + ddd}`)
		await client.sleep(1500)
		let mm3 = await mm2.edit(`${d1 + d2 + ddd}`)
		await client.sleep(1500)
		await mm3.edit(`${d1 + d2 + d3}`)
		await message.channel.send(msg0)
		client.usedSuccess.set(message.author.id, true);

	}
}
