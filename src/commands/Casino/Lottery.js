const { QuickDB } = require('quick.db');
const { EmbedBuilder } = require('discord.js');
const lotteryModel = require('../../models/lotterySchema');
const moment = require('moment-timezone');

const db = new QuickDB({ table: "lottery" });

const ticketPrice = 1e5;

module.exports = {
    name: "lottery",
    aliases: ["vietlot", "veso"],
    category: "Casino",
    cooldown: 3,
    description: {
        content: "xem/hoặc mua vé số (Giá vé 100,000 Ycoin/vé)",
        example: "lottery (để xem thông tin) | lottery 2 để mua 2 vé",
        usage: "lottery {amount}"
    },
    permissions: {
        bot: ['ViewChannels', 'SendMessages'],
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
        if (client.isInLottery.get("lottery")) return message.reply("Đang trong quá trình tính toán sổ xổ vui lòng quay lại sau.....").then(msg => setTimeout(() => msg.delete(), 10000));
        const userData = await lotteryModel.findOne({ userId: message.author.id }) || new lotteryModel({ userId: message.author.id });
        let totalBet = await db.get('totalBet') || 0;
        let totalTicket = await db.get('totalTicket') || 0;

        const now = moment().tz("Asia/Ho_Chi_Minh");
        const targetTime = moment().tz("Asia/Ho_Chi_Minh").set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
        if (now.isAfter(targetTime)) {
            targetTime.add(1, 'days');
        }

        const duration = moment.duration(targetTime.diff(now));

        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        const lotteryEmbed = new EmbedBuilder()
            .setColor("Gold")
            .setFooter({ text: "Giá mỗi vé là 100,000 Ycoin " })
            .setDescription(`Xổ số sẽ thông báo người trúng vào mỗi 6h chiều`);

        if (args.length >= 1) {
            const bet = parseFloat(args[0]);
            if (isNaN(bet)) return await message.reply("Nhập gì vậy con").then(msg => setTimeout(() => msg.delete(), 10000));

            if (bet > 10) return message.reply("Mỗi lần chỉ được mua 10 vé thôi em iu!");

            const price = bet * ticketPrice;

            if (price > await client.cash(message.author.id)) return await message.reply("Nghèo mà sĩ");

            totalTicket += bet;
            totalBet += bet * ticketPrice;
            await db.set('totalBet', totalBet);
            await db.set('totalTicket', totalTicket);
            userData.bet += bet;
            userData.rate = (userData.bet / totalTicket) * 100;

            lotteryEmbed
                .setAuthor({ name: `${message.author.displayName} Cược thêm`, iconURL: message.author.displayAvatarURL() });
            await client.tru(message.author.id, price);
        } else {
            userData.rate = (userData.bet / totalTicket) * 100;
            lotteryEmbed
                .setAuthor({ name: `Thông tin sổ xố`, iconURL: message.author.displayAvatarURL() });
        }
        await userData.save();

        lotteryEmbed
            .addFields([
                {
                    name: "Số vé bạn đã mua",
                    value: `\`\`\`css\n${userData.bet.toLocaleString()} Ticket\`\`\``,
                    inline: true
                },
                {
                    name: "Tỉ lệ trúng của bạn",
                    value: `\`\`\`css\n${userData.rate.toFixed(2)}%\`\`\``,
                    inline: true
                },
                {
                    name: "Tổng số vé hiện tại",
                    value: `\`\`\`css\n${totalTicket.toLocaleString()} Ticket\`\`\``,
                    inline: true
                },
                {
                    name: "Tổng tiền hiện tại",
                    value: `\`\`\`css\n${totalBet.toLocaleString()} Ycoin\`\`\``
                },
                {
                    name: "Thời gian xổ",
                    value: `\`\`\`css\n${hours} giờ ${minutes} phút ${seconds} giây\`\`\``,
                    inline: true
                }
            ]);

        await message.reply({ embeds: [lotteryEmbed] });
    }
};
