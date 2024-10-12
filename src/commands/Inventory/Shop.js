const invSchema = require('../../models/invSchema');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const rodPrice = require("../../configs/rodPrices.json");
const emojis = require("../../configs/emojis.json");
const emoji = require("../../configs/config.json");
const cattelPrices = require("../../configs/cattlePrices.json");
const vipSchema = require("../../models/vipSchema");


module.exports = {
    name: "shop",
    description: ["SHOP ITEM CỦA YUBABE, chuyên buôn bán các mặt hàng nhu yếu phẩm <3"],
    aliases: ["cuahang"],
    usage: ["{prefix}buy <id> <soluong>"],
    cooldown: 10,
    category: "Inventory",
    /**
     * 
     * @param {*} client 
     * @param {import('discord.js').Message} message 
     * @param {*} args 
     * @param {*} prefix 
     * @param {*} lang 
     */
    run: async (client, message, args, prefix, lang) => {
        let hg1 = client.seed.ot.seedEmoji;
        let hg2 = client.seed.lua.seedEmoji;
        let hg3 = client.seed.dautay.seedEmoji;
        let hg4 = `${client.seed.ngo.seedEmoji}`;
        let hg5 = `${client.seed.cachua.seedEmoji}`;
        let hg6 = `${client.seed.dao.seedEmoji}`;
        let hg7 = `${client.seed.khoaimi.seedEmoji}`;
        let hg8 = `${client.seed.mia.seedEmoji}`;
        let hg9 = `${client.seed.khoaitay.seedEmoji}`;
        let hg10 = `${client.seed.duagang.seedEmoji}`;
        let hg11 = `${client.seed.carot.seedEmoji}`;
        let hg12 = `${client.seed.caingot.seedEmoji}`;
        let hg13 = `${client.seed.mit.seedEmoji}`;

        /****<:Yu_GaCon:953394343148920902> \`:\` Shop Vật Nuôi**
        **<:Yu_camheo:953407482955436062> \`:\` Shop Thức Ăn Vật Nuôi** */
        let listshop = new EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL(), url: `https://discord.gg/ZbAT9jt5Ak` })
            .setTitle(`Tiệm Tạp Hóa Yubabe`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/936872532932440065/59b3e7c9da97700f3e629fe73714f1b2.webp?size=1024`)
            .setDescription(`
**Xin chào ${message.author}, bạn muốn mua gì ?**.

** <a:Yl_chamhoi:919903486462820372> Chọn Mục Bạn Muốn Mua Bên Dưới**

**<:yb_ring100:1248828071222710332> \`:\` Shop Nhẫn**
**<:Yu_field:953050619558645820> \`:\` Shop Hạt Giống 1**
**<:Yu_field:953050619558645820> \`:\` Shop Hạt Giống 2**
**<:Yu_GaCon:953394343148920902> \`:\` Shop vật nuôi**
**<:Yu_co:953408530474475520> \`:\` Shop thức ăn vật nuôi**
**<:Yucoin:1191320153594531840> \`:\` Shop Vcoin**
**<:Yu_cancaudacbiet:952585357143195718> \`:\` Shop cần câu**

[Mời Tôi Về Server Của Bạn!](${`https://discord.com/api/oauth2/authorize?client_id=936872532932440065&permissions=431174843457&scope=bot`})
 `)

            .setFooter({ text: `Gõ <YBUY + ID> để mua`, iconURL: `https://cdn.discordapp.com/emojis/953322964764487690.png` })
            .setColor(`#303037`);
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(message.id)
                    .setPlaceholder('❯ Tạp Hóa Yubabe!')
                    .addOptions([
                        {
                            label: 'Shop Nhẫn',
                            description: 'Xem nhẫn và mua để MARRY',
                            value: 'ringshop',
                            //emoji: '<:Yu_nhanvangkc:951586992897024060>'
                        },
                        {
                            label: 'Shop Hạt Giống 1',
                            description: 'Mua hạt giống trồng cây!',
                            value: 'seedshop1',
                            // emoji: "<:Yu_field:953050619558645820>"
                        },
                        {
                            label: 'Shop Hạt Giống 2',
                            description: 'Mua hạt giống trồng cây!',
                            value: 'seedshop2',
                            // emoji: "<:Yu_field:953050619558645820>"
                        },
                        {
                            label: 'Shop Vật Nuôi',
                            description: 'Mua thú để nuôi lấy nông sản',
                            value: 'cattleshop',
                            // emoji: "<:Yu_GaCon:953394343148920902>"
                        },
                        {
                            label: 'Shop Thức Ăn Vật Nuôi',
                            description: 'Mua thức ăn cho thú!',
                            value: 'cattlefoodshop',
                            // emoji: "<:Yu_camheo:953407482955436062>"
                        },
                        {
                            label: 'Shop Vcoin',
                            description: 'Vcoin, bạn có thể mua Passport bằng nó !',
                            value: 'yushop',
                            // emoji: "<:Yu_camheo:953407482955436062>"
                        },
                        {
                            label: 'Shop Cần Câu',
                            description: 'Mua cần câu',
                            value: 'cancaushop',
                            // emoji: "<:Yu_camheo:953407482955436062>"
                        },
                    ])
            );
        if (message.channel.isDMBased()) return;
        const shopmsg = await message.channel.send({ embeds: [listshop], components: [row] });

        const filter = (i) => {
            if (i.user.id !== message.author.id) {
                const notForYou =
                    `:x: | **${i.user.username}** , không phải nút dành cho bạn!`;
                i.reply({ content: notForYou, ephemeral: true }).catch(e => console.log(e));
                return false;
            } else return true;
        };

        const shopCollector = message.channel.createMessageComponentCollector({
            filter: filter,
            time: 180e3,
            componentType: ComponentType.StringSelect
        });

        shopCollector.once('end', async collects => {
            await shopmsg.edit({ content: "Đã hết thời gian shopping :3", components: [] });
        });

        const { vip, pro } = await client.provip(message);
        const provip = await vipSchema.findOne({ memberid: message.author.id });

        shopCollector.on('collect', async shopinteraction => {
            if (shopinteraction.customId !== message.id) return;
            const options = shopinteraction.values;
            const shoptype = options[0];
            if (shoptype === 'ringshop') {
                await shopinteraction.deferUpdate();
                const ringshop = new EmbedBuilder()
                    .setAuthor({ name: `Tiệm Tạp Hóa Yubabe`, iconURL: `https://media.discordapp.net/attachments/1190296537671159828/1190300628619120770/IMG_3656.jpg?ex=65a14cd8&is=658ed7d8&hm=aac9837a1ace082ef06529e008832d08801981e1377f4586ecc8a97ba13998cb&=&format=webp&width=543&height=543`, url: `https://discord.gg/ZbAT9jt5Ak` })
                    .setTitle(`SHOP NHẪN`)
                    .setDescription(`\`Gõ <YBUY + ID> hoặc nhấn button bên dưới để mua\`
\`001\` <:Yu_nhanco:951133679546159214> : **__25.000__ Ycoin**
\`002\` <:Yu_nhanbac:941435162728730675> : **__500.000__ Ycoin**
\`003\` <:Yu_nhanvang:941435163181727824> : **__1.000.000__ Ycoin**
\`004\` <:Yu_nhankimcuong:941435160883265556> : **__10.000.000__ Ycoin**
\`005\` <:Yu_nhanvangkc:951586992897024060> : **__25.000.000__ Ycoin**
\`006\` <:yb_ring10:1248829192905424926> : **__10.000.000__ Ycoin** *(pp)*
\`007\` <:yb_ring100:1248828071222710332> : **__100.000.000__ Ycoin**
\`008\` Nhẫn Nại: **__∞__ Ycoin ** ( rèn luyện tự có, không cần mua !)
`)
                    .setColor("#303037")
                    .setFooter({ text: "Cảm ơn bạn đã chọn Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
                    .setTimestamp();
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_nhanco:951133679546159214>')
                            .setCustomId(`${message.id}.nhanco`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_nhanbac:941435162728730675>')
                            .setCustomId(`${message.id}.nhanbac`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_nhanvang:941435163181727824>')
                            .setCustomId(`${message.id}.nhanvang`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_nhankimcuong:941435160883265556>')
                            .setCustomId(`${message.id}.nhankc`)
                    );

                // Second row of buttons
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_nhanvangkc:951586992897024060>')
                            .setCustomId(`${message.id}.nhanvangkc`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:yb_ring10:1248829192905424926>')
                            .setCustomId(`${message.id}.nhanvangkim`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:yb_ring100:1248828071222710332>')
                            .setCustomId(`${message.id}.nhanvangruby`)
                    );

                const a = await shopmsg.edit({
                    content: `<@${message.author.id}>`,
                    embeds: [ringshop],
                    components: [row1, row2]
                });
                const collector = a.createMessageComponentCollector({
                    filter: filter
                });
                collector.on("collect", async (interaction) => {
                    if (shopinteraction.customId === "shop") return;

                    !interaction.replied && await interaction.deferUpdate();
                    if (interaction.user.id !== message.author.id) {
                        const notForYou = [
                            `:x: | **${interaction.user.username}** , không phải nút dành cho bạn!`,
                            `:x: | **${interaction.user.username}** , this interaction isn't for you!`
                        ];
                        return await message.channel.send(notForYou).catch(e => console.log(e));
                    }
                    if (interaction.customId == `${message.id}.nhanco`) {
                        const member = message.author;

                        if (cash < 25000) {
                            let errorCash = [
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Cỏ!`,
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, you don't have enough money to buy Grass Ring!`
                            ];
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhanco:951133679546159214>` });
                        if (NhanCo) {
                            let errorHad = [
                                `Bạn đã sở hữu nhẫn Cỏ rồi!`,
                                `You already had Grass ring!`
                            ];
                            return await message.channel.send(errorHad).catch(e => console.log(e));
                        }
                        else {
                            let price = 0;
                            let luck = 0;
                            if (!pro && !vip) luck = Math.floor(Math.random() * 10);
                            if (pro) luck = Math.floor(Math.random() * 10) - 2;
                            if (vip) luck = Math.floor(Math.random() * 10) - 4;
                            if (luck == 1) price = Math.floor(Math.random() * 2500);
                            if (luck !== 1) price = -(Math.floor(Math.random() * 2500));
                            const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanco:951133679546159214>`, quanlity: 1, type: `ring`, price: (25000 + price) });
                            await muanhanco.save();
                        }
                        client.tru(member.id, 25000);
                        const success = [
                            `<:Yu_nhanco:951133679546159214> | **${member.username}**, bạn đã mua **Nhẫn Cỏ** với giá **25,000 Ycoin**!`,
                            `<:Yu_nhanco:951133679546159214> | **${member.username}**, you bought **Grass Ring** with **25,000 Ycoin**!`
                        ];
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.nhanbac`) {
                        const member = message.author;

                        if (cash < 500000) {
                            let errorCash =
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Bạc!`;
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhanbac:941435162728730675>` });
                        if (NhanCo) {
                            let errorHad =
                                `Bạn đã sở hữu nhẫn Bạc rồi!`;
                            return await message.channel.send(errorHad).catch(e => console.log(e));
                        }
                        else {
                            let price = 0;
                            let luck = 0;
                            if (!pro && !vip) luck = Math.floor(Math.random() * 10);
                            if (pro) luck = Math.floor(Math.random() * 10) - 2;
                            if (vip) luck = Math.floor(Math.random() * 10) - 4;
                            if (luck == 1) price = Math.floor(Math.random() * 50000);
                            if (luck !== 1) price = -(Math.floor(Math.random() * 50000));
                            const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanbac:941435162728730675>`, quanlity: 1, type: `ring`, price: (500000 + price) });
                            await muanhanco.save();
                        }
                        client.tru(member.id, 500000);
                        const success =
                            `<:Yu_nhanbac:941435162728730675> | **${member.username}**, bạn đã mua **Nhẫn Bạc** với giá **500,000 Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.nhanvang`) {
                        const member = message.author;

                        if (cash < 1000000) {
                            let errorCash =
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Vàng!`;
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhanvang:941435163181727824>` });
                        if (NhanCo) {
                            let errorHad =
                                `Bạn đã sở hữu nhẫn Vàng rồi!`;
                            return await message.channel.send(errorHad).catch(e => console.log(e));
                        }
                        else {
                            let price = 0;
                            let luck = 0;
                            if (!pro && !vip) luck = Math.floor(Math.random() * 10);
                            if (pro) luck = Math.floor(Math.random() * 10) - 2;
                            if (vip) luck = Math.floor(Math.random() * 10) - 4;
                            if (luck == 1) price = Math.floor(Math.random() * 100000);
                            if (luck !== 1) price = -(Math.floor(Math.random() * 100000));
                            const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanvang:941435163181727824>`, quanlity: 1, type: `ring`, price: (1000000 + price) });
                            await muanhanco.save();
                        }
                        client.tru(member.id, 1000000);
                        const success =
                            `<:Yu_nhanvang:941435163181727824> | **${member.username}**, bạn đã mua **Nhẫn Vàng** với giá **1,000,000 Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.nhankc`) {
                        const member = message.author;

                        if (cash < 10000000) {
                            let errorCash =
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Kim Cương!`;
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhankimcuong:941435160883265556>` });
                        if (NhanCo) {
                            let errorHad =
                                `Bạn đã sở hữu nhẫn Kim Cương rồi!`;
                            return await message.channel.send(errorHad).catch(e => console.log(e));
                        }
                        else {
                            let price = 0;
                            let luck = 0;
                            if (!pro && !vip) luck = Math.floor(Math.random() * 10);
                            if (pro) luck = Math.floor(Math.random() * 10) - 2;
                            if (vip) luck = Math.floor(Math.random() * 10) - 4;
                            if (luck == 1) price = Math.floor(Math.random() * 1000000);
                            if (luck !== 1) price = -(Math.floor(Math.random() * 1000000));
                            const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhankimcuong:941435160883265556>`, quanlity: 1, type: `ring`, price: (10000000 + price) });
                            await muanhanco.save();
                        }
                        client.tru(member.id, 10000000);
                        const success =
                            `<:Yu_nhankimcuong:941435160883265556> | **${member.username}**, bạn đã mua **Nhẫn Kim Cương** với giá **10,000,000 Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.nhanvangkc`) {
                        const member = message.author;

                        if (cash < 25000000) {
                            let errorCash =
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Đôi Kim Cương!`;
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhanvangkc:951586992897024060>` });
                        if (NhanCo) {
                            let errorHad =
                                `Bạn đã sở hữu nhẫn Đôi Kim Cương rồi!`;
                            return await message.channel.send(errorHad).catch(e => console.log(e));
                        }
                        else {
                            let price = 0;
                            let luck = 0;
                            if (!pro && !vip) luck = Math.floor(Math.random() * 10);
                            if (pro) luck = Math.floor(Math.random() * 10) - 2;
                            if (vip) luck = Math.floor(Math.random() * 10) - 4;
                            if (luck == 1) price = Math.floor(Math.random() * 2500000);
                            if (luck !== 1) price = -(Math.floor(Math.random() * 2500000));
                            const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanvangkc:951586992897024060>`, quanlity: 1, type: `ring`, price: (25000000 + price) });
                            await muanhanco.save();
                        }
                        client.tru(member.id, 25000000);
                        const success =
                            `<:Yu_nhanvangkc:951586992897024060> | **${member.username}**, bạn đã mua **Nhẫn Đôi Kim Cương** với giá **25,000,000 Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.nhanvangkim`) {
                        const member = message.author;

                        if (cash < 10000000 && vip !== true) {
                            let errorCash =
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Vàng Kim hoặc bạn không có passport!`;
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        if (!provip) {
                            let errorCash =
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Vàng Kim hoặc bạn không có passport!`;
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:yb_ring10:1248829192905424926>` });
                        if (NhanCo) {
                            let errorHad =
                                `Bạn đã sở hữu nhẫn Vàng Kim rồi!`;
                            return await message.channel.send(errorHad).catch(e => console.log(e));
                        }
                        else {
                            let price = 0;
                            let luck = 0;
                            if (!pro && !vip) luck = Math.floor(Math.random() * 10);
                            if (pro) luck = Math.floor(Math.random() * 10) - 2;
                            if (vip) luck = Math.floor(Math.random() * 10) - 4;
                            if (luck == 1) price = Math.floor(Math.random() * 50000);
                            if (luck !== 1) price = -(Math.floor(Math.random() * 50000));
                            const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:yb_ring10:1248829192905424926>`, quanlity: 1, type: `ring`, price: (10000000) });
                            await muanhanco.save();
                        }
                        client.tru(member.id, 10000000);
                        const success =
                            `<:yb_ring10:1248829192905424926> | **${member.username}**, bạn đã mua **Nhẫn Vàng Kim** với giá **10,000,000 Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.nhanvangruby`) {
                        const member = message.author;

                        if (provip) {
                            const date = await client.datepassport(message.author.id);
                            const status = await client.checkpassport(date);
                            let end = status.after;
                            if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true;
                            if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true;
                        }
                        if (cash < 100000000) {
                            let errorCash =
                                `<:Yu_fail:941589021761634306> | **${message.author.username}**, bạn không đủ tiền mua Nhẫn Vàng Ruby !`;
                            return await message.channel.send(errorCash).catch(e => console.log(e));
                        }
                        const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:yb_ring100:1248828071222710332>` });
                        if (NhanCo) {
                            let errorHad =
                                `Bạn đã sở hữu nhẫn Vàng Ruby rồi!`;
                            return await message.channel.send(errorHad).catch(e => console.log(e));
                        }
                        else {
                            let price = 0;
                            let luck = 0;
                            if (!pro && !vip) luck = Math.floor(Math.random() * 10);
                            if (pro) luck = Math.floor(Math.random() * 10) - 2;
                            if (vip) luck = Math.floor(Math.random() * 10) - 4;
                            if (luck == 1) price = Math.floor(Math.random() * 100000);
                            if (luck !== 1) price = -(Math.floor(Math.random() * 100000));
                            const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:yb_ring100:1248828071222710332>`, quanlity: 1, type: `ring`, price: (100000000 + price) });
                            await muanhanco.save();
                        }
                        client.tru(member.id, 100000000);
                        const success =
                            `<:yb_ring100:1248828071222710332> | **${member.username}**, bạn đã mua **Nhẫn Vàng Ruby** với giá **100,000,000 Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else return;
                });
            }
            else if (shoptype === 'seedshop1') {
                !shopinteraction.replied && await shopinteraction.deferUpdate();
                const hatgiongshop1 = new EmbedBuilder()
                    .setAuthor({ name: `Tiệm Tạp Hóa Yubabe`, iconURL: `https://media.discordapp.net/attachments/1190296537671159828/1190300628619120770/IMG_3656.jpg?ex=65a14cd8&is=658ed7d8&hm=aac9837a1ace082ef06529e008832d08801981e1377f4586ecc8a97ba13998cb&=&format=webp&width=543&height=543`, url: `https://discord.gg/ZbAT9jt5Ak` })
                    .setTitle(`SHOP HẠT GIỐNG 1`)
                    .setDescription(`\`Type <YBUY + ID> to buy something\`
\`1 - ot\` ${hg1} : **__${(client.seed.ot.buy).toLocaleString("en-us")}__ Ycoin**
Thu Hoạch : \`${client.timeStamp(client.seed.ot.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.ot.minHarvest} - ${client.seed.ot.maxHarvest}]
\`2 - lua\` ${hg2} : **__${(client.seed.lua.buy).toLocaleString("en-us")}__ Ycoin**
Thu Hoạch : \`${client.timeStamp(client.seed.lua.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.lua.minHarvest} - ${client.seed.lua.maxHarvest}]
\`3 - carot\` ${hg11} : **__${(client.seed.carot.buy).toLocaleString("en-us")}__ Ycoin**
Thu Hoạch : \`${client.timeStamp(client.seed.carot.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.carot.minHarvest} - ${client.seed.carot.maxHarvest}]
\`4 - cachua\` ${hg5} : **__${(client.seed.cachua.buy).toLocaleString("en-us")}__ Ycoin**
Thu Hoạch : \`${client.timeStamp(client.seed.cachua.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.cachua.minHarvest} - ${client.seed.cachua.maxHarvest}]
\`5 - ngo\` ${hg4} : **__${(client.seed.ngo.buy).toLocaleString("en-us")}__ Ycoin**
Thu Hoạch : \`${client.timeStamp(client.seed.ngo.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.ngo.minHarvest} - ${client.seed.ngo.maxHarvest}]
\`6 - khoaimi\` ${hg7} : **__${(client.seed.khoaimi.buy).toLocaleString("en-us")}__ Ycoin**
Thu Hoạch : \`${client.timeStamp(client.seed.khoaimi.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.khoaimi.minHarvest} - ${client.seed.khoaimi.maxHarvest}]
`)
                    .setColor("#303037")
                    .setFooter({ text: "Cảm ơn bạn đã chọn Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
                    .setTimestamp();
                const buy1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(client.seed.ot.seedEmoji)
                            .setCustomId(`${message.id}.ot`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(client.seed.lua.seedEmoji)
                            .setCustomId(`${message.id}.lua`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.carot.seedEmoji}`)
                            .setCustomId(`${message.id}.carot`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.cachua.seedEmoji}`)
                            .setCustomId(`${message.id}.cachua`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.ngo.seedEmoji}`)
                            .setCustomId(`${message.id}.ngo`),
                    );
                const buy2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.khoaimi.seedEmoji}`)
                            .setCustomId(`${message.id}.khoaimi`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.khoaitay.seedEmoji}`)
                            .setCustomId(`${message.id}.khoaitay`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.caingot.seedEmoji}`)
                            .setCustomId(`${message.id}.caingot`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.mia.seedEmoji}`)
                            .setCustomId(`${message.id}.mia`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.dao.seedEmoji}`)
                            .setCustomId(`${message.id}.dao`),
                    );
                const buy3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(client.seed.dautay.seedEmoji)
                            .setCustomId(`${message.id}.dautay`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.duagang.seedEmoji}`)
                            .setCustomId(`${message.id}.duagang`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.mit.seedEmoji}`)
                            .setCustomId(`${message.id}.mit`),
                    );
                const a = await shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [hatgiongshop1], components: [row, buy1, buy2, buy3] });
                const collector = a.createMessageComponentCollector({
                    filter: filter
                });
                collector.on("collect", async (interaction) => {
                    if (shopinteraction.customId === "shop") return;

                    !interaction.replied && await interaction.deferUpdate();
                    if (interaction.user.id !== message.author.id) {
                        const notForYou =
                            `:x: | **${interaction.user.username}** , không phải nút dành cho bạn!`;
                        return await message.channel.send(notForYou).catch(e => console.log(e));
                    }
                    if (interaction.customId == `${message.id}.ot`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.ot.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.ot.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, client.seed.ot.seedEmoji, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.ot.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Ớt** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.lua`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.lua.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.lua.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, client.seed.lua.seedEmoji, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.lua.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Lúa** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.dautay`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.dautay.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.dautay.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, client.seed.dautay.seedEmoji, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.dautay.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Dâu Tây** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.ngo`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.ngo.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.ngo.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.ngo.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.ngo.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Ngô** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.cachua`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.cachua.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.cachua.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.cachua.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.cachua.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Cà Chua** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.dao`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.dao.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.dao.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.dao.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.dao.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Đào** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.khoaimi`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.khoaimi.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.khoaimi.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.khoaimi.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.khoaimi.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Khoai Mì** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.mia`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.mia.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.mia.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.mia.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.mia.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Mía** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.duagang`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.duagang.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.duagang.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.duagang.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.duagang.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Dưa Gang** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.khoaitay`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.khoaitay.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.khoaitay.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.khoaitay.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.khoaitay.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Khoai Tây** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.carot`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.carot.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.carot.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.carot.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.carot.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Cà Rốt** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.caingot`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.caingot.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.caingot.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.caingot.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.caingot.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Cải Ngọt** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.mit`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.mit.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.mit.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.mit.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.mit.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Mít** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else return;
                });
                shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [hatgiongshop1], components: [row, buy1, buy2, buy3] });

            }
            else if (shoptype === 'seedshop2') {
                !shopinteraction.replied && await shopinteraction.deferUpdate();
                const hatgiongshop2 = new EmbedBuilder()
                    .setAuthor({ name: `Tiệm Tạp Hóa Yubabe`, iconURL: `https://media.discordapp.net/attachments/1190296537671159828/1190300628619120770/IMG_3656.jpg?ex=65a14cd8&is=658ed7d8&hm=aac9837a1ace082ef06529e008832d08801981e1377f4586ecc8a97ba13998cb&=&format=webp&width=543&height=543`, url: `https://discord.gg/ZbAT9jt5Ak` })
                    .setTitle(`SHOP HẠT GIỐNG 2`)
                    .setDescription(`\`Type <YBUY + ID> to buy something\`
\`7 - khoaitay\` ${hg9} : **__${(client.seed.khoaitay.buy).toLocaleString("en-us")}__ Ycoin**
Harvest : \`${client.timeStamp(client.seed.khoaitay.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.khoaitay.minHarvest} - ${client.seed.khoaitay.maxHarvest}]
\`8 - caingot\` ${hg12} : **__${(client.seed.caingot.buy).toLocaleString("en-us")}__ Ycoin**
Harvest : \`${client.timeStamp(client.seed.caingot.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.caingot.minHarvest} - ${client.seed.caingot.maxHarvest}]
\`9 - mia\` ${hg8} : **__${(client.seed.mia.buy).toLocaleString("en-us")}__ Ycoin**
Harvest : \`${client.timeStamp(client.seed.mia.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.mia.minHarvest} - ${client.seed.mia.maxHarvest}]
\`10 - dao\` ${hg6} : **__${(client.seed.dao.buy).toLocaleString("en-us")}__ Ycoin**
Harvest : \`${client.timeStamp(client.seed.dao.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.dao.minHarvest} - ${client.seed.dao.maxHarvest}]
\`11 - dautay\` ${hg3} : **__${(client.seed.dautay.buy).toLocaleString("en-us")}__ Ycoin**
Harvest : \`${client.timeStamp(client.seed.dautay.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.dautay.minHarvest} - ${client.seed.dautay.maxHarvest}]
\`12 - duagang\` ${hg10} : **__${(client.seed.duagang.buy).toLocaleString("en-us")}__ Ycoin**
Harvest : \`${client.timeStamp(client.seed.duagang.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.duagang.minHarvest} - ${client.seed.duagang.maxHarvest}] 
\`13 - mit\` ${hg13} : **__${(client.seed.mit.buy).toLocaleString("en-us")}__ Ycoin**
Harvest : \`${client.timeStamp(client.seed.mit.maturityTime).string.short}\` ${client.i("arrow")} [${client.seed.mit.minHarvest} - ${client.seed.mit.maxHarvest}]
`)
                    .setColor("#303037")
                    .setFooter({ text: "Cảm ơn bạn đã chọn Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
                    .setTimestamp();
                const buy1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(client.seed.ot.seedEmoji)
                            .setCustomId(`${message.id}.ot`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(client.seed.lua.seedEmoji)
                            .setCustomId(`${message.id}.lua`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.carot.seedEmoji}`)
                            .setCustomId(`${message.id}.carot`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.cachua.seedEmoji}`)
                            .setCustomId(`${message.id}.cachua`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.ngo.seedEmoji}`)
                            .setCustomId(`${message.id}.ngo`)
                    );
                const buy2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.khoaimi.seedEmoji}`)
                            .setCustomId(`${message.id}.khoaimi`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.khoaitay.seedEmoji}`)
                            .setCustomId(`${message.id}.khoaitay`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.caingot.seedEmoji}`)
                            .setCustomId(`${message.id}.caingot`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.mia.seedEmoji}`)
                            .setCustomId(`${message.id}.mia`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.dao.seedEmoji}`)
                            .setCustomId(`${message.id}.dao`),
                    );
                const buy3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(client.seed.dautay.seedEmoji)
                            .setCustomId(`${message.id}.dautay`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.duagang.seedEmoji}`)
                            .setCustomId(`${message.id}.duagang`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${client.seed.mit.seedEmoji}`)
                            .setCustomId(`${message.id}.mit`),
                    );
                const a = await shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [hatgiongshop2], components: [row, buy1, buy2, buy3] });
                const collector = a.createMessageComponentCollector({
                    filter: filter
                });
                collector.on("collect", async (interaction) => {
                    if (shopinteraction.customId === "shop") return;

                    !interaction.replied && await interaction.deferUpdate();
                    if (interaction.user.id !== message.author.id) {
                        const notForYou =
                            `:x: | **${interaction.user.username}** , không phải nút dành cho bạn!`;
                        return await message.channel.send(notForYou).catch(e => console.log(e));
                    }
                    if (interaction.customId == `${message.id}.ot`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.ot.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.ot.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, client.seed.ot.seedEmoji, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.ot.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Ớt** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.lua`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.lua.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.lua.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, client.seed.lua.seedEmoji, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.lua.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Lúa** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.dautay`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.dautay.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.dautay.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, client.seed.dautay.seedEmoji, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.dautay.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Dâu Tây** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.ngo`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.ngo.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.ngo.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.ngo.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.ngo.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Ngô** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.cachua`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.cachua.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.cachua.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.cachua.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.cachua.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Cà Chua** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.dao`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.dao.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.dao.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.dao.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.dao.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Đào** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.khoaimi`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.khoaimi.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.khoaimi.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.khoaimi.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.khoaimi.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Khoai Mì** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.mia`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.mia.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.mia.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.mia.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.mia.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Mía** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.duagang`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.duagang.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.duagang.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.duagang.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.duagang.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Dưa Gang** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.khoaitay`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.khoaitay.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.khoaitay.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.khoaitay.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.khoaitay.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Khoai Tây** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.carot`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.carot.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.carot.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.carot.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.carot.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Cà Rốt** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.caingot`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.caingot.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.caingot.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.caingot.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.caingot.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Cải Ngọt** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else if (interaction.customId == `${message.id}.mit`) {
                        const errorCash =
                            `${client.e.fail} | **${interaction.user.username}**, bạn không đủ tiền để mua ${client.seed.mit.seedEmoji}!`;
                        const cash = await client.cash(interaction.user.id);
                        const price = client.seed.mit.buy;
                        if (cash < price) return message.channel.send(errorCash);

                        await client.addgrow(message.author.id, `${client.seed.mit.seedEmoji}`, 1, 'hg');
                        await client.tru(message.author.id, price);
                        const success =
                            `${client.seed.mit.seedEmoji} | **${interaction.user.username}**, bạn đã mua **Mít** với giá **${price.toLocaleString("en-us")} Ycoin**!`;
                        await message.channel.send(success).catch(e => console.log(e));
                    }
                    else return;
                });
                shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [hatgiongshop2], components: [row, buy1, buy2, buy3] });

            }
            else if (shoptype === 'cattleshop') {
                !shopinteraction.replied && await shopinteraction.deferUpdate();

                const giasuc = new EmbedBuilder()
                    .setAuthor({ name: `Tiệm Tạp Hóa Yubabe`, iconURL: `https://media.discordapp.net/attachments/1190296537671159828/1190300628619120770/IMG_3656.jpg?ex=65a14cd8&is=658ed7d8&hm=aac9837a1ace082ef06529e008832d08801981e1377f4586ecc8a97ba13998cb&=&format=webp&width=543&height=543`, url: `https://discord.gg/ZbAT9jt5Ak` })
                    .setTitle(`SHOP VẬT NUÔI`)
                    .setDescription(`\`Gõ <YBUY + ID> để mua\`
\`ga\` <:Yu_GaCon:953394343148920902> : **__7.000__ Ycoin**
\`bo\` <:Yu_BoCon:953394492503908362> : **__11.000__ Ycoin**
\`heo\` <:Yu_HeoCon:953396171181817997> : **__15.000__ Ycoin** 
`)
                    .setColor("#303037")
                    .setFooter({ text: "Cảm ơn bạn đã chọn Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
                    .setTimestamp();

                const cattleBtn = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${emoji.cattle.gacon}`)
                            .setCustomId(`gacon`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${emoji.cattle.bocon}`)
                            .setCustomId(`bocon`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${emoji.cattle.heocon}`)
                            .setCustomId(`heocon`),
                    );

                const a = await shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [giasuc], components: [row, cattleBtn] });

                const collector = a.createMessageComponentCollector({
                    filter: interaction => (interaction.isButton()) && interaction.message.id == shopmsg.id,
                });
                collector.on("collect", async (interaction) => {
                    if (shopinteraction.customId === "shop") return;
                    !interaction.replied && await interaction.deferUpdate();

                    if (interaction.user.id !== message.author.id) {
                        const notForYou =
                            `:x: | **${interaction.user.username}** , không phải nút dành cho bạn!`;
                        return await message.channel.send(notForYou).catch(e => console.log(e));
                    }


                    if (interaction.customId === "gacon") await buyfoodCattleOrCattle(client, message, interaction, interaction.customId, cattelPrices[interaction.customId], "cattle");
                    else if (interaction.customId === "bocon") await buyfoodCattleOrCattle(client, message, interaction, interaction.customId, cattelPrices[interaction.customId], "cattle");
                    else if (interaction.customId === "heocon") await buyfoodCattleOrCattle(client, message, interaction, interaction.customId, cattelPrices[interaction.customId], "cattle");
                });

            }
            else if (shoptype === 'cattlefoodshop') {
                !shopinteraction.replied && await shopinteraction.deferUpdate();
                const thucangiasuc = new EmbedBuilder()
                    .setAuthor({ name: `Tiệm Tạp Hóa Yubabe`, iconURL: `https://media.discordapp.net/attachments/1190296537671159828/1190300628619120770/IMG_3656.jpg?ex=65a14cd8&is=658ed7d8&hm=aac9837a1ace082ef06529e008832d08801981e1377f4586ecc8a97ba13998cb&=&format=webp&width=543&height=543`, url: `https://discord.gg/ZbAT9jt5Ak` })
                    .setTitle(`SHOP THỨC ĂN VẬT NUÔI`)
                    .setDescription(`\`Gõ <YBUY + ID> để mua\`
\`thoc\` <:Yu_thoc:953407482884161566> : **__800__ Ycoin**
\`co\` <:Yu_co:953408530474475520> : **__800__ Ycoin**
\`camheo\` <:Yu_camheo:953407482955436062> : **__800__ Ycoin**
`)
                    .setColor("#303037")
                    .setFooter({ text: "Cảm ơn bạn đã chọn Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
                    .setTimestamp();

                const foodBtn = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${emoji.food.thoc}`)
                            .setCustomId(`thoc`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${emoji.food.co}`)
                            .setCustomId(`co`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`${emoji.food.camheo}`)
                            .setCustomId(`camheo`),
                    );

                const a = await shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [thucangiasuc], components: [row, foodBtn] });
                const collector = a.createMessageComponentCollector({
                    filter: filter
                });
                collector.on("collect", async (interaction) => {
                    if (shopinteraction.customId === "shop") return;
                    !interaction.replied && await interaction.deferUpdate();

                    if (interaction.user.id !== message.author.id) {
                        const notForYou =
                            `:x: | **${interaction.user.username}** , không phải nút dành cho bạn!`;
                        return await message.channel.send(notForYou).catch(e => console.log(e));
                    }

                    if (interaction.customId === "thoc") await buyfoodCattleOrCattle(client, message, interaction, interaction.customId, cattelPrices[interaction.customId], "food");
                    else if (interaction.customId === "co") await buyfoodCattleOrCattle(client, message, interaction, interaction.customId, cattelPrices[interaction.customId], "food");
                    else if (interaction.customId === "camheo") await buyfoodCattleOrCattle(client, message, interaction, interaction.customId, cattelPrices[interaction.customId], "food");
                });

            }
            else if (shoptype === 'yushop') {

                !shopinteraction.replied && shopinteraction.deferUpdate();
                const thucangiasuc = new EmbedBuilder()
                    .setAuthor({ name: `Tiệm Tạp Hóa Yubabe`, iconURL: `https://media.discordapp.net/attachments/1190296537671159828/1190300628619120770/IMG_3656.jpg?ex=65a14cd8&is=658ed7d8&hm=aac9837a1ace082ef06529e008832d08801981e1377f4586ecc8a97ba13998cb&=&format=webp&width=543&height=543`, url: `https://discord.gg/ZbAT9jt5Ak` })
                    .setTitle(`SHOP VCOIN !`)
                    .setDescription(`\`Gõ <YBUY + ID> để mua\`
\`28\`<:G_gem_04:982028744057294848> \`[1]\`: **__4__ Vcoin**
\`gb\`<:GEMBOX:982028743952441355> \`[10]\` : **__5__ Vcoin**
\`vgb\`<:VIP_GEMBOX:982028743889543278> \`[6]\` : **__5__ Vcoin**
\`ppp\`<:ProPassport:988093838348410930> : **__10__ Vcoin**
\`vpp\`<:VIPPassport:988093810955411456> : **__20__ Vcoin**
`)
                    .setColor("#303037")
                    .setFooter({ text: "Cảm ơn bạn đã chọn Yubabe", iconURL: `https://media.discordapp.net/attachments/978011752610557972/983700981961343026/919967569287446568.gif` })
                    .setTimestamp();
                await shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [thucangiasuc], components: [row] });
            }
            else if (shoptype == "cancaushop") {
                !shopinteraction.replied && await shopinteraction.deferUpdate();
                const rodembed = new EmbedBuilder()
                    .setAuthor({ name: `Tiệm Tạp Hóa Yubabe`, iconURL: `https://media.discordapp.net/attachments/1190296537671159828/1190300628619120770/IMG_3656.jpg?ex=65a14cd8&is=658ed7d8&hm=aac9837a1ace082ef06529e008832d08801981e1377f4586ecc8a97ba13998cb&=&format=webp&width=543&height=543`, url: `https://discord.gg/ZbAT9jt5Ak` })
                    .setTitle(`SHOP CẦN CÂU !`)
                    .setDescription(`\`Gõ <YBUY + ID> để mua\`
\`cc1\`<:Yu_cancaugo:952585355670995014> : **__${rodPrice.cancaugo.toLocaleString('en-us')}__ Ycoin**
\`cc2\`<:Yu_cancauhiendai:952585355759071283> : **__${rodPrice.cancauhiendai.toLocaleString('en-us')}__ Ycoin**
\`cc3\`<:Yu_cancaupro:952585356006535209> : **${rodPrice.cancaupro.toLocaleString("en-us")} Ycoin**
\`cc4\`<:Yu_cancaudacbiet:952585357143195718> : **${rodPrice.cancaudacbiet.toLocaleString("en-us")} Ycoin (pp)**
`);

                const rodBtn = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`<:Yu_cancaugo:952585355670995014>`)
                            .setCustomId(`cancaugo`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_cancauhiendai:952585355759071283>')
                            .setCustomId(`cancauhiendai`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_cancaupro:952585356006535209>')
                            .setCustomId(`cancaupro`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('<:Yu_cancaudacbiet:952585357143195718>')
                            .setCustomId(`cancaudacbiet`)
                    );
                const a = await shopmsg.edit({ content: `<@${message.author.id}>`, embeds: [rodembed], components: [row, rodBtn] });
                const collector = a.createMessageComponentCollector({
                    filter: filter
                });
                collector.on("collect", async (interaction) => {
                    !interaction.replied && await interaction.deferUpdate();

                    if (interaction.customId === "cancaugo") await buyRod(client, message, interaction, interaction.customId, rodPrice[interaction.customId], 5);
                    else if (interaction.customId === "cancauhiendai") await buyRod(client, message, interaction, interaction.customId, rodPrice[interaction.customId], 6);
                    else if (interaction.customId === "cancaupro") await buyRod(client, message, interaction, interaction.customId, rodPrice[interaction.customId], 7);
                    else if (interaction.customId === "cancaudacbiet") await buyRod(client, message, interaction, interaction.customId, rodPrice[interaction.customId], 8);
                });
            }
            else return;
        });

    }
};

