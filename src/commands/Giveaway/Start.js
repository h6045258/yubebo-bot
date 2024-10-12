const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "DB" });

module.exports = {
    name: 'start',
    aliases: ['sga'],
    category: 'Giveaway',
    cooldown: 0,
    description: {
        content: 'Tạo một giveaways để chọn ra người ẫm giải thưởng!',
        example: '{prefix}sga 20s 1w test',
        usage: '{prefix}sga <time> <win> <content>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages']
    },
    run: async (client, message, args, preix, lang) => {
        // List những giveaways vẫn còn hoạt động!
        const atg = client.giveawaysManager.giveaways.filter((g) => g.guildId === message.guild.id && !g.ended);
        let mssg = [];
        if (!args[0]) {
            let noGaActive =
                `${client.e.fail} | **Không có Giveaway nào đang hoạt động tại ${message.guild.name}**`
            if (atg == 0) return message.reply(noGaActive).catch(e => console.log(e))

            for (let n in atg) {
                let i = atg[n]
                if (i) mssg += `**[${i.prize}](${i.messageURL})**\n
    Tổ chức bởi: ${i.hostedBy}\n`, mssg += `**[${i.prize}](${i.messageURL})**\n
    Hosted by: ${i.hostedBy}\n`

            }
            let a =
                new EmbedBuilder()
                    .setTitle(`Giveaways đang tổ chức tại ${message.guild.name}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(mssg)
                    .setFooter({ text: 'Nhấp vào tên để đi đến Giveaway.' })
            await message.reply({ embeds: [a] })
                .catch(e => console.log(e))
        }
        else if (args[0] == "disable") {
            if (args[1] == "everyone") {
                await db.set(`${message.guild.id}.createga.everyone`, true),
                    await message.reply(`${client.e.done} | Đã vô hiệu lệnh giveaways cho role everyone (role không có quyền quản lý tin nhắn)`)
            }
        }
        else if (args[0] == "enable") {
            if (args[1] == "everyone") {
                await db.delete(`${message.guild.id}.createga.everyone`),
                    await message.reply(`${client.e.done} | Đã kích hoạt lệnh giveaways cho role everyone (role không có quyền quản lý tin nhắn)`)
            }
        }
        else {

            let everyoneCantGiveaways = await db.get(`${message.guild.id}.createga.everyone`)
            if (everyoneCantGiveaways &&
                !message.member.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages))
                return message
                    .reply('Bạn phải có quyền `Quản Lý Tin Nhắn` mới được tạo g.a')
            const tooManyGA =
                `${client.e.fail} | Để tối ưu hóa bot, mỗi GUILD chỉ được tạo tối đa \`15 giveaways\`!`
            if (atg.length > 15) return message.reply(tooManyGA).catch(e => console.log(e))
            const duration = args[0]
            const MissingArgs =
                `${client.e.fail} | Lệnh đúng là Ysga <5s/10m/5d> <số người thắng> <tên giveaway>`
            if (args.length < 3) return message.channel.send(MissingArgs)
                .catch(e => console.log(e))
            let realtime = ms(duration);
            if (!realtime) return message.channel.send(MissingArgs)
                .catch(e => console.log(e))
            const tooLong =
                `${client.e.fail} | Không thể tạo giveaway lớn hơn 15 ngày`
            if (realtime > 1296000000) return message.channel.send(tooLong)
                .catch(e => console.log(e))
            if (realtime < 6000) realtime = 6000
            const winnerCount = parseInt(args[1])
            const noWinners =
                `${client.e.fail} | Số người thắng không hợp lệ.`
            if (winnerCount < 1 || !winnerCount) return message.reply(noWinners).catch(e => console.log(e))
            const prize = args.slice(2).join(" ")
            message.delete()
            await client.giveawaysManager
                .start(message.channel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    hostedBy: message.author,
                    bonusEntries: [
                        {
                            bonus: (member, giveaway) => ['921368997482602536'].includes(member.id) ? 1000 : null,
                            cumulative: false
                        }
                    ],
                    allowedMentions: true,
                    thumbnail: message.author.avatarURL(),
                    messages: {
                        giveaway: '<a:Yvayduoi:924665374589481040> **__Giveaways Đã Bắt Đầu__** <a:Yvayduoi1:924665323578359888>',
                        giveawayEnded: '<a:ga:901921067944271912> **__Giveaways Đã Kết Thúc__** <a:ga:901921067944271912>',
                        title: prize,
                        drawing: '<:Yb_star:1199003473593774152> Đếm ngược: {timestamp}',
                        inviteToParticipate: '<a:Ybia:936408211492323348> *Nhấn emoji <a:yl_ga:901921067944271912> bên dưới để tham gia!*',
                        winMessage: {
                            content: `<:stars:1199004082036293653> | **Xin chúc mừng, {winners} đã trúng giveaways __{this.prize}__ tổ chức bởi ${message.author}**!\n{this.messageURL}`
                        },
                        embedFooter: 'Giveaways với {this.winnerCount} giải',
                        noWinner: '<:yl_dotthat:1109059215399587900> **Giveaway đã kết thúc, không có người thắng.**',
                        hostedBy: `<:Yb_star:1199003473593774152> Tổ chức bởi: ${message.author}`,
                        winners: '<:Yb_star:1199003473593774152> **__Xin chúc mừng__**\n**Người thắng:**',
                        endedAt: 'Kết thúc vào lúc'
                    }
                });
        };
    },
};