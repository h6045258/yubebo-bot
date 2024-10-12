
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
module.exports = {
	name: 'slot',
    aliases: ['sl'],
    category: 'Gambling',
    cooldown: 15,
    description: {
        content: 'Xổ số slot, xem ai là người mai mắn nào',
        example: 'slot tối đa 250,000',
        usage: 'slot <số tiền>'
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
			`${client.e.fail} | **__${message.author.username}__**, số tiền bạn nhập không hợp lệ!`
		if (parseInt(betMoney) <= 0 || isNaN(parseInt(betMoney))) return message.channel.send(isNaNMoney);
		if (parseInt(betMoney) > 250000 && parseInt(betMoney) < cash) betMoney = 250000
		// await client.tru(message.author.id, parseInt(betMoney))
		if (parseInt(betMoney) > 250000) betMoney = 250000
		let spinning = `<a:Yu_slotspin:1037009521496825938>`
		let spinning1 = `<a:Yngoisaohivong:919968345418268714>`
		let spin1 = `.   ╔══════════╗
    ║ ${spinning}  ║ ${spinning}  ║ ${spinning} ║
    ╠══════════╣
    ║ ${spinning}  ║ ${spinning}  ║ ${spinning} ║
    ╠══════════╣
    ║ ${spinning}  ║ ${spinning}  ║ ${spinning} ║
    ╚══════════╝`
		let arrayFruit = [
			"<:Yu_tao:940876514851950642>",
			"<:Yucherry:937106225076772885>",
			"<:Yunho:937106224732856381>",
			"<:Yuthom:937106225135501322>",
			"<:Yubo:937106225080983602>",
		]
		let chosenFruits = []
		for (let i = 0; i < 9; i++) {
			chosenFruits[i] = arrayFruit[Math.floor(Math.random() * arrayFruit.length)]
		}
		let spin2 = `.   ╔══════════╗
    ║ ${chosenFruits[0]}  ║ ${spinning}  ║ ${spinning} ║
    ╠══════════╣
    ║ ${chosenFruits[3]}  ║ ${spinning}  ║ ${spinning} ║ 
    ╠══════════╣
    ║ ${chosenFruits[6]}  ║ ${spinning}  ║ ${spinning} ║
    ╚══════════╝`
		let spin3 = `.   ╔══════════╗
    ║ ${chosenFruits[0]}  ║ ${chosenFruits[1]}  ║ ${spinning} ║
    ╠══════════╣
    ║ ${chosenFruits[3]}  ║ ${chosenFruits[4]}  ║ ${spinning} ║  
    ╠══════════╣
    ║ ${chosenFruits[6]}  ║ ${chosenFruits[7]}  ║ ${spinning} ║
    ╚══════════╝`
		let finalSpin = `.   ╔══════════╗
    ║ ${chosenFruits[0]}  ║ ${chosenFruits[1]}  ║ ${chosenFruits[2]} ║
    ╠══════════╣
    ║ ${chosenFruits[3]}  ║ ${chosenFruits[4]}  ║ ${chosenFruits[5]} ║  
    ╠══════════╣
    ║ ${chosenFruits[6]}  ║ ${chosenFruits[7]}  ║ ${chosenFruits[8]} ║
    ╚══════════╝`
		let winTimes = 0
		let winMoney
		let winMessage
		if (chosenFruits[0] == chosenFruits[1]
			&& chosenFruits[0] == chosenFruits[2]) winTimes += 1;
		if (chosenFruits[3] == chosenFruits[4]
			&& chosenFruits[3] == chosenFruits[5]) winTimes += 1;
		if (chosenFruits[6] == chosenFruits[7]
			&& chosenFruits[6] == chosenFruits[8]) winTimes += 1;
		if (chosenFruits[0] == chosenFruits[3]
			&& chosenFruits[0] == chosenFruits[6]) winTimes += 1;
		if (chosenFruits[1] == chosenFruits[4]
			&& chosenFruits[1] == chosenFruits[7]) winTimes += 1;
		if (chosenFruits[2] == chosenFruits[5]
			&& chosenFruits[2] == chosenFruits[8]) winTimes += 1;
		if (winTimes == 1) winMoney = parseInt(betMoney) * 2, winMessage = 
			`Bạn đã thắng gấp đôi : **__${(parseInt(betMoney) * 2).toLocaleString("en-us")}__** ${arrayFruit[1]}`
		else if (winTimes == 2) winMoney = parseInt(betMoney) * 5, winMessage = 
			`Bạn đã thắng gấp năm: **__${(parseInt(betMoney) * 5).toLocaleString("en-us")}__** ${arrayFruit[1]}`
		else if (winTimes == 3) winMoney = parseInt(betMoney) * 15, winMessage = 
			`Bạn đã thắng Jackpot gấp 15 lần : **__${(parseInt(betMoney) * 15).toLocaleString("en-us")}__** ${arrayFruit[1]}`
		else if (winTimes == 4) winMoney = parseInt(betMoney) * 30, winMessage = 
			`Bạn đã thắng Jackpot gấp 30 lần : **__${(parseInt(betMoney) * 30).toLocaleString("en-us")}__** ${arrayFruit[1]}`
		else if (winTimes == 5) winMoney = parseInt(betMoney) * 60, winMessage = 
			`Bạn đã thắng Jackpot gấp 60 lần : **__${(parseInt(betMoney) * 60).toLocaleString("en-us")}__** ${arrayFruit[1]}`
		else if (winTimes == 6) winMoney = parseInt(betMoney) * 120, winMessage = 
			`Bạn đã thắng Jackpot gấp 120 lần : **__${(parseInt(betMoney) * 120).toLocaleString("en-us")}__** ${arrayFruit[1]}`
		else winMoney = 0, winMessage = `Bạn đã thua **__${parseInt(betMoney).toLocaleString("en-us")} Ycoin__**!`
		await client.cong(message.author.id, winMoney - parseInt(betMoney))
		let betting1 = `**__${message.author.username}__** đã cược **__${parseInt(betMoney).toLocaleString("En-Us")} Ycoin__** để chơi slot!
${spin1}`
		let betting2 = `**__${message.author.username}__** đã cược **__${parseInt(betMoney).toLocaleString("En-Us")} Ycoin__** để chơi slot!
${spin2}`
		let betting3 = `**__${message.author.username}__** đã cược **__${parseInt(betMoney).toLocaleString("En-Us")} Ycoin__** để chơi slot!
${spin3}`
		let Final = `**__${message.author.username}__** đã cược **__${parseInt(betMoney).toLocaleString("En-Us")} Ycoin__** để chơi slot!
${winTimes > 0 ? "Xin chúc mừng! " : "Rất tiếc! "}${winMessage}
${finalSpin}`

		client.usedSuccess.set(message.author.id, true);
		
		let s1 = await message.channel.send(betting1)
		await client.sleep(2000)
		let s2 = await s1.edit(betting2)
		await client.sleep(2000)
		let s3 = await s2.edit(betting3)
		await client.sleep(2000)
		await s3.edit(Final)
	}
}