const buyRod = async (client, message, interaction, name, price, type) => {
    const convertName = {
        "cancaugo": "cần câu gỗ",
        "cancauhiendai": "cần câu hiện đại",
        "cancaupro": "cần câu pro",
        "cancaudacbiet": "cần câu đặc biệt",
    };

    const { vip, pro } = await client.provip(message);
    const provip = await vipSchema.findOne({ memberid: message.author.id });
    const cash = client.cash(message.author.id);
    const noMoney = `<:Yu_fail:941589021761634306> | **${interaction.user.username}**, bạn không có đủ tiền mua ${emojis[name]}!`;
    const moneyToPay = price;

    if (type == 8) {
        if (!pro && !vip)
            return await message.channel.send(`<:Yu_fail:941589021761634306> | **${interaction.user.username}**, bạn phải có passport mới mua được ${emojis[name]}`);
    }
    if (cash < moneyToPay) return await message.channel.send(noMoney).catch(e => console.log(e));

    await client.congcancau(message.author.id, 1, emojis[name], type);
    await client.tru(message.author.id, moneyToPay);
    const success =
        `${emojis[name]} | **${interaction.user.username}**, bạn đã mua ${convertName[name]} với giá **${price.toLocaleString("en-us")} Ycoin**!`;
    await message.channel.send(success).catch(e => console.log(e));
};

