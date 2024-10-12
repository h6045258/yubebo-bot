const { EmbedBuilder } = require('discord.js');
const number = require('../../configs/number.json');
const gemSchema = require('../../models/gemSchema');
const invSchema = require('../../models/invSchema');
const rodSchema = require("../../models/rodSchema");

module.exports = {
    name: "inventory",
    description: ["Xem kho trang bị của bạn"],
    aliases: ["inv", 'kho'],
    usage: ["inv"],
    cooldown: 30,
    category: "Inventory",
    run: async (client, message, args, prefix, lang) => {
        let a = await message.channel.send({ content: `${client.e.load} | Xin đợi một chút...`}).catch(e => console.log(e))
        await chuyen_trang_Inventory(client, message, a, message.author.id, args).catch(e => console.log(e))
    }
}
function toSmallNum(count, digits) {
    var result = '';
    if (count < 0) count = 0;
    for (i = 0; i < digits; i++) {
        var digit = count % 10;
        count = Math.trunc(count / 10);
        result = number.numbers[digit] + result;
    }
    return result;
}
function idnhan(array, item) {
    let result = ``
    if (item == array[0]) result = `001`
    if (item == array[1]) result = `002`
    if (item == array[2]) result = `003`
    if (item == array[3]) result = `004`
    if (item == array[4]) result = `005`
    if (item == array[5]) result = `006`
    if (item == array[6]) result = `007`
    return result
}
function idpassport(array, item) {
    let result = ``
    if (item == array[0]) result = `30`
    if (item == array[1]) result = `31`
    return result
}
async function chuyen_trang_Inventory(client, message1, message, authorid, args) {
    let embeds = await generateEmbeds(client, message1, args)
    let currentPage = 0;
    const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
    let buttonrow1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji('<:ARROW1:874262374595588117>')
                .setCustomId('skip-page1'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:ARROW2:874262374733987860>')
                .setCustomId('back-page'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:HOME:894217044013248532>')
                .setCustomId('home-page'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:ARROW3:874262374541049896>')
                .setCustomId('next-page'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji('<:ARROW4:874262374608150578>')
                .setCustomId('skip-page2')
        );

    if (embeds.length === 1) return message.edit({ embeds: [embeds[0]] })
    const queueEmbed = await message.edit(
        {
            content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            components: [buttonrow1],
            embeds: [embeds[currentPage]]
        }
    )
    var collector = queueEmbed.createMessageComponentCollector({
        filter: interaction => (interaction.isButton() || interaction.isSelectMenu()) && interaction.message.author.id == client.user.id,
    })
    collector.on("collect", (interaction) => {

        if (interaction.user.id !== authorid) return interaction.reply({ content: "Không phải nút dành cho bạn!", ephemeral: true })
        if (interaction.customId == "next-page") {
            interaction.deferUpdate()
            if (currentPage < embeds.length - 1) {
                currentPage++;
                queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
            }
            else {
                currentPage = 0
                queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
            }
        }
        else if (interaction.customId == "back-page") {
            interaction.deferUpdate()
            if (currentPage !== 0) {
                --currentPage;
                queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
            } else {
                currentPage = embeds.length - 1
                queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
            }
        }
        else if (interaction.customId == "skip-page1") {
            interaction.deferUpdate()
            currentPage = 0;
            // queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
            // queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
            queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
        }
        else if (interaction.customId == "skip-page2") {
            interaction.deferUpdate()
            currentPage = embeds.length - 1;
            queueEmbed.edit({ content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1] });
        }
        else if (interaction.customId == "home-page") {
            interaction.deferUpdate()
            interaction.message.edit({ embeds: [embeds[0]], components: [buttonrow1] })
        }
    })
}
async function generateEmbeds(client, message, args) {

        let msgnhan = []
        let msgpassport = []
        let ringid = [
            '<:Yu_nhanco:951133679546159214>',
            '<:Yu_nhanbac:941435162728730675>',
            '<:Yu_nhanvang:941435163181727824>',
            '<:Yu_nhankimcuong:941435160883265556>',
            '<:Yu_nhanvangkc:951586992897024060>',
            '<:yb_ring10:1248829192905424926>',
            '<:yb_ring100:1248828071222710332>'
        ]
        let passportid = [
            "<:ProPassport:988093838348410930>",
            "<:VIPPassport:988093810955411456>"
        ]
        let arrayNhan = await invSchema.find({ memberid: message.author.id })
        if (arrayNhan[0]) {
            for (let r in arrayNhan) {
                let nhan = arrayNhan[r]
                if (nhan.type == `ring`) {
                    let id = idnhan(ringid, nhan.name)
                    msgnhan += `\`${id}\`${nhan.name}${toSmallNum(nhan.quanlity, 2)} - Giá Trị Hiện Tại: **${parseInt(nhan.price).toLocaleString('En-Us')}**\n`
                } else if (nhan.type == `passport`) {
                    let id = idpassport(passportid, nhan.name)
                    msgpassport += `\`${id}\`${nhan.name}${toSmallNum(nhan.quanlity, 2)}\n`
                }
            }
        }
        let gem = {
            '<:C_gem_01:982028743608533022>': '01',
            '<:U_gem_01:982028744204103810>': '05',
            '<:R_gem_01:982028744107655198>': '09',
            '<:SR_gem_01:982028743960854598>': '13',
            '<:E_gem_01:982028743595941938>': '17',
            '<:P_gem_01:982028744191529010>': '21',
            '<:G_gem_01:982028743629484082>': '25',
            '<:C_gem_02:982028743537209424>': '02',
            '<:U_gem_02:982028744061505606>': '06',
            '<:R_gem_02:982028744124428428>': '10',
            '<:SR_gem_02:982028743956652072>': '14',
            '<:E_gem_02:982028743679827968>': '18',
            '<:P_gem_02:982028743713366066>': '22',
            '<:G_gem_02:982028743646265364>': '26',
            '<:C_gem_03:982028743914696704>': '03',
            '<:U_gem_03:982028743650463795>': '07',
            '<:R_gem_03:982028743948247110>': '11',
            '<:SR_gem_03:982028744124411924>': '15',
            '<:E_gem_03:982028743805648926>': '19',
            '<:P_gem_03:982028743960830032>': '23',
            '<:G_gem_03:982028743537217588>': '27',
            '<:C_gem_04:982028743570755624>': '04',
            '<:U_gem_04:982028744187326494>': '08',
            '<:R_gem_04:982028743822426152>': '12',
            '<:SR_gem_04:982028743981817908>': '16',
            '<:E_gem_04:982028743688212520>': '20',
            '<:P_gem_04:982028743893721178>': '24',
            '<:G_gem_04:982028744057294848>': '28'
        };

        const ngoc1 = await gemSchema
            .find({ memberid: message.author.id, type: 1 })
            .sort({ quanlity: -1 });
        const ngoc2 = await gemSchema
            .find({ memberid: message.author.id, type: 2 })
            .sort({ quanlity: -1 });
        const ngoc3 = await gemSchema
            .find({ memberid: message.author.id, type: 3 })
            .sort({ quanlity: -1 });
        const ngoc4 = await gemSchema
            .find({ memberid: message.author.id, type: 4 })
            .sort({ quanlity: -1 });
        let msg1 = ``;
        if (!ngoc1[0]) msg1 = `:x: | **${message.author.username}**, bạn chưa có ngọc tăng số lượng nào cả`;
        let msg2 = ``;
        if (!ngoc2[0]) msg2 = `:x: | **${message.author.username}**, bạn chưa có ngọc nhân đôi nào cả`;
        let msg3 = ``;
        if (!ngoc3[0]) msg3 = `:x: | **${message.author.username}**, bạn chưa có ngọc may mắn nào cả`;
        let msg4 = ``;
        if (!ngoc4[0]) msg4 = `:x: | **${message.author.username}**, bạn chưa có viên KingStone nào cả`;
        if (ngoc1[0]) {
            const max = ngoc1[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in ngoc1) {
                var n = ngoc1[g];
                var id = gem[n.typeS]
                var type = 1

                if (n) msg1 += `\`${id}\`${n.typeS}${toSmallNum(n.quanlity, digits)} `;
            }
        }
        if (ngoc2[0]) {
            const max = ngoc2[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in ngoc2) {
                var n = ngoc2[g];
                var id = gem[n.typeS]
                var type = 1

                if (n) msg2 += `\`${id}\`${n.typeS}${toSmallNum(n.quanlity, digits)} `;
            }
        }
        if (ngoc3[0]) {
            const max = ngoc3[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in ngoc3) {
                var n = ngoc3[g];
                var id = gem[n.typeS]
                var type = 1
                if (n) msg3 += `\`${id}\`${n.typeS}${toSmallNum(n.quanlity, digits)} `;
            }
        }
        if (ngoc4[0]) {
            const max = ngoc4[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in ngoc4) {
                var n = ngoc4[g];
                var id = gem[n.typeS]
                var type = 1
                if (n) msg4 += `\`${id}\`${n.typeS} ${toSmallNum(n.quanlity, digits)} `;
            }
        }

        let cancau = {
            "<:Yu_cancaugo:952585355670995014>": "cc1",
            "<:Yu_cancauhiendai:952585355759071283>": "cc2",
            "<:Yu_cancaupro:952585356006535209>": "cc3",
            "<:Yu_cancaudacbiet:952585357143195718>": "cc4"
        }

        const cancaugo = await rodSchema
            .find({ memberid: message.author.id, type: 5 })
            .sort({ quanlity: -1 });
        const cancauhiendai = await rodSchema
            .find({ memberid: message.author.id, type: 6 })
            .sort({ quanlity: -1 });
        const cancaupro = await rodSchema
            .find({ memberid: message.author.id, type: 7 })
            .sort({ quanlity: -1 });
        const cancaudacbiet = await rodSchema
            .find({ memberid: message.author.id, type: 8 })
            .sort({ quanlity: -1 });

        let msg5 = ``;
        if (!cancaugo[0]) msg5 = `:x: | **${message.author.username}**, bạn không có cần câu gỗ nào cả`;
        let msg6 = ``;
        if (!cancauhiendai[0]) msg6 = `:x: | **${message.author.username}**, bạn không có cần câu hiện đại nào cả`;
        let msg7 = ``;
        if (!cancaupro[0]) msg7 = `:x: | **${message.author.username}**, bạn không có cần câu pro nào cả`;
        let msg8 = ``;
        if (!cancaudacbiet[0]) msg8 = `:x: | **${message.author.username}**, bạn không có cần câu đặc biệt nào cả`;

        if (cancaugo[0]) {
            const max = cancaugo[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in cancaugo) {
                var n = cancaugo[g];
                var id = cancau[n.typeS]
                var type = 1

                if (n) msg5 += `\`${id}\`${n.typeS}${toSmallNum(n.quanlity, digits)} `;
            }
        }
        if (cancauhiendai[0]) {
            const max = cancauhiendai[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in cancauhiendai) {
                var n = cancauhiendai[g];
                var id = cancau[n.typeS]
                var type = 1

                if (n) msg6 += `\`${id}\`${n.typeS}${toSmallNum(n.quanlity, digits)} `;
            }
        }
        if (cancaupro[0]) {
            const max = cancaupro[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in cancaupro) {
                var n = cancaupro[g];
                var id = cancau[n.typeS]
                var type = 1
                if (n) msg7 += `\`${id}\`${n.typeS}${toSmallNum(n.quanlity, digits)} `;
            }
        }
        if (cancaudacbiet[0]) {
            const max = cancaudacbiet[0].quanlity;
            let digits = Math.trunc(Math.log10(max) + 1);
            for (g in cancaudacbiet) {
                var n = cancaudacbiet[g];
                var id = cancau[n.typeS]
                var type = 1
                if (n) msg8 += `\`${id}\`${n.typeS} ${toSmallNum(n.quanlity, digits)} `;
            }
        }

        const gembox = await gemSchema.find({ memberid: message.author.id, type: 0 }).sort({ quanlity: -1 })
        if (!gembox[0]) {
            const addgembox = new gemSchema({ memberid: message.author.id, typeS: `<:GEMBOX:982028743952441355>`, quanlity: 0, type: 0 })
            await addgembox.save()
            const addprogembox = new gemSchema({ memberid: message.author.id, typeS: `<:PRO_GEMBOX:982028744057298964>`, quanlity: 0, type: 0 })
            await addprogembox.save()
            const addvipgembox = new gemSchema({ memberid: message.author.id, typeS: `<:VIP_GEMBOX:982028743889543278>`, quanlity: 0, type: 0 })
            await addvipgembox.save()
        }
        let gemboxmsg = ``
        const max2 = gembox[0]?.quanlity || 0;
        let digits2 = Math.trunc(Math.log10(max2) + 1);
        for (let g in gembox) {
            let gem = gembox[g]
            let name = gem.typeS
            let quanlity = gem.quanlity
            let id = ``
            if (name == `<:GEMBOX:982028743952441355>`) id = `29`
            if (name == `<:PRO_GEMBOX:982028744057298964>`) id = `32`
            if (name == `<:VIP_GEMBOX:982028743889543278>`) id = `33`
            gemboxmsg += `\`${id}\`${name}${toSmallNum(quanlity, digits2)}`
        }
        //const itemembed = ` <:ThuHon:991633698300624956>${toSmallNum(slth, maxth)}`

        const ngochuntembed = `<a:yl_capoquay:1107968194800525322> **TÀI SẢN CỦA ${message.author.username}** <a:yl_capoquay:1107968194800525322> 
**Ngọc : Yuse + <ID>**
${gemboxmsg}\n**Ngọc Số Lượng**\n${msg1}\n**Ngọc Nhân Đôi Thú**\n${msg2}\n**Ngọc May Mắn**\n${msg3}\n**KING STONE**\n${msg4}`

        const cancauembed = `<a:yl_capoquay:1107968194800525322> **TÀI SẢN CỦA ${message.author.username}** <a:yl_capoquay:1107968194800525322> 
**Cần câu : Yuse + <ID>**
**Cần câu gỗ**\n${msg5}\n**Cần câu hiện đại**\n${msg6}\n**Cần câu pro**\n${msg7}\n**Cần câu đặc biệt**\n${msg8}`

        const nhanembed = `<a:yl_capoquay:1107968194800525322> **TÀI SẢN CỦA ${message.author.username}** <a:yl_capoquay:1107968194800525322> 
<a:star_s:1202553907243384882> Nhẫn :
${msgnhan}`
        const passportembed = `<a:yl_capoquay:1107968194800525322> **TÀI SẢN CỦA ${message.author.username}** <a:yl_capoquay:1107968194800525322> 
<a:star_s:1202553907243384882> Passport :
${msgpassport}`


        const ringembed = new EmbedBuilder()
            .setAuthor({ name: `Kho của ${message.author.username}`, iconURL: `https://discordapp.com/channels/896744428100804688/942015852310577162/984313077187108865`, url: `https://discord.gg/ZbAT9jt5Ak` })
            .setTitle(`KHO NHẪN`)
            .setDescription(nhanembed)
            .setColor("#303037")
            .setFooter({ text: "Cảm ơn bạn đã bên cạnh Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
            .setTimestamp()
        const gemembed = new EmbedBuilder()
            .setAuthor({ name: `Kho Của ${message.author.username}`, iconURL: `https://discordapp.com/channels/896744428100804688/942015852310577162/984313077187108865`, url: `https://discord.gg/ZbAT9jt5Ak` })
            .setTitle(`Kho Ngọc`)
            .setDescription(ngochuntembed)
            .setColor("#303037")
            .setFooter({ text: "Cảm ơn bạn đã bên cạnh Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
            .setTimestamp()

        const ppembed = new EmbedBuilder()
            .setAuthor({ name: `Kho của ${message.author.username}`, iconURL: `https://discordapp.com/channels/896744428100804688/942015852310577162/984313077187108865`, url: `https://discord.gg/ZbAT9jt5Ak` })
            .setTitle(`KHO PASSPORT`)
            .setDescription(passportembed)
            .setColor("#303037")
            .setFooter({ text: "Cảm ơn bạn đã bên cạnh Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
            .setTimestamp()

        const rodembed = new EmbedBuilder()
            .setAuthor({ name: `Kho Của ${message.author.username}`, iconURL: `https://discordapp.com/channels/896744428100804688/942015852310577162/984313077187108865`, url: `https://discord.gg/ZbAT9jt5Ak` })
            .setTitle(`Kho Cần`)
            .setDescription(cancauembed)
            .setColor("#0388fc")
            .setFooter({ text: "Cảm ơn bạn đã bên cạnh Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
            .setTimestamp()
        return embeds = [ringembed, gemembed, rodembed, ppembed]
    }
