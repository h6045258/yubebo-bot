const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const userReg = RegExp(/<@!?(\d+)>/);
const marrySchema = require('../../models/marrySchema');
const invSchema = require('../../models/invSchema');
const anhcuoiSchema = require(`../../models/anhcuoi`);
module.exports = {
    name: 'marry',
    aliases: ['kethon'],
    category: 'Marry',
    cooldown: 30,
    description: {
        content: 'Cưới nhau thôi!!!',
        example: 'marry @phankha 003',
        usage: 'marry <user> <id_nhan>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const data = await marrySchema.findOne({ authorid: message.author.id });
        const husband = message.author;
        let wifeid;
        if (data) wifeid = data.wifeid;
        const hinhcuoi = await anhcuoiSchema.findOne({ authorid: message.author.id });
        if (!args[0]) {
            if (!data) return message.reply(`*Người ta nắm tay nhau hạnh phúc... ${husband.username} nằm ở nhà hát nhạc Justatee!*`);
            else {
                let hinhcuoia = `https://media.discordapp.net/attachments/995649273746182185/1024608797907501066/702a29e3a5ddf6a5165de8bc0a1f174a.gif?size=4096`;
                if (hinhcuoi) hinhcuoia = hinhcuoi.anhcuoi;
                let bennhau = data.together || 0;
                if (!data.date) {
                    data.date = Date.now();
                    await data.save();
                }
                const timestamp = data.date; // timestamp của bạn
                const dates = new Date(timestamp);
                const formattedDate = dates.toLocaleDateString('vi-VN');
                let ngaycuoi = formattedDate;

                const currentDate = new Date(); // Thời điểm hiện tại
                const givenDate = new Date(timestamp); // Ngày cụ thể bạn muốn tính toán

                // Tính toán số ngày đã trôi qua
                const timeDifference = currentDate.getTime() - givenDate.getTime();
                const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                let nhan = data.nhan;
                let imageRing = {
                    "<:Yu_nhanvang:941435163181727824>": `https://cdn.discordapp.com/emojis/941435163181727824.png?size=4096`,
                    "<:Yu_nhanbac:941435162728730675>": `https://cdn.discordapp.com/emojis/941435162728730675.png?size=4096`,
                    "<:Yu_nhanco:951133679546159214>": `https://cdn.discordapp.com/emojis/951133679546159214.png?size=4096`,
                    "<:Yu_nhankimcuong:941435160883265556>": `https://cdn.discordapp.com/emojis/941435160883265556.png?size=4096`,
                    "<:Yu_nhanvangkc:951586992897024060>": `https://cdn.discordapp.com/emojis/951586992897024060.png?size=4096`,
                    "<:yb_ring10:1248829192905424926>": `https://cdn.discordapp.com/emojis/1248829192905424926.png?size=4096`,
                    "<:yb_ring100:1248828071222710332>": `https://cdn.discordapp.com/emojis/1248828071222710332.png?size=4096`
                };
                nhan = imageRing[nhan];
                let loihuacuack = data.loihua;
                let vkid = data.wifeid;
                const vkdata = await marrySchema.findOne({ authorid: vkid });
                let wifes = await client.users.cache.find(u => u.id === vkid);
                let wifename = wifes.username || `No Name`;
                let loihuacuavk = vkdata.loihua;
                const love = new EmbedBuilder()
                    .setTitle(`💖 𝓢𝓸 𝓢𝔀𝓮𝓮𝓽 💖`)
                    .setThumbnail(`${nhan}`)
                    .setDescription(`**__${husband.username}__** <a:Yu_timnhaynhot:950735238177366076> **__${wifename}__**
<a:yl_bluetick:1109063373246701568> 𝑳𝒐𝒗𝒆 𝑷𝒐𝒊𝒏𝒕𝒔: **${bennhau}** 𝑷𝒕𝒔
<a:diam_vip:921424404808871936> Married day: ${ngaycuoi}
<:cb_bohoa:1214464259321499648> Been married for **${daysPassed}** days`)
                    .addFields({
                        name: `𝑷𝒓𝒐𝒎𝒊𝒔𝒆𝒔 𝒇𝒐𝒓 𝒍𝒐𝒗𝒊𝒏𝒈:`, value:
                            `<a:Yl_linetim:944752403201265754> **${loihuacuack}**
<a:Yl_linetim:944752403201265754> **${loihuacuavk}**`
                    })
                    .setFooter({ text: `💖 𝑯𝒂𝒑𝒑𝒊𝒍𝒚 𝒆𝒗𝒆𝒓 𝒂𝒇𝒕𝒆𝒓~ 💖`, iconURL: message.author.displayAvatarURL() })
                    .setColor(`#FFCCCC`)
                    .setImage(hinhcuoia)
                    .setTimestamp();

                return message.channel.send({ content: `𝓐𝓷𝓭 𝓪𝓯𝓽𝓮𝓻 𝓽𝓱𝓪𝓽... 𝓣𝓱𝓮𝔂 𝓵𝓲𝓿𝓮 𝓱𝓪𝓹𝓹𝓲𝓵𝔂 𝓮𝓿𝓮𝓻 𝓪𝓯𝓽𝓮𝓻~`, embeds: [love] });
            }
        }
        else if (args[0].includes(message.author.id)) return message.channel.send(`${client.e.fail} | Why'd you marry yourself?`);
        else {
            const data = await marrySchema.findOne({ authorid: message.author.id });
            const wife = userReg.test(args[0]) ? userReg.exec(args[0])[1] : [0];
            const lovedata = await marrySchema.findOne({ authorid: wife });

            let nameOfRings = {
                "001": "<:Yu_nhanco:951133679546159214>",
                "002": "<:Yu_nhanbac:941435162728730675>",
                "003": "<:Yu_nhanvang:941435163181727824>",
                "004": "<:Yu_nhankimcuong:941435160883265556>",
                "005": "<:Yu_nhanvangkc:951586992897024060>",
                "006": "<:yb_ring10:1248829192905424926>",
                "007": "<:yb_ring100:1248828071222710332>"
            };

            let ringName = nameOfRings[args[1]];
            if (!ringName) return message.channel.send(`${client.e.fail} | Bạn muốn chọn nhẫn nào để cầu hôn?`);
            const proposalRing = await invSchema.findOne({ memberid: message.author.id, name: ringName });
            if (!proposalRing) return message.channel.send(`${client.e.fail} | Bạn chưa sở hữu ${ringName}! Gõ lệnh này để mua: \`Ybuy <Ring ID>\``);
            // code below describe how would they upgrade their married rings - YwY Yukii
            if (data || lovedata) {
                if (wife !== data.wifeid) return message.channel.send(`${client.e.fail} | Bạn đã có đối tượng rồi! Đừng phản bội họ chứ!`);
                if (lovedata.wifeid !== message.author.id) return message.reply(`${client.e.fail} | Đối phương đã có nửa kia rồi! Đừng làm kẻ thứ ba chứ!`);
                else if (wife == data.wifeid) {
                    data.nhan = ringName;
                    lovedata.nhan = ringName;
                    await lovedata.save();
                    await data.save();
                    return message.channel.send(`**Xin chúc mừng! Hai bạn đã nâng cấp nhẫn thành công: ${ringName}**`);
                };
            }
            else {
                const marryRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('yes')
                            .setLabel('Yes, I do!!!')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(client.e.done)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('no')
                            .setLabel('No... pls, don\'t')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(client.e.fail)
                    );
                const proposalMessage = await message.channel.send({ content: `**__<@!${wife}>, ${husband} đã cầu hôn bạn... bạn có 30s để trả lời người ấy!__**`, components: [marryRow] });
                const filter = i => i.customId === 'yes' && i.user.id === wife || i.customId === 'no' && i.user.id === wife;

                const collector = await proposalMessage.createMessageComponentCollector({ filter, time: 30000 });
                collector.on('collect', async (i) => {
                    if (i.customId === 'yes') {
                        await invSchema.deleteOne({ memberid: message.author.id, name: ringName });
                        const loihuacuack = `Bên nhau đến lúc Đầu Bạc Răng Long`;
                        const loihuacuavk = `Yêu người tận khi Bách Niên Giai Lão`;
                        const addWife = new marrySchema({ authorid: husband.id, wifeid: wife, husbandid: wife, nhan: ringName, together: 1, loihua: loihuacuack, date: Date.now() });
                        const addHusband = new marrySchema({ authorid: wife, wifeid: husband.id, husbandid: husband.id, loihua: loihuacuavk, nhan: ringName, together: 1, date: Date.now() });
                        await addWife.save();
                        await addHusband.save();
                        return i.update({ content: `<a:yl_bluetick:1109063373246701568> <a:yl_bluetick:1109063373246701568> <a:yl_bluetick:1109063373246701568>  **__You're now husband and wife!__** <a:yl_bluetick:1109063373246701568> <a:yl_bluetick:1109063373246701568> <a:yl_bluetick:1109063373246701568>`, components: [] });
                    }
                    else if (i.customId === 'no') {
                        return i.update({ content: `Oops,  **${message.author.username}**, sorry...`, components: [] });
                    }
                });
                collector.on('end', async () => {
                    return proposalMessage.edit({ content: "The proposal is invalid ;( ask him/her again (maybe)...", components: [] });
                });
            };
        };
    },
};