const buyfoodCattleOrCattle = async (client, message, interaction, name, price, type) => {
    const convertName = {
        "gacon": "gà con",
        "bocon": "bò con",
        "heocon": "heo con",
        "thoc": "thóc",
        "co": "cỏ",
        "camheo": "cám heo"
    };

    let cash = await client.cash(message.author.id);
    const moneyToPay = price;
    const noMoney = `<:Yu_fail:941589021761634306> | **${interaction.user.username}**, bạn không có đủ tiền mua ${emoji.cattle[name] ?? emoji.food[name]}!`;

    if (cash < moneyToPay)
        return message.channel.send(noMoney);

    if (type === "cattle") {
        const existCattle = await client.cattle(message.author.id, name, "cattle");
        if (existCattle > 0)
            return await message.channel.send(`<:Yu_fail:941589021761634306> | **${interaction.user.username}**, bạn chỉ có thể mua được 1 ${emoji.cattle[name]} thôi!`);
        await client.addCattle(message.author.id, name, 1, type);
    }


    if (type === "food") await client.addgrow(message.author.id, name, 1, type, price);

    await client.tru(message.author.id, moneyToPay);
    const success =
        `${emoji.cattle[name] ?? emoji.food[name]} | **${interaction.user.username}**, bạn đã mua ${convertName[name]} với giá **${price.toLocaleString("en-us")} Ycoin**!`;
    await message.channel.send(success).catch(e => console.log(e));
};
