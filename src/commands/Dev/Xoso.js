const { QuickDB } = require('quick.db');
const lotteryModel = require('../../models/lotterySchema');
const { Collection, EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');

const db = new QuickDB({ table: "lottery" });
const TAX_RATE = 0.1;
const GUILD_ID = "1157597853431103559";
const LOG_CHANNEL_ID = "1277990228761776149";
module.exports = {
    name: 'xoso',
    aliases: [],
    description: 'Xổ ngay tức thì',
    category: 'Dev',
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
        const runLottery = async () => {
            const logChannel = client.guilds.cache.get(GUILD_ID)?.channels.cache.get(LOG_CHANNEL_ID);
            if (!logChannel) {
                console.error("Log channel not found");
                return;
            }

            const lotteryDate = moment().tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD');
            const hasRun = await db.get(`lotteryRun_${lotteryDate}`);
            if (hasRun) {
                console.log(`Lottery for ${lotteryDate} has already run.`);
                return;
            }

            await db.set(`lotteryRun_${lotteryDate}`, true);

            client.isInLottery.set("lottery", true);

            try {
                const [userLottery, totalTicket, totalBet] = await Promise.all([
                    lotteryModel.find().lean(),
                    db.get("totalTicket"),
                    db.get("totalBet")
                ]);

                if (userLottery.length === 0) {
                    console.log("No participants in the lottery");
                    return;
                }

                const updatedUserLottery = userLottery.map(user => ({
                    ...user,
                    rate: (user.bet / totalTicket) * 100
                })).sort((a, b) => b.rate - a.rate);

                const winner = selectWinner(updatedUserLottery);

                const betAfterTax = totalBet * (1 - TAX_RATE);
                await processResults(client, winner, updatedUserLottery, betAfterTax, totalBet);

                await logResults(logChannel, client, winner, totalBet, betAfterTax);

                await Promise.all([
                    lotteryModel.deleteMany(),
                    db.set("totalBet", 0),
                    db.set("totalTicket", 0)
                ]);
            } catch (error) {
                console.error("Error in lottery process:", error);
                await db.delete(`lotteryRun_${lotteryDate}`);
            } finally {
                client.isInLottery.delete("lottery");
            }
        };

        const selectWinner = (users) => {
            const maxRate = users[0].rate;
            const minRate = users[users.length - 1].rate;
            if (maxRate === minRate) {
                return users[Math.floor(Math.random() * users.length)];
            }
            const randomRate = Math.random() * (maxRate - minRate) + minRate;
            return users.reduce((closest, user) =>
                Math.abs(user.rate - randomRate) < Math.abs(closest.rate - randomRate) ? user : closest
            );
        };

        const processResults = async (client, winner, allUsers, betAfterTax, totalBet) => {
            const winnerUser = await client.users.fetch(winner.userId);
            await winnerUser.send(`Chúc mừng bạn đã trúng số! Tỉ lệ của bạn là **${winner.rate.toFixed(2)}%**\nSố tiền **${betAfterTax.toLocaleString()} Ycoin** đã vào tay bạn <3~\nLưu ý: Thuế khi trúng số là ${TAX_RATE * 100}%`);
            await client.cong(winner.userId, betAfterTax);

            const loseUsers = allUsers.filter(user => user.userId !== winner.userId);
            sendLoseMessages(client, loseUsers, totalBet).catch(console.error);
        };

        const sendLoseMessages = async (client, loseUsers, totalBet) => {
            for (const user of loseUsers) {
                try {
                    const loseUser = await client.users.fetch(user.userId);
                    await loseUser.send(`Rất tiếc, bạn không trúng! Tỉ lệ của bạn là **${user.rate.toFixed(2)}%**\nSố tiền **${totalBet.toLocaleString()} Ycoin** đã vào tay người khác~`);
                } catch (error) {
                    console.error(`Error sending message to user ${user.userId}:`, error);
                }
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        };

        const logResults = async (logChannel, client, winner, totalBet, betAfterTax) => {
            const user = await client.users.fetch(winner.userId);
            const embed = new EmbedBuilder()
                .setAuthor({ name: "Thông Báo xổ số kiến thiết Yubabe", iconURL: user.avatarURL() })
                .setTimestamp()
                .addFields([
                    { name: "Người trúng", value: `${user.globalName} aka <@${user.id}>` },
                    { name: "Số tiền trúng trước thuế", value: totalBet.toLocaleString(), inline: true },
                    { name: "Số tiền trúng sau thuế", value: betAfterTax.toLocaleString(), inline: true },
                    { name: "Ngày xổ số", value: moment().tz("Asia/Ho_Chi_Minh").format('DD-MM-YYYY') }
                ]);
            await logChannel.send({ embeds: [embed] });
        };
        await message.reply("đã chạy xổ số");
        await runLottery();
        
    }
}