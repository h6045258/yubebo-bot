const invSchema = require('../../models/invSchema')
const vipSchema = require('../../models/vipSchema')
const emojis = require("../../configs/emojis.json");
const rodPrice = require("../../configs/rodPrices.json");
const emoji = require("../../configs/config.json");
const cattelPrices = require("../../configs/cattlePrices.json");

module.exports = {
    name: "buy",
    description: ["Mua vật phẩm trong Shop"],
    aliases: ["mua"],
    usage: ["{prefix}buy <id> [soluong]"],
    cooldown: 3,
    category: "Inventory",
    run: async (client, message, args, prefix, lang) => {
        let member = message.author
        let purchase = args[0]
        let cash = await client.cash(member.id)
        let yucoin = await client.yucoin(member.id)
        let quantity = parseInt(args[1]) || 1;
        if (isNaN(quantity) || quantity < 1) return message.reply("Bạn nhập không hợp lệ");

        const provip = await vipSchema.findOne({ memberid: message.author.id })
        const {vip, pro} = await client.provip(message);
        
        let aliasesArgs = {
            "1": "ot",
            "2": "lua",
            "3": "carot",
            '4': "cachua",
            "5": "ngo",
            "6": "khoaimi",
            "7": "khoaitay",
            "8": "caingot",
            "9": "mia",
            "10": "dao",
            "11": "dautay",
            "12": "duagang",
            "13": "mit",
            "ot": "ot",
            "lua": "lua",
            "carot": "carot",
            'cachua': "cachua",
            "ngo": "ngo",
            "khoaimi": "khoaimi",
            "khoaitay": "khoaitay",
            "caingot": "caingot",
            "mia": "mia",
            "dao": "dao",
            "dautay": "dautay",
            "duagang": "duagang",
            "mit": "mit",
        }
        let convertA = aliasesArgs[args[0]]
        let arrHG = {
            "ot": client.seed.ot.emoji,
            "lua": client.seed.lua.emoji,
            "dautay": client.seed.dautay.emoji,
            "ngo": client.seed.ngo.emoji,
            "bap": client.seed.ngo.emoji,
            "cachua": client.seed.cachua.emoji,
            "dao": client.seed.dao.emoji,
            "khoaimi": client.seed.khoaimi.emoji,
            "mia": client.seed.mia.emoji,
            "khoaitay": client.seed.khoaitay.emoji,
            "duagang": client.seed.duagang.emoji,
            "carot": client.seed.carot.emoji,
            "caingot": client.seed.caingot.emoji,
            "mit": client.seed.mit.emoji,
        }
        let nameHG = false;
        if (convertA) {
            nameHG = arrHG[convertA];
        }

        if (!purchase) {
            errorNoPurchase =
                `<:Yu_fail:941589021761634306> | **${member.username}**, bạn muốn mua gì ?`
            return await message.channel.send(errorNoPurchase).catch(e => console.log(e))
        }
        else if (purchase == '001' || purchase == 'nhanc' || purchase == 'nhanco') {
            if (cash < 25000) {
                let errorCash = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Cỏ!`
                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            const NhanCo = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhanco:951133679546159214>` })
            if (NhanCo) {
                let errorHad = `Bạn đã sở hữu nhẫn Cỏ rồi!`
                return await message.channel.send(errorHad).catch(e => console.log(e))
            }
            else {
                let price = 0
                let luck = 0
                if (!pro && !vip) luck = Math.floor(Math.random() * 10)
                if (pro) luck = Math.floor(Math.random() * 10) - 2
                if (vip) luck = Math.floor(Math.random() * 10) - 4
                if (luck == 1) price = Math.floor(Math.random() * 5000)
                if (luck !== 1) price = -(Math.floor(Math.random() * 5000))
                const muanhanco = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanco:951133679546159214>`, quanlity: 1, type: `ring`, price: (25000 + price) })
                await muanhanco.save()
            }
            client.tru(member.id, 25000)
            const success = `<:Yu_nhanco:951133679546159214> | **${member.username}**, bạn đã mua **Nhẫn Cỏ** với giá **25,000 Ycoin**!`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == '002' || purchase == 'nhanb' || purchase == 'nhanbac') {
            if (cash < 500000) {
                let errorCash = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Bạc!`
                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            const NhanBac = await invSchema.findOne({ memberid: `${member.id}`, name: '<:Yu_nhanbac:941435162728730675>' })
            if (NhanBac) {
                let errorHad = `Bạn đã sở hữu nhẫn Bạc rồi!`
                return await message.channel.send(errorHad).catch(e => console.log(e))
            }
            else {
                let price = 0
                let luck = 0
                if (!pro && !vip) luck = Math.floor(Math.random() * 10)
                if (pro) luck = Math.floor(Math.random() * 10) - 2
                if (vip) luck = Math.floor(Math.random() * 10) - 4
                if (luck <= 3) price = Math.floor(Math.random() * 6200)
                if (luck > 3) price = -(Math.floor(Math.random() * 6200))
                const muanhanbac = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanbac:941435162728730675>`, quanlity: 1, type: `ring`, price: (500000 + price) })
                await muanhanbac.save()
            }
            client.tru(member.id, 500000)
            const success = `<:Yu_nhanbac:941435162728730675> | **${member.username}**, bạn đã mua **Nhẫn Bạc** với giá **500,000 Ycoin!**`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == '003' || purchase == 'nhanv' || purchase == 'nhanvang') {
            if (cash < 1000000) {
                let errorCash =
                    `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Vàng!`
                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            const NhanVang = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhanvang:941435163181727824>` })
            if (NhanVang) {
                let errorHad =
                    `Bạn đã sở hữu nhẫn Vàng rồi!`

                return await message.channel.send(errorHad).catch(e => console.log(e))
            }
            else {
                let price = 0
                let luck = 0
                if (!pro && !vip) luck = Math.floor(Math.random() * 10)
                if (pro) luck = Math.floor(Math.random() * 10) - 2
                if (vip) luck = Math.floor(Math.random() * 10) - 4
                if (luck <= 3) price = Math.floor(Math.random() * 50000)
                if (luck > 3) price = -(Math.floor(Math.random() * 50000))
                const muanhanvang = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanvang:941435163181727824>`, quanlity: 1, type: `ring`, price: (1000000 + price) })
                await muanhanvang.save()
            }
            await client.tru(member.id, 1000000)
            const success =
                `<:Yu_nhanvang:941435163181727824> | **${member.username}**, bạn đã mua **Nhẫn Vàng** với giá **1,000,000 Ycoin!**`
            return await message.channel.send(success)
        }
        else if (purchase == '004' || purchase == 'nhankc' || purchase == 'nhankimcuong') {
            if (cash < 10000000) {
                let errorCash =
                    `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Kim Cương!`

                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            const NhanKimCuong = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhankimcuong:941435160883265556>` })
            if (NhanKimCuong) {
                let errorHad =
                    `Bạn đã sở hữu nhẫn Kim Cương rồi!`
                return await message.channel.send(errorHad).catch(e => console.log(e))
            } else {
                let price = 0
                let luck = 0
                if (!pro && !vip) luck = Math.floor(Math.random() * 10)
                if (pro) luck = Math.floor(Math.random() * 10) - 2
                if (vip) luck = Math.floor(Math.random() * 10) - 4
                if (luck == 1) price = Math.floor(Math.random() * 300000)
                if (luck !== 1) price = -(Math.floor(Math.random() * 300000))
                const muanhankimcuong = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhankimcuong:941435160883265556>`, quanlity: 1, type: `ring`, price: (10000000 + price) })
                await muanhankimcuong.save()
            }
            client.tru(member.id, 10000000)
            const success =
                `<:Yu_nhankimcuong:941435160883265556> | **${member.username}**, bạn đã mua **Nhẫn Kim Cương** với giá **10,000,000 Ycoin!**`
            return await message.channel.send(success)
        }
        else if (purchase == '005' || purchase == 'nhanvkc' || purchase == 'nhanvangkimcuong') {
            if (cash < 25000000) {
                const errorCash =
                    `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Đôi Hột Soàn!`
                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            const NhanVangKimCuong = await invSchema.findOne({ memberid: `${member.id}`, name: `<:Yu_nhanvangkc:951586992897024060>` })
            if (NhanVangKimCuong) {
                const HAd =
                    `Bạn đã sở hữu nhẫn đôi Kim Cương rồi!`
                return await message.channel.send(HAd).catch(e => console.log(e))
            } else {
                let price = 0
                let luck = 0
                if (!pro && !vip) luck = Math.floor(Math.random() * 10)
                if (pro) luck = Math.floor(Math.random() * 10) - 2
                if (vip) luck = Math.floor(Math.random() * 10) - 4
                if (luck == 1) price = Math.floor(Math.random() * 2500000)
                if (luck !== 1) price = -(Math.floor(Math.random() * 2500000))
                const muanhanvkimcuong = new invSchema({ memberid: `${member.id}`, name: `<:Yu_nhanvangkc:951586992897024060>`, quanlity: 1, type: `ring`, price: (25000000 + price) })
                await muanhanvkimcuong.save()
            }
            client.tru(member.id, 25000000)
            const success =
                `<:Yu_nhanvangkc:951586992897024060> | **${member.username}**, bạn đã mua **Nhẫn Đôi Kim Cương** với giá **25,000,000 Ycoin**!`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == '006' || purchase == 'nhanvangkim') {
            if (cash < 10000000 && vip !== true) {
                let errorCash =
                    `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Vàng Kim hoặc chưa có passport!`
                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            if (!provip) {
                let errorCash =
                    `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Vàng Kim hoặc chưa có passport!`
                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            const NhanKimCuong = await invSchema.findOne({ memberid: `${member.id}`, name: `<:yb_ring10:1248829192905424926>` })
            if (NhanKimCuong) {
                let errorHad =
                    `Bạn đã sở hữu nhẫn Vàng Kim rồi!`
                return await message.channel.send(errorHad).catch(e => console.log(e))
            } else {
                let price = 0
                let luck = 0
                if (!pro && !vip) luck = Math.floor(Math.random() * 10)
                if (pro) luck = Math.floor(Math.random() * 10) - 2
                if (vip) luck = Math.floor(Math.random() * 10) - 4
                if (luck == 1) price = Math.floor(Math.random() * 300000)
                if (luck !== 1) price = -(Math.floor(Math.random() * 300000))
                const muanhankimcuong = new invSchema({ memberid: `${member.id}`, name: `<:yb_ring10:1248829192905424926>`, quanlity: 1, type: `ring`, price: (10000000) })
                await muanhankimcuong.save()
            }
            client.tru(member.id, 10000000)
            const success =
                `<:yb_ring10:1248829192905424926> | **${member.username}**, bạn đã mua **Nhẫn Vàng Kim** với giá **10,000,000 Ycoin!**`
            return await message.channel.send(success)
        }
        else if (purchase == '007' || purchase == 'nhanvangruby') {
            if (cash < 100000000) {
                let errorCash =
                    `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không đủ tiền mua Nhẫn Vàng Ruby!`
                return await message.channel.send(errorCash).catch(e => console.log(e))
            }
            const NhanKimCuong = await invSchema.findOne({ memberid: `${member.id}`, name: `<:yb_ring100:1248828071222710332>` })
            if (NhanKimCuong) {
                let errorHad =
                    `Bạn đã sở hữu nhẫn Vàng Ruby rồi!`
                return await message.channel.send(errorHad).catch(e => console.log(e))
            } else {
                let price = 0
                let luck = 0
                if (!pro && !vip) luck = Math.floor(Math.random() * 10)
                if (pro) luck = Math.floor(Math.random() * 10) - 2
                if (vip) luck = Math.floor(Math.random() * 10) - 4
                if (luck == 1) price = Math.floor(Math.random() * 100000)
                if (luck !== 1) price = -(Math.floor(Math.random() * 100000))
                const muanhankimcuong = new invSchema({ memberid: `${member.id}`, name: `<:yb_ring100:1248828071222710332>`, quanlity: 1, type: `ring`, price: (100000000 + price) })
                await muanhankimcuong.save()
            }
            client.tru(member.id, 100000000)
            const success =
                `<:yb_ring100:1248828071222710332> | **${member.username}**, bạn đã mua **Nhẫn Vàng Ruky** với giá **100,000,000 Ycoin!**`
            return await message.channel.send(success)
        }
        else if (nameHG) {
            let hg = client.seed[convertA]["seedEmoji"]
            let soluong = parseInt(args[1])
            const errorSoluong =
                `:x: | **${message.author.username}** Bạn không thể nhập số âm !`
            if (soluong < 0) return await message.channel.send(errorSoluong).catch(e => console.log(e))
            if (soluong > 20) soluong = 20
            if (isNaN(soluong)) soluong = 1
            let price = client.seed[convertA]["buy"]
            const cash = await client.cash(message.author.id)
            const errorCash =
                `Bạn không đủ tiền!`
            if (price * soluong > cash) return await message.channel.send(errorCash).catch(e => console.log(e))
            await client.addgrow(message.author.id, hg, soluong, 'hg', price)
            await client.tru(message.author.id, price * soluong)
            const success =
                `<:Yu_field:953050619558645820> | **${message.author.username}**, bạn đã mua **${soluong}** hạt ${hg} để trồng!`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == '28') {
            console.log(member.username)
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua <:G_gem_04:982028744057294848>!`
            if (yucoin < 4) return await message.channel.send(noMoney).catch(e => console.log(e))
            await client.addgem(message.author.id, "<:G_gem_04:982028744057294848>", 1, 4)
            await client.truY(member.id, 4)
            const success =
                `<:G_gem_04:982028744057294848> | **${member.username}**, bạn đã mua thành công 1 viên KingStone <:G_gem_04:982028744057294848>`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == 'gb') {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua <:GEMBOX:982028743952441355>!`
            if (yucoin < 5) return await message.channel.send(noMoney).catch(e => console.log(e))
            await client.addgem(member.id, `<:GEMBOX:982028743952441355>`, "10", 0)
            await client.truY(member.id, 5)
            const success =
                `<:GEMBOX:982028743952441355> | **${member.username}**, bạn đã mua thành công 10 túi gembox <:GEMBOX:982028743952441355>`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == 'vgb') {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua <:VIP_GEMBOX:982028743889543278>!`
            if (yucoin < 5) return await message.channel.send(noMoney).catch(e => console.log(e))
            await client.addgem(member.id, `<:VIP_GEMBOX:982028743889543278>`, "6", 0)
            await client.truY(member.id, 5)
            const success =
                `<:VIP_GEMBOX:982028743889543278> | **${member.username}**, bạn đã mua thành công 6 túi vip gembox <:VIP_GEMBOX:982028743889543278>`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == 'ppp') {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua <:ProPassport:988093838348410930>!`
            if (yucoin < 10) return await message.channel.send(noMoney).catch(e => console.log(e))
            let ba = await invSchema.findOne({
                memberid: member.id,
                name: "<:ProPassport:988093838348410930>",
            })
            if (!ba) {
                const add = new invSchema({
                    memberid: member.id,
                    name: "<:ProPassport:988093838348410930>",
                    quanlity: "1",
                    type: `passport`,
                    price: 0
                })
                await add.save()
            } else {
                ba.quanlity += "1"
                await ba.save()
            }
            await client.truY(member.id, 10)
            const success =
                `<:ProPassport:988093838348410930> | **${member.username}**, bạn đã mua thành công 1 Pro Passport <:ProPassport:988093838348410930>`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == 'vpp') {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua <:VIPPassport:988093810955411456>!`
            if (yucoin < 20) return await message.channel.send(noMoney).catch(e => console.log(e))
            let ba = await invSchema.findOne({
                memberid: member.id,
                name: "<:VIPPassport:988093810955411456>",
            })
            if (!ba) {
                const add = new invSchema({
                    memberid: member.id,
                    name: "<:VIPPassport:988093810955411456>",
                    quanlity: "1",
                    type: `passport`,
                    price: 0
                })
                await add.save()
            } else {
                ba.quanlity += "1"
                await ba.save()
            }
            await client.truY(member.id, 20)
            const success =
                `<:VIPPassport:988093810955411456> | **${member.username}**, bạn đã mua thành công 1 Vip Passport <:VIPPassport:988093810955411456>`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == "cc1" || purchase == "cancaugo") {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua ${emojis.cancaugo}!`;
            const moneyToPay = rodPrice.cancaugo * quantity;
            
            if (cash < moneyToPay) return await message.channel.send(noMoney).catch(e => console.log(e))
            await client.congcancau(message.author.id, quantity, emojis.cancaugo, 5);
            await client.tru(message.author.id, moneyToPay);

            const success =
                `${emojis.cancaugo} | **${member.username}**, bạn đã mua thành công ${quantity} cần câu gỗ ${emojis.cancaugo}`
            await message.channel.send(success).catch(e => console.log(e))
            
        }
        else if (purchase == "cc2" || purchase == "cancauhiendai") {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua ${emojis.cancauhiendai}!`;
            const moneyToPay = rodPrice.cancauhiendai * quantity;

            if (cash < moneyToPay) return await message.channel.send(noMoney).catch(e => console.log(e))
            await client.congcancau(message.author.id, quantity, emojis.cancauhiendai, 6);
            await client.tru(message.author.id, moneyToPay);

            const success =
                `${emojis.cancauhiendai} | **${member.username}**, bạn đã mua thành công ${quantity} cần câu hiện đại ${emojis.cancauhiendai}`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == "cc3" || purchase == "cancaupro") {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua ${emojis.cancaupro}!`;
            const moneyToPay = rodPrice.cancaupro * quantity;

            if (cash < moneyToPay) return await message.channel.send(noMoney).catch(e => console.log(e))
            await client.congcancau(message.author.id, quantity, emojis.cancaupro, 7);
            await client.tru(message.author.id, moneyToPay);

            const success =
                `${emojis.cancaupro} | **${member.username}**, bạn đã mua thành công ${quantity} cần câu pro ${emojis.cancaupro}`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == "cc4" || purchase == "cancaudacbiet") {
            const noMoney = `<:Yu_fail:941589021761634306> | **${member.username}**, bạn không có đủ tiền mua ${emojis.cancaudacbiet} hoặc không có passport!`;
            const moneyToPay = rodPrice.cancaudacbiet * quantity;
            if (cash < moneyToPay || (!vip && !pro)) return await message.channel.send(noMoney).catch(e => console.log(e))
            await client.congcancau(message.author.id, quantity, emojis.cancaudacbiet, 8);
            await client.tru(message.author.id, moneyToPay);

            const success =
                `${emojis.cancaudacbiet} | **${member.username}**, bạn đã mua thành công ${quantity} cần đặc biệt ${emojis.cancaudacbiet}`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (purchase == "thoc") {
            await buyfood(client, message, purchase, cattelPrices.thoc, quantity);
        }
        else if (purchase == "co") {
            await buyfood(client, message, purchase, cattelPrices.co, quantity);
        }
        else if (purchase == "camheo") {
            await buyfood(client, message, purchase, cattelPrices.camheo, quantity);
        }
    }
}

const buyfood = async (client, message, name, price, quantity) => {
    const convertName = {
        "thoc": "thóc",
        "co": "cỏ",
        "camheo": "cám heo"
    }

    let cash = await client.cash(message.author.id);
    const moneyToPay = price * quantity;
    const noMoney = `<:Yu_fail:941589021761634306> | **${message.member.displayName}**, bạn không có đủ tiền mua ${emoji.food[name]}!`;

    if (cash < moneyToPay)
        return message.channel.send(noMoney);

    await client.addgrow(message.author.id, name, quantity, "food", price); 

    await client.tru(message.author.id, moneyToPay);    
    const success = 
        `${emoji.food[name]} | **${message.member.displayName}**, bạn đã mua ${quantity} ${convertName[name]} với giá **${moneyToPay.toLocaleString("en-us")} Ycoin**!`
    await message.channel.send(success).catch(e => console.log(e))
}
