// Tạo 1 array chứa các emoji cần dùng
const arr = ['<:s1:1181242469912940624>', '<:s2:1181242790936580146>', '<:hg_money:1181522795247710228>', '<:s3:1181243624097333338>', '<:s4:1181244160553005056>'] // Array chứa emoji 2 cái ngoài cùng ( không có W )
const arr2 = ['<:s1:1181242469912940624>', '<:s2:1181242790936580146>', '<:hg_money:1181522795247710228>', '<:s3:1181243624097333338>', '<:s5:1181244185689473184>'] // Array chứa emoji trong ( không có O )
const loading = '<a:s6:1181244801501364325>' // Emoji động xoay xoay
// Các mức thưởng
const lv1 = ['<:s1:1181242469912940624>', '<:s1:1181242469912940624>', '<:s1:1181242469912940624>'] // x1
const lv2 = ['<:s2:1181242790936580146>', '<:s2:1181242790936580146>', '<:s2:1181242790936580146>'] // x2
const lv3 = ['<:hg_money:1181522795247710228>', '<:hg_money:1181522795247710228>', '<:hg_money:1181522795247710228>'] //x3
const lv4 = ['<:s3:1181243624097333338>', '<:s3:1181243624097333338>', '<:s3:1181243624097333338>'] //x4
const lv0 = ['<:s4:1181244160553005056>', '<:s5:1181244185689473184>', '<:s4:1181244160553005056>'] //x10
const { EmbedBuilder } = require("discord.js");
//const Casher = require("../../models/Casher");
module.exports = {
    name: 'slots',
    aliases: ['slot', 'sl'],
    description: 'Quay gacha trúng chip',
    category: 'Gambling',
    usage: 'slots <sớ tiền cược>',
    cooldown: 1,
    run: async (client, message, args, prefix) => {
        return
        const money = client.e.chip;
        let user = await Casher.findOne({ Id: message.author.id });
        if (!user) {
            user = new Casher({
                Id: message.author.id,
                Coin: 0,
                Chip: 0,
                bankCoin: 0,
                bankChip: 0,
                Luck: 0
            });
            await user.save();
        }
        let cash = user.Chip;
        const name = message.member.displayName

        async function getcoin(length) {
            const a = Math.floor(Math.random() * length)
            return a
        }
        if (!args[0]) return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(client.e.color)
                .setAuthor({ name: `Lỗi Sử Dụng`, iconURL: message.member.displayAvatarURL() })
                .setDescription(`${client.e.x} **| ${name}**, Bạn chưa nhập số tiền để chơi!`)
            ]
        }).then(async msg => {
            setTimeout(() => {
                msg.delete().catch(() => { })
            }, 10000);
        })
        let coin = parseInt(args[0])
        if (!coin && args[0].toLowerCase() !== 'all') coin = 1
        if (coin == 0) return message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor(client.e.color)
                .setAuthor({ name: `Lỗi Sử Dụng`, iconURL: message.member.displayAvatarURL() })
                .setDescription(`${client.e.x} **| ${name}**, Bạn không thể cược với 0 ${client.e.chip} chip!`)
            ]
        }).then(async msg => {
            setTimeout(() => {
                msg.delete()
            }, 10000);
        })
        if (cash <= 0) return message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor(client.e.color)
                .setAuthor({ name: `Lỗi Sử Dụng`, iconURL: message.member.displayAvatarURL() })
                .setDescription(`${client.e.x} **| ${name}**, Bạn không còn chip để chơi!`)
            ]
        }).then(async msg => {
            setTimeout(() => {
                msg.delete()
            }, 10000);
        })
        if (coin < 0) return message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor(client.e.color)
                .setAuthor({ name: `Lỗi Sử Dụng`, iconURL: message.member.displayAvatarURL() })
                .setDescription(`${client.e.x} **| ${name}**, Bạn không thể cược với số tiền này!`)
            ]
        }).then(async msg => {
            setTimeout(() => {
                msg.delete()
            }, 10000);
        })
        if (coin > user.Chip) return message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor(client.e.color)
                .setAuthor({ name: `Lỗi Sử Dụng`, iconURL: message.member.displayAvatarURL() })
                .setDescription(`${client.e.x} **| ${name}**, Bạn chỉ còn ${user.Chip} ${client.e.chip} chip còn lại không đủ để chơi!`)
            ]
        }).then(async msg => {
            setTimeout(() => {
                msg.delete()
            }, 10000);
        })
        if (coin > 50000) {
            if (cash < coin) return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor(client.e.color)
                    .setAuthor({ name: `Lỗi Sử Dụng`, iconURL: message.member.displayAvatarURL() })
                    .setDescription(`${client.e.x} **| ${name}**, Số tiền còn lại không đủ để chơi!`)
                ]
            }).then(async msg => {
                setTimeout(() => {
                    msg.delete()
                }, 10000);
            })
            else coin = 50000
        }
        if (args[0].toLowerCase() == 'all') {
            if (cash > 50000) {
                coin = 50000
            } else if (cash < 50000) {
                coin = user.Chip
            }
        }

        const timeout = 15000;
        let data = await client.timeout(message.author.id);
        let last_slots = data.commands.slots || 0;
        const time = Date.now();

        if (last_slots !== 0 && timeout - (time - last_slots) > 0) {
            let timer = client.duration(timeout - (Date.now() - last_slots));
            return message.reply(`* **${client.e.duration} | ${message.member.displayName}**, bạn đã chơi slots quá nhanh rồi, quay lại sau **${timer}**`).then(async msg => {
                await client.sleep(5000);
                await msg.delete();
            });
        }

        data.commands.slots = time;
        await data.save();

        await client.blackjackUsers.push(message.author.id);
        user.Chip = user.Chip - coin;
        await user.save()
        let formatCash = coin.toLocaleString();
        const ketqua = Math.floor(Math.random() * 1000) / 10 // Tỉ lệ thắng thua (random ra số từ 0 - 100)

        const msg = await message.channel.send(`\` ___SLOTS___ \`\n\` \`${loading} ${loading} ${loading} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
        if (ketqua <= 20) { // Tỉ lệ 20% x1 ( số nhỏ hơn 20 )
            client.blackjackUsers = await client.blackjackUsers.filter(id => id != message.author.id);
            setTimeout(async () => {
                await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv1[0]} ${loading} ${loading} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                setTimeout(async () => {
                    await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv1[0]} ${loading} ${lv1[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                    setTimeout(async () => {
                        await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv1[0]} ${lv1[1]} ${lv1[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`  và đã trúng ${money} ${formatCash}\n\` |         | \``)
                        user.Chip = user.Chip + coin;
                        await user.save()
                    }, 700)
                }, 1000)
            }, 2000)
        } else if (ketqua <= 40) { // Tỉ lệ 20% x2 ( nhỏ hơn 40 , lớn hơn = 20)
            client.blackjackUsers = await client.blackjackUsers.filter(id => id != message.author.id);
            setTimeout(async () => {
                await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv2[0]} ${loading} ${loading} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                setTimeout(async () => {
                    await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv2[0]} ${loading} ${lv2[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                    setTimeout(async () => {

                        await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv2[0]} ${lv2[1]} ${lv2[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`  và đã trúng ${money} ${(coin * 2).toLocaleString()}\n\` |         | \``)
                        user.Chip = user.Chip + coin * 2;
                        await user.save()
                    }, 700)
                }, 1000)
            }, 2000)
        } else if (ketqua <= 45) { // Tỉ lệ 5% x3 ( 40 < x < 45)
            client.blackjackUsers = await client.blackjackUsers.filter(id => id != message.author.id);
            setTimeout(async () => {
                await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv3[0]} ${loading} ${loading} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                setTimeout(async () => {
                    await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv3[0]} ${loading} ${lv3[2]} \`  \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                    setTimeout(async () => {

                        await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv3[0]} ${lv3[1]} ${lv3[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`  và đã trúng ${money} ${(coin * 3).toLocaleString()}\n\` |         | \``)
                        user.Chip = user.Chip + coin * 3;
                        await user.save()
                    }, 700)
                }, 1000)
            }, 2000)
        } else if (ketqua <= 47.5) {// Tỉ lệ 2.5% x4 ( 45 < x < 47.5)
            client.blackjackUsers = await client.blackjackUsers.filter(id => id != message.author.id);
            setTimeout(async () => {
                await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv4[0]} ${loading} ${loading} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                setTimeout(async () => {
                    await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv4[0]} ${loading} ${lv4[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                    setTimeout(async () => {
                        await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv4[0]} ${lv4[1]} ${lv4[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`  và đã trúng ${money} ${(coin * 4).toLocaleString()}\n\` |         | \``)
                        user.Chip = user.Chip + coin * 4;
                        await user.save()
                    }, 700)
                }, 1000)
            }, 2000)
        } else if (ketqua <= 48.5) { // Tỉ lệ 1% x10 ( 47.5 < x < 48.5)
            client.blackjackUsers = await client.blackjackUsers.filter(id => id != message.author.id);
            setTimeout(async () => {
                await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv0[0]} ${loading} ${loading} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                setTimeout(async () => {
                    await msg.edit(`\` ___SLOTS___ \`\n\`  \`${lv0[0]} ${loading} ${lv0[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                    setTimeout(async () => {

                        await msg.edit(`\` ___SLOTS___ \`\n\` \`${lv0[0]} ${lv0[1]} ${lv0[2]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`  và đã trúng ${money} ${(coin * 10).toLocaleString()}\n\` |         | \``)
                        user.Chip = user.Chip + coin * 10;
                        await user.save()
                    }, 700)
                }, 1000)
            }, 2000)
        } else {
            var v1 = await getcoin(arr.length)
            var v2 = await getcoin(arr2.length)
            var v3 = await getcoin(arr.length)
            while (v1 == v2 && v2 == v3) {
                v2 = await getcoin(arr2.length)
            }
            setTimeout(async () => {
                client.blackjackUsers = await client.blackjackUsers.filter(id => id != message.author.id);
                await msg.edit(`\` ___SLOTS___ \`\n\` \`${arr[v1]} ${loading} ${loading} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                setTimeout(async () => {
                    await msg.edit(`\` ___SLOTS___ \`\n\` \`${arr[v1]} ${loading} ${arr[v3]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \`\n\` |         | \``)
                    setTimeout(async () => {
                        await msg.edit(`\` ___SLOTS___ \`\n\` \`${arr[v1]} ${arr2[v2]} ${arr[v3]} \` \` ${name} đã cược ${money} ${formatCash}\n\` |         | \` nhưng không trúng :c\n\` |         | \``)
                    }, 700)
                }, 1000)
            }, 2000)
        }
    }
}
