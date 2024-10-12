const fishpointSchema = require('../../models/fishpointSchema');
const zoopointSchema = require('../../models/zoopointSchema');
const moneySchema = require('../../models/moneySchema');
const bankSchema = require('../../models/bankSchema');
const marrySchema = require('../../models/marrySchema');
const praySchema = require('../../models/praySchema');

module.exports = {
	name: "leaderboard",
	category: "Economy",
	aliases: ['lb', 'top', 'rank'],
	cooldown: 5,
	description: {
		content: "Xem các bảng xếp hạng của Yubabe",
		example: "top cash (Xem bảng xếp hạng người có nhiều tiền nhất của Yubabe)",
		usage: "top <cash|love|zoo|together>"
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
		if (!args[0]) { args[0] = "c"; }
		let type = args[0];
		let guild = message.guild;
		let soluong = 10;
		if (parseInt(args[1])) soluong = parseInt(args[1]);
		if (soluong > 25) soluong = 25;

		const getUserData = async (schema, key, value) => {
			let find = await schema.find({
				[key]: { $gte: 1 }
			}).sort({ [key]: -1 }).limit(100);

			let msg = ``;
			let count = 0;

			for (let user of find) {
				if (count >= soluong) break;
				let member = guild.members.cache.get(user.id);
				if (!member) continue;

				msg += `[${count + 1}] ${member.user.username} - ${parseInt(user[value]).toLocaleString('en-US')}\n`;
				count++;
			}
			return msg || 'Không có dữ liệu.';
		};

		const getMarryData = async () => {
			let find = await marrySchema.find({
				together: { $gte: 1 }
			}).sort({ together: -1 }).limit(100);

			let msg = ``;
			let count = 0;
			let seenPairs = new Set();

			for (let couple of find) {
				if (count >= soluong) break;

				let author = guild.members.cache.get(couple.authorid);
				let wife = guild.members.cache.get(couple.wifeid);
				if (!author || !wife) continue;

				let pairKey = [couple.authorid, couple.wifeid].sort().join('-');
				if (seenPairs.has(pairKey)) continue;

				seenPairs.add(pairKey);

				msg += `[${count + 1}] ${author.user.username} ❤️ ${wife.user.username} - ${parseInt(couple.together).toLocaleString('en-US')} points\n`;
				count++;
			}
			return msg || 'Không có dữ liệu.';
		};

		let msg = '';
		if (type == 'money' || type == 'cash' || type == 'coin' || type == 'c' || type == 'bal') {
			msg = await getUserData(moneySchema, 'coins', 'coins');
			await message.channel.send(`\`TOP ${soluong} CASH YCOIN\`\n\`\`\`\n${msg}\n\`\`\``).catch(e => console.log(e));
		} else if (type == 'bank' || type == 'deposit' || type == 'b' || type == 'dep') {
			if (message.author.id !== "696893548863422494") return;
			msg = await getUserData(bankSchema, 'coins', 'coins');
			await message.channel.send(`\`TOP ${soluong} BANK YCOIN\`\n\`\`\`\n${msg}\n\`\`\``).catch(e => console.log(e));
		} else if (type == 'pray' || type == 'caunguyen' || type == 'pr' || type == 'dotnhang') {
			msg = await getUserData(praySchema, 'prays', 'prays');
			await message.channel.send(`\`TOP ${soluong} PRAY YUBABE\`\n\`\`\`\n${msg}\n\`\`\``).catch(e => console.log(e));
		} else if (type == 'zoo' || type == 'z') {
			msg = await getUserData(zoopointSchema, 'quanlity', 'quanlity');
			await message.channel.send(`\`TOP ${soluong} ĐIỂM ZOO\`\n\`\`\`\n${msg}\n\`\`\``).catch(e => console.log(e));
		} else if (type == 'tank' || type == 't') {
			msg = await getUserData(fishpointSchema, 'quanlity', 'quanlity');
			await message.channel.send(`\`TOP ${soluong} ĐIỂM TANK\`\n\`\`\`\n${msg}\n\`\`\``).catch(e => console.log(e));
		} else if (type == 'together' || type == 'thanmat') {
			msg = await getMarryData();
			await message.channel.send(`\`TOP ${soluong} TOGETHER POINTS\`\n\`\`\`\n${msg}\n\`\`\``).catch(e => console.log(e));
		}
	}
};
