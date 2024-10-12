module.exports = async (client) => {

    const bj = require('../configs/blackjack.json');    
    client.blackjack = bj;

    const buffSchema = require('../models/buffSchema')
    const itemSchema = require('../models/itemSchema')
    const invSchema = require('../models/invSchema');
    const rodSchema = require("../models/rodSchema");
    const trungThuModel = require("../models/trungThuSchema"); 

    client.seed = require("../configs/plants.json");
    client.thunuoi = require("../configs/cattles.json");

    const midAutumnReward = require("../configs/trungThuItem.json");
    client.trungthu = (name) => {
        return midAutumnReward[name];
    }

    client.i = (name) => {
        const emojis = {
            gembox: "<:GEMBOX:982028743952441355>",
            progembox: "<:PRO_GEMBOX:982028744057298964>",
            vipgembox: "<:VIP_GEMBOX:982028743889543278>",
            congrats: "<a:yl_ga:901921067944271912>",
            iuem: "<a:Yiuem:1135305522132811827>",
            loadbar: "<a:loadingbar:1136069277288501298>",
            done: "<:checked:1183702384837410837>",
            fail: "<:cancel:1183702388616482918>",
            arrow: "<a:Yu_MuiTen:953754849487499316>",
            coin: "<:Yu_Ycoin:953323682246316082>",
            ngoisao: "<a:Yl_ngoisaohivong:919968345418268714>",
            vp: "<:VIPPassport:988093810955411456>",
            pp: "<:ProPassport:988093838348410930>"
        }
        return emojis[name]
    }
    client.iGem = (name) => {
        const emojis = [
            "<:C_gem_01:982028743608533022>",
            "<:C_gem_02:982028743537209424>",
            "<:C_gem_03:982028743914696704>",
            "<:C_gem_04:982028743570755624>",

            "<:U_gem_01:982028744204103810>",
            "<:U_gem_02:982028744061505606>",
            "<:U_gem_03:982028743650463795>",
            "<:U_gem_04:982028744187326494>",

            "<:R_gem_01:982028744107655198>",
            "<:R_gem_02:982028744124428428>",
            "<:R_gem_03:982028743948247110>",
            "<:R_gem_04:982028743822426152>",

            "<:SR_gem_01:982028743960854598>",
            "<:SR_gem_02:982028743956652072>",
            "<:SR_gem_03:982028744124411924>",
            "<:SR_gem_04:982028743981817908>",

            "<:E_gem_01:982028743595941938>",
            "<:E_gem_02:982028743679827968>",
            "<:E_gem_03:982028743805648926>",
            "<:E_gem_04:982028743688212520>",

            "<:P_gem_01:982028744191529010>",
            "<:P_gem_02:982028743713366066>",
            "<:P_gem_03:982028743960830032>",
            "<:P_gem_04:982028743893721178>",

            "<:G_gem_01:982028743629484082>",
            "<:G_gem_02:982028743646265364>",
            "<:G_gem_03:982028743537217588>",
            "<:G_gem_04:982028744057294848>",
        ]
        if (parseInt(name)) return emojis[parseInt(name - 1)]
        else return false;
    }
    client.item = async (id, method, name, amount, type) => {
        let item = await itemSchema.findOne({ id: id, name: name })
        if (method == null) {
            if (!item) {
                let newitem = new itemSchema({
                    id: id,
                    name: name,
                    quanlity: amount,
                    type: type
                })
                await newitem.save()
                return item = amount
            }
            else return item = item.quanlity
        }
        else if (method == `cong`) {
            if (amount == null) amount = 1
            if (!item) {
                let newitem = new itemSchema({
                    id: id,
                    name: name,
                    quanlity: amount,
                    type: type
                })
                await newitem.save()
            }
            else {
                if (amount == null) amount = 1
                item.quanlity += amount
                await item.save()
                return item = item.quanlity
            }

        }
        else if (method == `tru`) {
            if (!item) return item = 0
            if (amount == null) amount = 1
            item.quanlity -= amount
            await item.save()
            return item = item.quanlity
        }
        return item
    }
    //xem buff
    client.buff = async (memberid, type) => {
        const data = await buffSchema.findOne({ memberid: memberid, type: type });
        if (!data) return 0;
        return data.quanlity;
    }
    //add buff
    client.addbuff = async (memberid, type, quanlity, heso) => {
        let data = await buffSchema.findOne({ memberid: memberid, type: type })
        if (data) {
            data.quanlity += quanlity;
            data.heso = heso
        } else {
            data = new buffSchema({ memberid: memberid, quanlity: quanlity, type: type, heso: heso })
        }
        await data.save();
    }
    //trừ buff
    client.trubuff = async (memberid, type, quanlity) => {
        let data = await buffSchema.findOne({ memberid: memberid, type: type })
        if (data) {
            data.quanlity -= quanlity;
        } else {
            return
        }
        await data.save();
    }
    client.CI = (id) => {
        const list = {
            "001": "<:Yu_cancaugo:952585355670995014>",
            "002": "<:Yu_cancauhiendai:952585355759071283>",
            "003": "<:Yu_cancaupro:952585356006535209>"
        }
        if (list[id]) return list[id]
    }
    ///////////////Custom////////////////
    client.custom = async (id, types, args) => {
        let res = ""
        const customSchema = require("../models/customSchema")
        if (args) {
            const userId = args[0]
            const typed = args[1]
            let custom = await customSchema.findOne({ authorid: userId, type: typed })
            if (!custom) {
                let newcus = new customSchema({
                    authorid: userId,
                    content: args.slice(2).join(" "),
                    type: typed
                })
                await newcus.save()
            }
            else {
                custom.content = args.slice(2).join(" ")
                await custom.save()
            }
        }
        else {
            let custom = await customSchema.findOne({ authorid: id, type: types })
            if (!custom) return res = false
            else if (custom) res = custom.content
            return res
        }
    }
    /* client.random = async (id, method, authors, authorURLs, titles, descriptions, thumbnails, images, colors, footers, footerURLs, content) => {
         let res = ""
         const randomSchema = require("../models/randomSchema")
         const custom = await randomSchema.findOne({ authorid: id })
 
         if (!custom) {
             let newCustom = new randomSchema({
                 authorid: id,
                 author: authors,
                 authorURL: authorURLs,
                 title: titles,
                 description: descriptions,
                 thumbnail: thumbnails,
                 image: images,
                 color: colors,
                 footer: footers,
                 footerURL: footerURLs,
             })
             await newCustom.save()
         } else {
             custom[method] = content
             await custom.save()
         }
     } */
    /////////////////////////////////////
    const gemSchema = require('../models/gemSchema')
    client.gem = async (memberid, typeS) => {
        let result; //đặt biến thứ cấp
        const data = await gemSchema.findOne({ memberid: memberid, typeS: typeS });
        if (!data) result = 0;
        else result = data.quanlity
        return result;
    }
    //add ngọc
    client.addgem = async (memberid, types, quanlity, type) => {
        let data = await gemSchema.findOne({ memberid: memberid, typeS: types })
        if (data) {
            data.quanlity += quanlity;
            data.type = type
        } else {
            data = new gemSchema({ memberid: memberid, typeS: types, quanlity: quanlity, type: type })
        }
        await data.save();
    }

    //trừ ngọc
    //trừ ngọc
    client.trugem = async (memberid, type, quanlity) => {
        let data = await gemSchema.findOne({ memberid: memberid, typeS: type })
        if (data) {
            data.quanlity -= quanlity;
        } else {
            return
        }
        await data.save();
    }
    /////////////////////////////////////
    /////////////Economy Cash////////////
    const bankSchema = require('../models/bankSchema')
    const moneySchema = require('../models/moneySchema')
    //sum
    client.getTotalMoneyInDatabase = async () => {
        let totalMoney = 0;
        let count = 0;
    
        // Lặp qua từng người dùng trong cơ sở dữ liệu `cash`
        const cashUsers = await moneySchema.find();
        count += cashUsers.length;
        for (const user of cashUsers) {
            const cashData = user.coins || 0;
            totalMoney += cashData;
        }
        console.log(`Đã đếm qua ${count} bản ghi trong cơ sở dữ liệu cash.`);
    
        // Lặp qua từng người dùng trong cơ sở dữ liệu `bank`
        const bankUsers = await bankSchema.find();
        count += bankUsers.length;
        for (const user of bankUsers) {
            const bankData = user.coins || 0;
            totalMoney += bankData;
        }
        console.log(`Đã đếm qua ${bankUsers.length} bản ghi trong cơ sở dữ liệu bank.`);
        console.log(`Tổng số bản ghi đã đếm: ${count}.`);
    
        return totalMoney;
    }
    //Check tiền
    client.cash = async (id) => {
        const data = await moneySchema.findOne({ id });
        if (!data) return 0;
        return data.coins
    }
    // add tiền
    client.cong = async (id, coins) => {
        let data = await moneySchema.findOne({ id: id })
        if (data) {
            data.coins += coins;
            data.save();

        } else {
            data = new moneySchema({ id: id, coins: coins })
            data.save();

        }
    }
    // trừ tiền
    client.tru = async (id, coins) => {
        let data = await moneySchema.findOne({ id: id })
        if (data) {
            data.coins -= coins;
            data.save();

        } else {
            data = new moneySchema({ id: id, coins: 0 })
            data.save();

        }
    }
    client.truY = async (id, coins) => {
        let data = await bankSchema.findOne({ id: id })
        if (data) {
            data.yucoins -= coins;
            data.save();
        }
        else {
            data = new bankSchema({ id: id, coins: 0, yucoins: 0 })
            data.save();
        }
    }
    // gửi tiền
    client.tietkiem = async (id, coins) => {
        let data = await bankSchema.findOne({ id: id })
        if (data) {
            data.coins += coins;
        } else {
            data = new bankSchema({ id: id, coins: +coins })
        }
        await data.save();
    }
    // rút tiền
    client.ruttien = async (id, coins) => {
        let data = await bankSchema.findOne({ id: id })
        if (data) {
            data.coins -= coins;
        } else {
            data = new bankSchema({ id, coins: -coins })
        }
        await data.save();
    }
    // check bank
    client.bank = async (id) => {
        const data = await bankSchema.findOne({ id });
        if (!data) return 0;
        return data.coins;
    }
    client.yucoin = async (id) => {
        const data = await bankSchema.findOne({ id });
        if (!data) return 0;
        return data.yucoins;
    }


    ////////////
    const vipSchema = require('../models/vipSchema')
    client.activatepassport = async (id, type) => {
        let data = await vipSchema.findOne({ memberid: id, type: type })
        if (data) {
            data.used = Date.now();
        } else {
            data = new vipSchema({ memberid: id, type: type, used: Date.now() })
        }
        await data.save();
    }
    //Check thời gian bắt đầu sử dụng 
    client.datepassport = async (id) => {
        const data = await vipSchema.findOne({ memberid: `${id}` });
        if (!data) return null;
        return data.used;
    };
    //Check xem passport đã hết hạn chưa 
    client.checkpassport = function (date) {
        let timeout = date + 2629743830;
        let temp = Math.trunc(((timeout - Date.now())) / 1000);
        let seconds = temp % 60;
        temp = Math.trunc(temp / 60);
        let minutes = temp % 60
        temp = Math.trunc(temp / 60);
        let hours = temp % 24;
        temp = Math.trunc(temp / 24);
        let days = temp;

        /* If there is no data */
        if (!date) return { after: true, s: seconds, m: minutes, h: hours, d: days };
        let diff = Date.now() - timeout
        /* Not past midnight */
        if (diff <= 0) return { after: false, diff: diff, s: seconds, m: minutes, h: hours, d: days };
        else return { after: true, diff: diff, withinDay: (overrideWithinDay || false), s: seconds, m: minutes, h: hours, d: days };
    };
    //check loại passport đang sử dụng
    client.provip = async (message) => {
        let vip = false
        let pro = false
        const provip = await vipSchema.findOne({ memberid: message.author.id })
        if (provip) {
            const date = await client.datepassport(message.author.id)
            const status = await client.checkpassport(date)
            let end = status.after
            if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true
            if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true
            if (end) {
                await vipSchema.deleteOne({ memberid: message.author.id });
                await message.reply(`Passport của bạn đã hết hạn! Cảm ơn bạn đã đồng hành cùng tôi trong suốt tháng qua! <3`);
            }
        }
        return { vip: vip, pro: pro }
    }
    client.provip2 = async (client, id) => {
        let vip = false;
        let pro = false;
        const provip = await vipSchema.findOne({ memberid: id });
        if (provip) {
            const date = await client.datepassport(id);
            const status = await client.checkpassport(date);
            let end = status.after;
            if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true;
            if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true;
        }
        return { vip: vip, pro: pro };
    };

    /////////////////////////////////////
    client.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const cooldownSchema = require('../models/cooldownSchema')
    const overrideWithinDay = false
    /////////Time Out và Cooldown////////
    ///// Chuyển đổi timestamp
    client.timeStamp = function (cooldownTimestamp) {
        // Calculate the future timestamp in seconds by dividing cooldownTimestamp by 1000
        if (cooldownTimestamp < 0) cooldownTimestamp = -cooldownTimestamp
        const futureTimeInSeconds = Math.floor(cooldownTimestamp / 1000);

        // Calculate the number of days, hours, minutes, and seconds
        const seconds = futureTimeInSeconds % 60;
        const minutes = Math.floor((futureTimeInSeconds / 60) % 60);
        const hours = Math.floor((futureTimeInSeconds / 3600) % 24);
        const days = Math.floor(futureTimeInSeconds / (3600 * 24));

        let secondsString = seconds > 0 ? seconds + "s" : "00s"
        let minutesString = minutes > 0 ? minutes : "00"
        let hoursString = hours > 0 ? hours : "0"
        const timeString = `${days > 0 ? days + " ngày " : ""}${hoursString + " giờ "} ${minutesString + " phút "}${secondsString}`;
        const timeShort = `${days > 0 ? days + " ngày " : ""}${hours > 0 ? hoursString + "h" : ""}${minutes > 0 ? minutesString + "p" : "00p"}${secondsString}`;
        const timeShortest = `${days > 0 // nếu có ngày
            ? days + "d" // ngày lớn hơn 0
            : "" // ngày bằng 0
            }${days > 0
                ? hours > 0 // nếu có ngày 
                    ? hours + ":" // giờ > 0
                    : "00:" // giờ == 0
                : hours > 0 // nếu không ngày
                    ? hours + ":" // giờ > 0
                    : "" // giờ == 0
            }${hours > 0
                ? minutes > 0 // nếu có giờ
                    ? minutes + ":" // phút lớn hơn 0
                    : "00:" // phút == 0
                : ""}${seconds > 0 ? seconds + "s" : "00s"}`; // giây luôn luôn được thể hiện

        return {
            d: days,
            h: hours,
            m: minutes,
            s: seconds,
            string: {
                long: timeString,
                short: timeShort,
                shortest: timeShortest,
            },
        };
    };
    //Đặt lần cuối dùng lệnh
    client.timeout = async (id, cmd) => {
        let data = await cooldownSchema.findOne({ key: `${id}.${cmd}` })
        if (data) {
            data.cooldown = Date.now();
        }
        else {
            data = new cooldownSchema({ key: `${id}.${cmd}`, cooldown: Date.now() })
        }
        data.save();
    }
    //Check lần cuối dùng lệnh
    client.cd = async (id, cmd) => {
        const data = await cooldownSchema.findOne({ key: `${id}.${cmd}` });
        if (!data) return null;
        return data.cooldown;
    }
    //Check đã đủ thời gian từ khi gõ lệnh
    client.checkcd = function (date, cd) {
        let timeout = date + cd;
        let temp = Math.trunc(((timeout - Date.now())) / 1000);
        let seconds = temp % 60;
        temp = Math.trunc(temp / 60);
        let minutes = temp % 60
        temp = Math.trunc(temp / 60);
        let hours = temp % 24;
        temp = Math.trunc(temp / 24);
        let days = temp;

        /* If there is no data */
        if (!date) return { after: true, s: seconds, m: minutes, h: hours, d: days };
        let diff = Date.now() - timeout
        /* Not past midnight */
        if (diff <= 0) return { after: false, diff: diff, s: seconds, m: minutes, h: hours, d: days };
        else return { after: true, diff: diff, withinDay: (overrideWithinDay || false), s: seconds, m: minutes, h: hours, d: days };
    }
    //Check đã qua ngày mới từ lúc gõ lệnh chưa
    client.newday = async function (date) {
        let now = new Date(Date.now() + 25200000);
        let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(Date.now() + 25200000));

        /* Calculate time until midnight */
        let temp = Math.trunc(((midnight - now) + 86400000) / 1000);
        let seconds = temp % 60;
        temp = Math.trunc(temp / 60);
        let minutes = temp % 60
        temp = Math.trunc(temp / 60);
        let hours = temp % 24;
        temp = Math.trunc(temp / 24);
        let days = temp;

        /* If there is no data */
        if (!date) return { after: true, seconds: seconds, minutes: minutes, hours: hours, days: days, now };

        let pDate = new Date(date + 25200000);
        let diff = midnight - pDate;

        /* Not past midnight */
        if (diff <= 0) return { after: false, diff: diff, seconds: seconds, minutes: minutes, hours: hours, days: days, now };

        /* Within 1 day */
        else if (diff <= 172810000) return { after: true, diff: diff, withinDay: true, seconds: seconds, minutes: minutes, hours: hours, days: days, now };

        /* Over 1 full day */
        else return { after: true, diff: diff, withinDay: (overrideWithinDay || false), seconds: seconds, minutes: minutes, hours: hours, days: days, now };
    }
    client.sonho = function toSmallNum(array, count, digits) {
        var result = '';
        var num = count;
        if (count < 0) count = 0;
        for (i = 0; i < digits; i++) {
            var digit = count % 10;
            count = Math.trunc(count / 10);
            result = array.numbers[digit] + result;
        }
        return result;
    }
    client.checktienhg = async function (array, hg) {
        if (hg == array[0]) return result = 50
        if (hg == array[1]) return result = 50
        if (hg == array[2]) return result = 80
        if (hg == array[3]) return result = 80
        if (hg == array[4]) return result = 100
        if (hg == array[5]) return result = 100
        if (hg == array[6]) return result = 150
        if (hg == array[7]) return result = 150
        if (hg == array[8]) return result = 300
        if (hg == array[9]) return result = 300
        if (hg == array[10]) return result = 500
        if (hg == array[11]) return result = 500
        if (hg == array[12]) return result = 1
        if (hg == array[13]) return result = 7000
        if (hg == array[14]) return result = 11000
        if (hg == array[15]) return result = 15000
    }
    /////////////Hunt Thú///////////////
    const animalSchema = require('../models/animalSchema')
    const zoopointSchema = require('../models/zoopointSchema')
    const fishesSchema = require('../models/fishesSchema')
    const fishpointSchema = require('../models/fishpointSchema')
    // cái này là hunt thú
    client.animal = async (id, name, quanlity, type) => {
        let animals = await animalSchema.findOne({ id: id, name: name })
        if (animals) {
            animals.quanlity += quanlity;
            await animals.save()
        } else {
            const addanimals = new animalSchema({ id: id, name: name, quanlity: quanlity, type: type })
            await addanimals.save()
        }

    }
    // cái này là bán thú
    client.banthu = async (name, quanlity) => {
        let data = await animalSchema.findOne({ name: name })
        if (data) {
            data.quanlity -= quanlity;
        } else {
            return
        }
        await data.save();
    }
    // cái này là xem zoo
    client.zoo = async (name) => {
        const data = await animalSchema.findOne({ name });
        if (!data) return 0
        return data.quanlity;
    }
    //cộng point zoo
    client.addpoint = async (zooid, quanlity) => {
        let zoopoint = await zoopointSchema.findOne({ zooid: zooid })
        if (zoopoint) {
            zoopoint.quanlity += quanlity;
        } else {
            zoopoint = new zoopointSchema({ zooid: zooid, quanlity: quanlity })
        }
        await zoopoint.save();
    }
    //xem point zoo
    client.zoopoint = async (zooid) => {
        const data = await zoopointSchema.findOne({ zooid });
        if (!data) return 0;
        return data.quanlity;
    }
    // cái này là câu cá
    client.fishes = async (id, name, quanlity, type) => {
        let animals = await fishesSchema.findOne({ id: id, name: name })
        if (animals) {
            animals.quanlity += quanlity;
            await animals.save()
        } else {
            const addanimals = new fishesSchema({ id: id, name: name, quanlity: quanlity, type: type })
            await addanimals.save()
        }

    }
    // cái này là bán cá
    client.banca = async (name, quanlity) => {
        let data = await fishesSchema.findOne({ name: name })
        if (data) {
            data.quanlity -= quanlity;
        } else {
            return
        }
        await data.save();
    }

    // cái này là xem tank
    client.tank = async (name) => {
        const data = await fishesSchema.findOne({ name });
        if (!data) return 0
        return data.quanlity;
    }
    //cộng point tank
    client.addpointf = async (zooid, quanlity) => {
        let zoopoint = await fishpointSchema.findOne({ zooid: zooid })
        if (zoopoint) {
            zoopoint.quanlity += quanlity;
        } else {
            zoopoint = new fishpointSchema({ zooid: zooid, quanlity: quanlity })
        }
        await zoopoint.save();
    }
    //xem point tank
    client.zoopointf = async (zooid) => {
        const data = await fishpointSchema.findOne({ zooid });
        if (!data) return 0;
        return data.quanlity;
    }
    ////////////////////////////////////
    ///////////////FARM////////////////
    const farmSchema = require("../models/farmSchema")
    // XEM nông sản
    client.grow = async (id, name) => {
        const data = await farmSchema.findOne({ memberid: id, name: name });
        if (!data) return 0;
        return data.quanlity;
    }
    //THÊM Nông sản KHI MUA HOẶC THU HOẠCH
    client.addgrow = async (id, name, quanlity, type, price) => {
        let data = await invSchema.findOne({ memberid: id, name: name })
        if (data) {
            data.quanlity += quanlity;
        } else {
            data = new invSchema({ memberid: id, name: name, quanlity: quanlity, type: type, price: price })
        }
        await data.save();
    }
    //TRỪ nông sản
    client.trugrow = async (id, name, quanlity, type) => {
        let data = await farmSchema.findOne({ memberid: id, name: name })
        if (data) {
            data.quanlity -= quanlity;
        } else {
            return
        }
        await data.save();
    }

    client.cattle = async (id, name, type) => {
        let data = await farmSchema.findOne({ memberid: id, name: name, type: type });

        return data ? data.quanlity : 0;
    }

    // thêm vật nuôi 
    client.addCattle = async (id, name, quanlity, type) => {
        let data = await farmSchema.findOne({ memberid: id, name: name, type: type });
        if (data) {
            data.quanlity += quanlity;
        }
        else {
            data = new farmSchema({
                memberid: id,
                name: name,
                quanlity: quanlity,
                type: type
            })
        }

        await data.save();
    }

    // trừ vật nuôi
    client.truCattle = async (id, name, quanlity, type) => {
        let data = await farmSchema.findOne({ memberid: id, name: name, type: type })
        if (data) {
            data.quanlity -= quanlity;
        } else {
            return
        }
        await data.save();
    }

    /* client.checkField = async (userId, key, timeouts = {}) => {
         const cooldowns = require("../models/cooldowns")
         const planted = require("../models/planted")
         const lastExecutionTime = await cooldowns.findOne({ memberid: userId, key });
         if (!lastExecutionTime) {
             let createCooldown = new cooldowns({ memberid: userId, key: key, value: Date.now() });
             await createCooldown.save()
         }
         const currentTime = Date.now();
         const timeLeft = ((lastExecutionTime ? lastExecutionTime.value : 0) + timeout) - currentTime;
         console.log(timeLeft);
         if (timeLeft <= 0) {
             // Cooldown period has passed. User can use the command.
             lastExecutionTime.value = currentTime;
             await lastExecutionTime.save()
             return true;
         } else {
             return false;
         }
     } */
    ////////////////////////////////////
    /////////Yuworld Functions//////////
    const praySchema = require("../models/praySchema")
    // số pray
    client.prayed = async (id) => {
        const data = await praySchema.findOne({ id });
        if (!data) return 0;
        return data.prays;
    }
    // cộng pray
    client.pray = async (id) => {
        let data = await praySchema.findOne({ id: id })
        if (data) {
            data.prays += 1;
        } else {
            data = new praySchema({ id, prays: 1 })
        }
        await data.save();
    }
    client.curse = async (id) => {
        let data = await praySchema.findOne({ id: id });
        if (data) {
            data.prays -= 1;
        } else {
            data = new praySchema({ id, prays: -1 });
        }
        await data.save();
    }

    const { explvSchema, expSchema } = require("../models/expSchema");
    client.error = async (client, message, error) => {
        const { EmbedBuilder } = require("discord.js")
        let errorEmbed =
            new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`<:cancel:1183702388616482918> | **${message.author.username}**, ${error[0]}`)
        await message.channel.send({ embeds: [errorEmbed] }).catch(e => console.log(e))
        return;
    }
    client.expchat = async function expchat(client, memberid, message) {
        let a = await client.cd(memberid, `expchat`)
        let data = await client.newday(a)
        let after = data.after
        let exp = await expSchema.findOne({ memberid })
        let lv = await explvSchema.findOne({ memberid })
        let quanlity = await expSchema.findOne({ memberid: `${memberid}.limitday` })
        if (!quanlity) {
            quanlity = new expSchema({ memberid: `${memberid}.limitday`, exp: 20 })
            await quanlity.save()
        }
        let limit = 20
        if (quanlity) limit = quanlity.exp
        if (limit > 0) {
            let plus = Math.floor(Math.random() * 99)
            if (!exp) {
                exp = new expSchema({ memberid, exp: plus })
                await exp.save()
            }
            else {
                exp.exp += plus
                await exp.save()
            }
            quanlity.exp -= 1
            await quanlity.save()

        }
        else if (after && limit <= 0) {
            let plus = Math.floor(Math.random() * 99)
            if (!exp) {
                exp = new expSchema({ memberid, exp: plus })
                await exp.save()
            }
            else {
                exp.exp += plus
                await exp.save()
            }
            quanlity.exp += 19
            await quanlity.save()
            await client.timeout(memberid, `expchat1`)

        }
        else {
            await client.timeout(memberid, `expchat1`)
        }

        let level
        if (!lv) {
            lv = new explvSchema({ memberid, level: 1 })
            await lv.save()
            level = 1
        }
        else {
            level = lv.level
        }
        let e = await client.exp(memberid, 'find', 0)
        let expes = e.exp
        let lvl = e.lv
        if (expes >= (lvl * lvl * 1000)) {
            lv.level += 1
            await lv.save()
            await client.cong(memberid, lvl + 1 * 1000)
            await message.channel.send(`<a:Yu_sao01:944346751505145896> | **${message.author.id}**, bạn đã lên **__${lvl + 1}__** và được thưởng **${((lvl + 1) * 1000).toLocaleString('en-us')}** Ycoin`)
        }

        console.log(after + message.author.username)
    }

      // cái này là xem cần câu
  client.cancau = (userId, type) => new Promise(async ful => {
    const data = await rodSchema.findOne({ memberid: userId, type: type });
    if (!data) return ful(0);
    ful(data.quanlity)
  })
  
  // cái này là khi mua cần câu
  client.congcancau = async (userId, quanlity, types, type) => {
    let data = await rodSchema.findOne({ memberid: userId, typeS: types });
     
      if (data) {
        data.quanlity += quanlity;
        data.type = type;
      } else {
        data = new rodSchema({ memberid: userId, quanlity: quanlity, typeS: types, type: type })
      }
      data.save();
    }
  // cái này là khi xài cần câu
  client.trucancau = async (userId, quanlity, types) => {
    let data = await rodSchema.findOne({ memberid: userId, typeS: types });

      if (data) {
        data.quanlity -= quanlity;
      } else {
        return
      }
      data.save();
  }
    //////////////////////////////////////////// TRUNG THU //////////////////////////////////////////////////////

    client.checkItemTrungThu = async (userId, name) => {
        let data = await trungThuModel.findOne({ userId: userId });
    
        if (data) {
            const objFuncTrungThu = {
                "longdenchongnuoc": async () => { return data.longdenchongnuoc; },
                "que": async () => { return data.que; },
                "giay": async () => { return data.giay; },
                "mau": async () => { return data.mau; },
                "nen": async () => { return data.nen; },
                "bangkeo": async () => { return data.bangkeo; },
                "batlua": async () => { return data.batlua; },
            }
            const quantity = await objFuncTrungThu[name]();
            return quantity;
        }
      }

    client.congItemTrungThu = async (userId, name, quantity) => {
    let data = await trungThuModel.findOne({ userId: userId });

    if (data) {
        const objFuncTrungThu = {
            "longdenchongnuoc": async () => { data.longdenchongnuoc += quantity; },
            "que": async () => { data.que += quantity; },
            "giay": async () => { data.giay += quantity; },
            "mau": async () => { data.mau += quantity; },
            "nen": async () => { data.nen += quantity; },
            "bangkeo": async () => { data.bangkeo += quantity; },
            "batlua": async () => { data.batlua += quantity; },
        }

        data.save();
        await objFuncTrungThu[name]();
    }
    }

    client.truItemTrungThu = async (userId, name, quantity) => {
    let data = await trungThuModel.findOne({ userId: userId });

    if (data) {
        const objFuncTrungThu = {
            "longdenchongnuoc": async () => { data.longdenchongnuoc -= quantity; },
            "que": async () => { data.que -= quantity; },
            "giay": async () => { data.giay -= quantity; },
            "mau": async () => { data.mau -= quantity; },
            "nen": async () => { data.nen -= quantity; },
            "bangkeo": async () => { data.bangkeo -= quantity; },
            "batlua": async () => { data.batlua -= quantity; },
        }

        data.save();
        await objFuncTrungThu[name]();
    }
    }
}