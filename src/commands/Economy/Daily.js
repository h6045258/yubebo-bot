const dailySchema = require("../../models/dailySchema")
const luckyicon = `<a:Yngoisaohivong:919968345418268714>`
const vipSchema = require("../../models/vipSchema")
const marrySchema = require('../../models/marrySchema')
module.exports = {
    name: "daily",
    category: "Economy",
    aliases: ["diemdanh"],
    cooldown: 5,
    description: {
        content: "Điểm danh nhận quà mỗi ngày",
        example: "daily",
        usage: "daily"
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: '',
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
		const { QuickDB } = require('quick.db');
		const db = new QuickDB({ table: "DB" });
		let user = message.author;
		let timeout = 3000;
		let lastused = await client.cd(message.author.id, `addngoc`);
		let used = client.checkcd(lastused, timeout);
		let cooldown = used.after;
		if (!cooldown) {
			const errorSpam = 
				`${client.e.fail} | **${message.author.username}**, bạn từ từ thôi cho tôi thở phát... **${used.s}s** nữa hãy gõ tiếp!`
			const delay = await message.channel.send(errorSpam).catch(error => console.log(error))
			await client.sleep(2000)
			await delay.delete()
			return;
		}
		else {
			await client.timeout(message.author.id, `addngoc`);
			const profile = await marrySchema.findOne({ authorid: message.author.id });
			let a = await client.cd(message.author.id, `daily8`);
			let day = await client.newday(a);
			let inday = day.withinDay;
			let h = day.hours;
			let min = day.minutes;
			let sec = day.seconds;
			let after = day.after;
			let vip = false;
			let pro = false;
			const provip = await vipSchema.findOne({ memberid: message.author.id });
			if (provip) {
				const date = await client.datepassport(message.author.id);
				const status = await client.checkpassport(date);
				let end = status.after
				if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true
				if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true
			}
			// Sự kiện được call khi đã daily trong ngày
			if (!after) {
				await client.timeout(message.author.id, `daily8`);
				let errorDaily = 
					`<:xxx:921536522451316766> | **${user.username}**, bạn đã nhận quà hôm nay rồi, quay lại sau **__${h + `:` + min + `:` + sec}s__** để nhận! \`[Mốc 00:00 Mỗi Ngày]\``
				const Errormessage = await message.channel.send(errorDaily).catch((e) => console.log(e))
				await client.sleep(5000);
				await Errormessage.delete().catch(error => console.log(error));
			}
			// Sự kiện được call khi đã qua ngày mới và daily liên tục (streaking)
			else if (after && inday) {
				await client.timeout(message.author.id, `daily8`);
				const data = await dailySchema.findOne({ id: user.id });
				// xây dựng data
				if (!data) {
					let newdata = new dailySchema({ id: user.id, name: user.name, streak: 1 });
					await newdata.save();
				}
				else {
					data.streak += 1;
					await data.save();
				}
				// gọi streak cơ bản
				let streaks = 1;
				if (data) streaks = data.streak;
				let dailymoney = (Math.floor(Math.random() * 1999) + 500) * streaks;
				if (profile) dailymoney *= 2;
				await client.cong(user.id, dailymoney);
				const msg = 
					`<a:Yngoisaohivong:919968345418268714> **| ${user.username}**, bạn nhận được **${parseInt(dailymoney).toLocaleString('En-us')} Ycoin!** Bạn đã điểm danh liên tục : **${streaks}** ngày!`
				// Nếu không dùng passport (biến được định nghĩa từ dòng 45-46)
				if (!pro && !vip) {
					let msg1 = []
					let soluong = 1
					if (profile) soluong += 1, msg1 = `, và 1 hộp thêm vì đã cưới <@${profile.husbandid}> `
					await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, soluong, 0)
					const messageToSend =
						`${msg}
${luckyicon} | **${user.username}**, bạn đã được tặng ${profile ? soluong - 1 : soluong} <:GEMBOX:982028743952441355>${profile ? msg1 : ` `} cho ngày hôm nay!`
					await message.channel.send(messageToSend).catch((e) => console.log(e))
				}
				// Nếu dùng passport (45-46)
				else if (pro) {
					let msg1 = []
					let soluong = 1
					if (profile) soluong += 1, msg1 = `, và 1 hộp thêm vì đã cưới <@${profile.husbandid}> `
					await client.addgem(user.id, `<:PRO_GEMBOX:982028744057298964>`, 2, 0)
					await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, soluong, 0)
					const messageToSend =
						`${msg}
<:ProPassport:988093838348410930> | **${user.username}**, bạn đã được tặng ${profile ? soluong - 1 : soluong} <:GEMBOX:982028743952441355>${profile ? msg1 : ` `} và được thêm 2 <:PRO_GEMBOX:982028744057298964> cho ngày hôm nay vì đã đăng ký PRO-PASSPORT !`
					await message.channel.send(messageToSend).catch((e) => console.log(e))
				}
				// Nếu dùng passport (45-46)
				else if (vip) {
					let msg1 = []
					let soluong = 1
					if (profile) soluong += 1, msg1 = `, và 1 hộp thêm vì đã cưới <@${profile.husbandid}> `
					await client.addgem(user.id, `<:PRO_GEMBOX:982028744057298964>`, 2, 0)
					await client.addgem(user.id, `<:VIP_GEMBOX:982028743889543278>`, 2, 0)
					await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, soluong, 0)
					const messageToSend = 
						`${msg}
<:VIPPassport:988093810955411456> | **${user.username}**, bạn đã được tặng ${profile ? soluong - 1 : soluong} <:GEMBOX:982028743952441355>${profile ? msg1 : ` `} và được thêm 2 <:PRO_GEMBOX:982028744057298964>, 2 <:VIP_GEMBOX:982028743889543278> cho ngày hôm nay vì đã đăng ký VIP-PASSPORT !`
					await message.channel.send(messageToSend).catch((e) => console.log(e))
				}
			}
			// Sự kiện được call khi đã qua ngày mới và họ không daily liên tục (bỏ lỡ ngày)
			else if (after && !inday) {
				await client.timeout(message.author.id, `daily8`)
				const data = await dailySchema.findOne({ id: user.id })
				if (!data) {
					let newdata = new dailySchema({ id: user.id, name: user.name, streak: 1 })
					await newdata.save();
				}
				else {
					data.streak = 1;
					await data.save()
				}
				let streaks = 1
				if (data) streaks = data.streak

				let dailymoney = (Math.floor(Math.random() * 99) + 1) * streaks;
				if (profile) dailymoney *= 2
				await client.cong(user.id, dailymoney);

				const msg = 
					`<a:Yngoisaohivong:919968345418268714> **| ${user.username}**, bạn nhận được **${parseInt(dailymoney).toLocaleString('En-us')} Ycoin!** Streak hiện tại : **${streaks}** ngày!`
				if (!pro && !vip) {
					let msg1 = []
					let soluong = 1
					if (profile) soluong += 1, msg1 = `, và 1 hộp thêm vì đã cưới <@${profile.husbandid}> `
					await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, soluong, 0)
					const messageToSend = 
						`${msg}
${luckyicon} | **${user.username}**, bạn đã được tặng ${profile ? soluong - 1 : soluong} <:GEMBOX:982028743952441355>${profile ? msg1 : ` `} cho ngày hôm nay!`
					await message.channel.send(messageToSend).catch((e) => console.log(e))
				}
				else if (pro) {
					let msg1 = []
					let soluong = 1
					if (profile) soluong += 1, msg1 = `, và 1 hộp thêm vì đã cưới <@${profile.husbandid}> `
					await client.addgem(user.id, `<:PRO_GEMBOX:982028744057298964>`, 2, 0)
					await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, soluong, 0)
					const messageToSend = 
						`${msg}
<:ProPassport:988093838348410930> | **${user.username}**, bạn đã được tặng ${profile ? soluong - 1 : soluong} <:GEMBOX:982028743952441355>${profile ? msg1 : ` `} và được thêm 2 <:PRO_GEMBOX:982028744057298964> cho ngày hôm nay vì đã đăng ký PRO-PASSPORT !`
					await message.channel.send(messageToSend).catch((e) => console.log(e))
				}
				else if (vip) {
					await client.addgem(user.id, `<:PRO_GEMBOX:982028744057298964>`, 2, 0)
					await client.addgem(user.id, `<:VIP_GEMBOX:982028743889543278>`, 2, 0)
					let msg1 = []
					let soluong = 1
					if (profile) soluong += 1, msg1 = `, và 1 hộp thêm vì đã cưới <@${profile.husbandid}> `
					await client.addgem(user.id, `<:GEMBOX:982028743952441355>`, soluong, 0)
					const messageToSend = 
						`${msg}
<:VIPPassport:988093810955411456> | **${user.username}**, bạn đã được tặng ${profile ? soluong - 1 : soluong} <:GEMBOX:982028743952441355>${profile ? msg1 : ` `} và được thêm 2 <:PRO_GEMBOX:982028744057298964>, 2 <:VIP_GEMBOX:982028743889543278> cho ngày hôm nay vì đã đăng ký VIP-PASSPORT !`
					await message.channel.send(messageToSend).catch((e) => console.log(e))
				}
			}
			client.usedSuccess.set(message.author.id, true);
		}
		const votingMSG = 
			`\`VOTE CHO BOT MỖI 12G ĐỂ NHẬN 3 GEMBOX!\``
		await message.channel.send(votingMSG).catch((e) => console.log(e))
	}
}

