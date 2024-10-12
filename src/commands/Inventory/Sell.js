const invSchema = require('../../models/invSchema')
const farmSchema = require('../../models/farmSchema')
const vipSchema = require("../../models/vipSchema");

module.exports = {
  name: "sell",
  description: ["Ysell <ID> <Số lượng | All>"],
  aliases: ["s"],
  usage: ["{prefix}sell <ID> <Số lượng | All>"],
  cooldown: 3,
  category: "Inventory",
  run: async (client, message, args, prefix, lang) => {
    const object = args[0]
    const memberid = message.author.id
    let soluong = args[1]

    let pro = false
    let vip = false
    const provip = await vipSchema.findOne({ memberid: message.author.id })
    if (provip) {
        const date = await client.datepassport(message.author.id)
        const status = await client.checkpassport(date)
        let end = status.after
        if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true
        if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true
    }
    
    let nhanname = {
      '001': '<:Yu_nhanco:951133679546159214>',
      '002': '<:Yu_nhanbac:941435162728730675>',
      '003': '<:Yu_nhanvang:941435163181727824>',
      '004': '<:Yu_nhankimcuong:941435160883265556>',
      '005': '<:Yu_nhanvangkc:951586992897024060>',
      '006': '<:yb_ring10:1248829192905424926>',
      '007': '<:yb_ring100:1248828071222710332>'
    }
    const tennhan = nhanname[object]
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
    const C = ["🐛", "🪱", "🐞", "🐌", "🦋"]
    const U = ["🐭", "🐰", "🐱", "🐶", "🦊"]
    const R = ["🐓", "🐖", "🐏", "🐄", "🐃"]
    const SR = ["🦎", "🐢", "🦂", "🐍", "🐊"]
    const E = ["🐒", "🦛", "🐆", "🐅", "🐘"]
    const P = [
      "<a:Ybutterfly:911682101005398058>",
      "<a:yl_ngoisao:1109036321927872562> ",
      "<<a:yl_ca_zoo:1109035822893764669>",
      "<:Ykhatrapboi:918082945686851615>",
      "<:be_non:918932737543503912>",
      "<a:Yu_meobaymau:944351775597674558>",
      "<:Yquyxu:941244934797799434>",
      "<a:GG_hongchuyen:911309645681946685>"
    ]
    const G = [
      "<:G_naisungtam:974392899536056401>",
      "<:G_kilan:974392813095616542>",
      "<:G_gautruc:974392721106149466>",
      "<:G_cho:974392664445308958>",
      "<:G_chim:974392505317597194>",
      "<:G_caoden:974392590029959188>",
      "<:G_bachtuoc:974392970931470347>"
    ]
    const D = [
      "<:D_Chimera:985411852542562344>",
      "<:D_Hydra:985411855927349298>",
      "<:D_Medusa:985411858557202513>",
      "<:D_Minotaur:985411860922761276>",
      "<:D_Pegasus:985411864324358184>"
    ]
    const V = [
      "<a:V_Cinderella:988149859745943592>",
      "<a:V_Sonic:988149031291215914>",
      "<a:V_Vanellope:988148591669440615>",
      "<a:V_Belle:988150258066423858>",
      "<a:V_BossBaby:988147327292276756>",
      "<a:V_Mikey:994182093183655966>"
    ]
    const animalSchema = require("../../models/animalSchema")
    const errorAnimals = 
      `Loại thú bạn nhập không đúng hoặc không đủ để bán`
    let types = {
      "c": "common",
      "C": "common",
      "common": "common",
      "u": "uncommon",
      "U": "uncommon",
      "uncommon": "uncommon",
      "r": "rare",
      "R": "rare",
      "rare": "rare",
      "s": "superrare",
      "S": "superrare",
      "SR": "superrare",
      "sr": "superrare",
      "Sr": "superrare",
      "superrare": "superrare",
      "e": "epic",
      "E": "epic",
      "epic": "epic",
      "p": "pro",
      "P": "pro",
      "pro": "pro",
      "g": "glory",
      "G": "glory",
      "glory": "glory",
      "d": "devil",
      "D": "devil",
      "devil": "devil",
      "v": "vip",
      "V": "vip",
      "vip": "vip"
    }
    let killtype = types[args[0]]

    const convertSPToCattle = {
      "trung": "ga",
      "sua": "bo",
      "thitheo": "heo"
    }

    if (tennhan) {
      const nhan = await invSchema.findOne({ memberid: message.author.id, name: tennhan })
      const errorNhan = 
        `${client.e.fail} | **${message.author.username}**, bạn nhập sai ID nhẫn hoặc bạn không có nhẫn này!`
      if (!nhan) return await message.channel.send(errorNhan)
      let user = message.author
      let a = await client.cd(message.author.id, `sellnhan1`)
      let day = await client.newday(a)
      let inday = day.withinDay
      let h = day.hours
      let min = day.minutes
      let sec = day.seconds
      let after = day.after
      if (!after) {
        const DelayTwo = 
          `<:Yu_fail:941589021761634306> | **${user.username}**, bạn phải chờ : \`${h}:${min}:${sec}s\` để sell nhẫn tiếp!`
        const delay = await message.channel.send(DelayTwo)
        await client.sleep(5000)
        await delay.delete()
      }
      else {
        const QuanlityWrong = [
          `${client.e.fail} | **${message.author.username}**, bạn không đủ nhẫn để bán!`,
          `${client.e.fail} | **${message.author.username}**, you don't have this ring to sell!`
        ]
        if (nhan.quanlity < 1) return await message.channel.send(QuanlityWrong)
        await client.timeout(message.author.id, `sellnhan1`)
        let money = nhan.price
        await invSchema.deleteOne({ memberid: message.author.id, name: tennhan })
        await client.cong(message.author.id, money)
        const successEndPointNhan = 
          `<:vvv:921536318062862396> | **${message.author.username}**, bạn đã bán thành công ${nhan.name} và nhận được **${parseInt(money).toLocaleString('En-Us')} Ycoin**`
        await message.channel.send(successEndPointNhan)
      }
    }
    else if (killtype || args[0] == "all") {

      const selltype = await animalSchema.find({ id: message.author.id, type: killtype }).sort({ quanlity: -1 })
      if (args[0] == `all`) {
        let wait = 
          `<a:yl_loading:1109041890667544678> | Đợi một chút, tôi đang tính toán...`
        let a = await message.reply(wait)
        let types = [
          "common",
          "uncommon",
          "rare",
          "superrare",
          "epic",
          "pro",
          "devil",
          "glory",
          "vip"
        ]
        let amount = 0
        for (let t in types) {
          const selltype = await animalSchema.find({ id: message.author.id, type: types[t] }).sort({ quanlity: -1 })
          if (selltype[0]) {
            let sltb = 0
            let moneys = 0
            for (let a in selltype) {
              let thuban = selltype[a]
              let price = checkprice(C, U, R, SR, E, P, G, D, V, thuban.name)
              let sl = thuban.quanlity
              sltb += sl
              if (sl >= 1) moneys += price * sl
              if (sl < 1) moneys += 0
              thuban.quanlity = 0
              await thuban.save()
            }
            amount += moneys
          }
        }
        await client.cong(message.author.id, amount)
        let soldSuccess = 
          `<:vvv:921536318062862396> | **${message.author.username}**, bạn đã bán tất cả thú và thu được **${parseInt(amount).toLocaleString('En-Us')} ${client.e.coin}**`
        await message.channel.send(soldSuccess)
        await a.delete()
      }
      else if (!selltype[0] || !args[0]) return message.reply(errorAnimals)
      else if (selltype[0]) {
        let sltb = 0
        let moneys = 0
        for (let a in selltype) {
          let thuban = selltype[a]
          let price = checkprice(C, U, R, SR, E, P, G, D, V, thuban.name)
          let sl = thuban.quanlity
          sltb += sl
          if (sl >= 1) moneys += price * sl
          if (sl < 1) moneys += 0
          thuban.quanlity = 0
          await thuban.save()
        }
        await client.cong(message.author.id, moneys)
        let soldSuccess = 
          `<:vvv:921536318062862396> | **${message.author.username}**, bạn đã bán **${sltb}** thú loại **${args[0]}** và thu được **${parseInt(moneys).toLocaleString('En-Us')} ${client.e.coin}**`
        await message.channel.send(soldSuccess)
      }
    }
    else if (nameHG) {
      const plants = await invSchema.findOne({ memberid: message.author.id, name: nameHG, type: "ns" })
      const errorPlants = 
        `${client.e.fail} | **${message.author.username}**, bạn không có đủ ${nameHG} để bán!`
      if (!plants) return await message.channel.send(errorPlants)
      let soluong = 1;
      if (args[1] == "all") soluong = plants.quanlity;
      else if (parseInt(args[1])) soluong = parseInt(args[1]);

      if (!soluong || soluong <= 0 || soluong > plants.quanlity) return message.reply("<:cancel:1183702388616482918> | Số lượng không hợp lệ!")
      plants.quanlity -= soluong;
      await plants.save()
      let price = client.seed[convertA].sell
      await client.cong(message.author.id, parseInt(price * soluong));
      await message.channel.send(
        `${client.i("coin")} **| ${message.author.username}**, bạn đã bán **${soluong.toLocaleString("en-us")} ${nameHG}** và nhận được **${parseInt(price * soluong).toLocaleString("en-us")} Ycoin**`)
    } else if (args[0] == "ns") {
      if (args[1] == "all") {
        if (!vip && !pro) return message.reply("Bạn phải cần passport mới sử dụng được lệnh sell nhanh này!");
        
        let totalMoney = 0;
        const plants = await invSchema.find({ memberid: message.author.id, type: "ns" });

        for (let p of plants) {
          await invSchema.findOneAndUpdate(
            { memberid: message.author.id, name: p.name, type: "ns" },
            { quanlity: 0 }
          )

          totalMoney += p.quanlity * p.price;
        }

        await client.cong(message.author.id, parseInt(totalMoney))
        await message.channel.send(
          `${client.i("coin")} **| ${message.author.username}**, bạn đã bán **tất cả hạt giống** và nhận được **${parseInt(totalMoney).toLocaleString("en-us")} Ycoin**`
        )
      }
    }
    else if (args[0] === "sp") {
      if (args[1] == "all") {
        let totalMoney = 0;
        const invData = await invSchema.find({ memberid: message.author.id, type: "tulanh" });

        for (let f of invData) {
          const priceOfSP = client.thunuoi[convertSPToCattle[f.name]].production.sell;
          const totalPriceOfSP = priceOfSP * f.quanlity;
          await invSchema.findOneAndUpdate(
            { memberid: message.author.id, name: f.name, type: "tulanh" },
            { quanlity: 0 }
          )
          totalMoney += totalPriceOfSP;
        }
        console.log(totalMoney + " total money")

        await client.cong(message.author.id, parseInt(totalMoney))
        await message.channel.send(
          `${client.i("coin")} **| ${message.author.username}**, bạn đã bán **tất cả sản phẩm của vật nuôi** và nhận được **${parseInt(totalMoney).toLocaleString("en-us")} Ycoin**`
        )
      }
    }
    else {
      let nothingfound = 
        `${client.e.fail} | **${message.author.username}**, bạn phải nhập thứ muốn bán! 
Bán thú : \`Ysell <type/all>\`
Bán nhẫn : \`Ysell <type/id>\`
Bán trái cây : \`Ysell <id/ten> <quanlity/all>\`
Bán cá: \`Ysf <quanlity/all>\`
Bán sản phẩm từ vật nuôi: \`ysell <type/id> <quantity/all>\`
`
      return await message.channel.send(nothingfound)
    }
  }
}
function checkprice(c, u, r, s, e, p, g, d, v, thu) {
  let result = 0
  if (c.includes(thu)) result = 2
  if (u.includes(thu)) result = 6
  if (r.includes(thu)) result = 20
  if (s.includes(thu)) result = 50
  if (e.includes(thu)) result = 500
  if (p.includes(thu)) result = 30000
  if (g.includes(thu)) result = 10000
  if (d.includes(thu)) result = 20000
  if (v.includes(thu)) result = 150000
  return result
}
function Datecheck(date) {
  let now = new Date(Date.now() + 25200000);
  let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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

  let pDate = new Date(date);
  let diff = midnight - pDate;

  /* Not past midnight */
  if (diff <= 0) return { after: false, diff: diff, seconds: seconds, minutes: minutes, hours: hours, days: days, now };

  /* Within 1 day */
  else if (diff <= 172810000) return { after: true, diff: diff, withinDay: true, seconds: seconds, minutes: minutes, hours: hours, days: days, now };

  /* Over 1 full day */
  else return { after: true, diff: diff, withinDay: (overrideWithinDay || false), seconds: seconds, minutes: minutes, hours: hours, days: days, now };
}
function checktienhg(array, hg) {
  let result
  if (hg == array[0]) result = 2000
  if (hg == array[1]) result = 7
  if (hg == array[2]) result = 150
  return result
}
function getPriceFromTable(seedType, client) {
  let seedPrices = {
    "ot": 55,
    "lua": 80,
    "dautay": 60000,
    "ngo": 5500,
    "cachua": 2000,
    "dao": 35000,
    "khoaimi": 9800,
    "mia": 20000,
    "khoaitay": 11000,
    "duagang": 60000,
    "carot": 550,
    "caingot": 20000,
    "mit": 100000,
  }
  if (seedPrices.hasOwnProperty(seedType)) {
    return seedPrices[seedType]; // Trả về giá của loại hạt giống
  } else {
    return 0; // Trả về 0 nếu loại hạt giống không có trong bảng giá
  }
}
async function getCountOfSeed(seedType, memberid) {
  try {
    // Lấy số lượng từ cơ sở dữ liệu dựa trên loại hạt giống
    let seedData = await farmSchema.find({ memberid: memberid, name: seedType }); // Thay farmSchema bằng tên schema của bạn
    let totalQuantity = 0;

    // Lặp qua từng mục trong seedData và tính tổng số lượng
    seedData.forEach(seed => {
      totalQuantity += seed.quanlity; // Sửa từ seed.quantity thành seed.quanlity để phản ánh tên trường trong schema của bạn
    });

    return totalQuantity; // Trả về tổng số lượng của loại hạt giống
  } catch (error) {
    console.error("Lỗi khi lấy số lượng của loại hạt giống:", error);
    return 0; // Trả về 0 nếu có lỗi xảy ra
  }
}