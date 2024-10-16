const gems1 = [
  '<:C_gem_01:982028743608533022>',
  '<:U_gem_01:982028744204103810>',
  '<:R_gem_01:982028744107655198>',
  '<:SR_gem_01:982028743960854598>',
  '<:E_gem_01:982028743595941938>',
  '<:P_gem_01:982028744191529010>',
  '<:G_gem_01:982028743629484082>',
]
const gems2 = [
  '<:C_gem_02:982028743537209424>',
  '<:U_gem_02:982028744061505606>',
  '<:R_gem_02:982028744124428428>',
  '<:SR_gem_02:982028743956652072>',
  '<:E_gem_02:982028743679827968>',
  '<:P_gem_02:982028743713366066>',
  '<:G_gem_02:982028743646265364>',
]
const gems3 = [
  '<:C_gem_03:982028743914696704>',
  '<:U_gem_03:982028743650463795>',
  '<:R_gem_03:982028743948247110>',
  '<:SR_gem_03:982028744124411924>',
  '<:E_gem_03:982028743805648926>',
  '<:P_gem_03:982028743960830032>',
  '<:G_gem_03:982028743537217588>',
]
const gems4 = [
  '<:C_gem_04:982028743570755624>',
  '<:U_gem_04:982028744187326494>',
  '<:R_gem_04:982028743822426152>',
  '<:SR_gem_04:982028743981817908>',
  '<:E_gem_04:982028743688212520>',
  '<:P_gem_04:982028743893721178>',
  '<:G_gem_04:982028744057294848>',
]
const invSchema = require('../../models/invSchema')
const emojis = require("../../configs/emojis.json");

module.exports = {
  name: "use",
  description: ["Sử dụng vật phẩm!"],
  aliases: [],
  usage: ["{prefix}use <id vật phẩm>"],
  cooldown: 3,
  category: "Inventory",
  run: async (client, message, args, prefix, lang) => {
    const { QuickDB } = require("quick.db")
    const db = new QuickDB({table: "DB"})
    // buff ngọc dành cho hunt thú
    const buff1 = await client.buff(message.author.id, 1)
    const buff2 = await client.buff(message.author.id, 2)
    const buff3 = await client.buff(message.author.id, 3)
    const buff4 = await client.buff(message.author.id, 4)

    let author = message.author.id
    let gem1 = {
      '01': '<:C_gem_01:982028743608533022>',
      '05': '<:U_gem_01:982028744204103810>',
      '09': '<:R_gem_01:982028744107655198>',
      '13': '<:SR_gem_01:982028743960854598>',
      '17': '<:E_gem_01:982028743595941938>',
      '21': '<:P_gem_01:982028744191529010>',
      '25': '<:G_gem_01:982028743629484082>',
    }
    let gem2 = {
      '02': '<:C_gem_02:982028743537209424>',
      '06': '<:U_gem_02:982028744061505606>',
      '10': '<:R_gem_02:982028744124428428>',
      '14': '<:SR_gem_02:982028743956652072>',
      '18': '<:E_gem_02:982028743679827968>',
      '22': '<:P_gem_02:982028743713366066>',
      '26': '<:G_gem_02:982028743646265364>',
    }
    let gem3 = {
      '03': '<:C_gem_03:982028743914696704>',
      '07': '<:U_gem_03:982028743650463795>',
      '11': '<:R_gem_03:982028743948247110>',
      '15': '<:SR_gem_03:982028744124411924>',
      '19': '<:E_gem_03:982028743805648926>',
      '23': '<:P_gem_03:982028743960830032>',
      '27': '<:G_gem_03:982028743537217588>',
    }
    let gem4 = {
      '04': '<:C_gem_04:982028743570755624>',
      '08': '<:U_gem_04:982028744187326494>',
      '12': '<:R_gem_04:982028743822426152>',
      '16': '<:SR_gem_04:982028743981817908>',
      '20': '<:E_gem_04:982028743688212520>',
      '24': '<:P_gem_04:982028743893721178>',
      '28': '<:G_gem_04:982028744057294848>',
    }
    let mp = {
      "m1": "<:Yu_daugoi:1025262281774346361>",
      "m2": "<:Yu_suatam:1025262293749092353>",
      "m3": "<:Yu_kemchongnang:1025262255601885234>",
      "m4": "<:Yu_kemduongda:1025262288254554183>",
      "m5": '<:Yu_sonmongtay:1025262260744093768>',
      "m6": "<:Yu_mascara:1025262266511269938>",
      "m7": "<:Yu_phanmat:1025262271817068575>",
      "m8": "<:Yu_serum:1025262244587642950>",
    }

    const id = args[0]
    const idngoc1 = gem1[args[0]]
    const idngoc2 = gem2[args[0]]
    const idngoc3 = gem3[args[0]]
    const idngoc4 = gem4[args[0]]

    let passports = {
      "30": "<:ProPassport:988093838348410930>",
      "31": "<:VIPPassport:988093810955411456>",
      "passport": "<:ProPassport:988093838348410930>",
      "vippassport": "<:VIPPassport:988093810955411456>",
      "pp": "<:ProPassport:988093838348410930>",
      "vp": "<:VIPPassport:988093810955411456>",
      "ppp": "<:ProPassport:988093838348410930>",
      "vpp": "<:VIPPassport:988093810955411456>",
      "propassport": "<:ProPassport:988093838348410930>",
      "vip": "<:VIPPassport:988093810955411456>",
      "pro": "<:ProPassport:988093838348410930>"
    }
    const idpassport = passports[args[0]]

    if (id == "cc1" || id == "cancaugo") await useFishingRod(client, message, 5, 10);
    else if (id == "cc2" || id == "cancauhiendai") await useFishingRod(client, message, 6, 30);
    else if (id == "cc3" || id == "cancaupro") await useFishingRod(client, message, 7, 100);
    else if (id == "cc4" || id == "cancaudacbiet") await useFishingRod(client, message, 8, 150);
    else if (id == `gb` || id == `gembox` || id == `29`) {
      const gemboxes = [
        '<:C_gem_01:982028743608533022>',
        '<:U_gem_01:982028744204103810>',
        '<:R_gem_01:982028744107655198>',
        '<:SR_gem_01:982028743960854598>',
        '<:C_gem_02:982028743537209424>',
        '<:U_gem_02:982028744061505606>',
        '<:R_gem_02:982028744124428428>',
        '<:SR_gem_02:982028743956652072>',
        '<:C_gem_03:982028743914696704>',
        '<:U_gem_03:982028743650463795>',
        '<:R_gem_03:982028743948247110>',
        '<:SR_gem_03:982028744124411924>'
      ]
      const gembox = await client.gem(author, `<:GEMBOX:982028743952441355>`)
      const lackGemboxes2 = 
        `Bạn không còn hộp ngọc để dùng.`
      if (gembox < 1) return message.channel.send(lackGemboxes2)
      let soluong = parseInt(args[1])
      const errorAmount = 
        `${client.e.fail} | **${message.author.username} Bạn không thể nhập số âm !**`
      if (soluong < 0) return message.channel.send(errorAmount)
      if (!soluong && gembox > 0) soluong = 1
      if (args[1] == `all`) soluong = gembox
      if (soluong > 20) soluong = 20
      const lackGemboxes = 
        `${client.e.fail} | Bạn không còn hộp ngọc để dùng.`
      if (gembox < soluong) return message.channel.send(lackGemboxes)
      await client.trugem(author, `<:GEMBOX:982028743952441355>`, soluong)
        // array thu thập dữ liệu trả về ngọc đã mở được 
		let gg = []
	  // Nếu dùng nhiều hơn 1 hộp gem box
      if (soluong > 1) {
        //vòng lặp random ngọc
        for (var i = 0; i < soluong; i++) {
          let g = gemboxes[Math.floor(Math.random() * gemboxes.length)]
          gg[i] = g //thêm ngọc vào array ngọc
        }
		//object số lượng chi tiết 
        let count = {}
        //check xem mỗi loại có bao nhiêu viên và thêm vào object
        gg.forEach(item => {
            //nếu đã xuất hiện từ trước
			if (count[item]) {
            count[item] += 1
            return
          }
          //nếu là một ngọc khác
          count[item] = 1
        })
        // vòng lặp thêm ngọc vào dữ liệu
        for (let item in count) {
          //function check loại
		  let type = checktype(gems1, gems2, gems3, gems4, item)
          //func add ngọc vào túi => id, tên ngọc, sl, loại
		  await client.addgem(author, item, count[item], type)
        }
        const USED =
          `<:GEMBOX:982028743952441355> | **${message.author.username}**, bạn đã sử dụng **${soluong}** hộp ngọc và nhận được ${gg}!`
        await message.channel.send(USED)
      }
      else {
	  // Nếu chỉ dùng 1 hộp
        let a = gemboxes[Math.floor(Math.random() * gemboxes.length)]
        let type = checktype(gems1, gems2, gems3, gems4, a)
        await client.addgem(author, a, 1, type)
        const USED = 
          `<:GEMBOX:982028743952441355> | **${message.author.username}**, bạn đã sử dụng **${soluong}** hộp ngọc và nhận được ${a}!`
        await message.channel.send(USED)
      }
    }
    else if (id == `pgb` || id == `progembox` || id == `32`) {
      const gemboxes = [
        '<:C_gem_01:982028743608533022>',
        '<:U_gem_01:982028744204103810>',
        '<:R_gem_01:982028744107655198>',
        '<:SR_gem_01:982028743960854598>',
        '<:E_gem_01:982028743595941938>',
        '<:P_gem_01:982028744191529010>',

        '<:C_gem_02:982028743537209424>',
        '<:U_gem_02:982028744061505606>',
        '<:R_gem_02:982028744124428428>',
        '<:SR_gem_02:982028743956652072>',
        '<:E_gem_02:982028743679827968>',
        '<:P_gem_02:982028743713366066>',

        '<:C_gem_03:982028743914696704>',
        '<:U_gem_03:982028743650463795>',
        '<:R_gem_03:982028743948247110>',
        '<:SR_gem_03:982028744124411924>',
        '<:E_gem_03:982028743805648926>',
        '<:P_gem_03:982028743960830032>',
      ]
      const gembox = await client.gem(author, `<:PRO_GEMBOX:982028744057298964>`)
      const LackOfBox = 
        `${client.e.fail} | Bạn không còn hộp ngọc PRO để dùng.`
      if (gembox < 1) return message.channel.send(LackOfBox)
      let soluong = parseInt(args[1])
      const errrorOfAmoiint = 
        `${client.e.fail} | **${message.author.username} Bạn không thể nhập số âm !**`
      if (soluong < 0) return message.channel.send(errrorOfAmoiint)
      if (!soluong && gembox > 0) soluong = 1
      if (args[1] == `all`) soluong = gembox
      if (soluong > 20) soluong = 20
      const LackofSth12 = 
        `${client.e.fail} | **${message.author.username}**, bạn không có đủ hộp ngọc PRO để dùng!`
      if (gembox < soluong) return message.channel.send(LackofSth12)
      await client.trugem(author, `<:PRO_GEMBOX:982028744057298964>`, soluong)
      let gg = []
      if (soluong > 1) {
        for (var i = 0; i < soluong; i++) {
          let g = gemboxes[Math.floor(Math.random() * gemboxes.length)]
          gg[i] = g
        }
        let count = {}
        gg.forEach(item => {
          if (count[item]) {
            count[item] += 1
            return
          }
          count[item] = 1
        })
        for (let item in count) {
          let type = checktype(gems1, gems2, gems3, gems4, item)
          await client.addgem(author, item, count[item], type)
        }
        const msgg1123 = 
          `<:PRO_GEMBOX:982028744057298964> | **${message.author.username}**, bạn đã sử dụng **${soluong}** hộp ngọc PRO và nhận được ${gg}!`
        await message.channel.send(msgg1123)
      }
      else {
        let a = gemboxes[Math.floor(Math.random() * gemboxes.length)]
        let type = checktype(gems1, gems2, gems3, gems4, a)
        await client.addgem(author, a, 1, type)
        const msgg1123 = 
          `<:PRO_GEMBOX:982028744057298964> | **${message.author.username}**, bạn đã sử dụng **${soluong}** hộp ngọc PRO và nhận được ${a}`
        await message.channel.send(msgg1123)
      }
    }
    else if (id == `vgb` || id == `vipgembox` || id == `33`) {
      const gemboxes = [
        '<:C_gem_04:982028743570755624>',
        '<:U_gem_04:982028744187326494>',
        '<:R_gem_04:982028743822426152>',
        '<:SR_gem_04:982028743981817908>',
        '<:E_gem_04:982028743688212520>',
        '<:P_gem_04:982028743893721178>',
      ]
      const gembox = await client.gem(author, `<:VIP_GEMBOX:982028743889543278>`)
      const LackOfBox = 
        `${client.e.fail} | Bạn không còn hộp ngọc VIP để dùng.`
      if (gembox < 1) return message.channel.send(LackOfBox)
      let soluong = parseInt(args[1])
      const errrorOfAmoiint = 
        `${client.e.fail} | **${message.author.username} Bạn không thể nhập số âm !**`
      if (soluong < 0) return message.channel.send(errrorOfAmoiint)
      if (!soluong && gembox > 0) soluong = 1


      if (args[1] == `all`) soluong = gembox
      if (soluong > 20) soluong = 20 
      const LackofSth12 = 
        `${client.e.fail} | **${message.author.username}**, bạn không có đủ hộp ngọc VIP để dùng!`
      if (gembox < soluong) return message.channel.send(LackofSth12)
      await client.trugem(author, `<:VIP_GEMBOX:982028743889543278>`, soluong)
      let gg = []
      if (soluong > 1) {
        for (var i = 0; i < soluong; i++) {
          let g = gemboxes[Math.floor(Math.random() * gemboxes.length)]
          gg[i] = g
        }
        let count = {}
        gg.forEach(item => {
          if (count[item]) {
            count[item] += 1
            return
          }
          count[item] = 1
        })
        for (let item in count) {
          let type = checktype(gems1, gems2, gems3, gems4, item)
          await client.addgem(author, item, count[item], type)
        }
        const msgg1123 = 
          `<:VIP_GEMBOX:982028743889543278> | **${message.author.username}**, bạn đã sử dụng **${soluong}** hộp ngọc VIP và nhận được ${gg}`
        await message.channel.send(msgg1123)
      }
      else {
        let a = gemboxes[Math.floor(Math.random() * gemboxes.length)]
        let type = checktype(gems1, gems2, gems3, gems4, a)
        await client.addgem(author, a, 1, type)
        const msgg1123 = 
          `<:PRO_GEMBOX:982028744057298964> | **${message.author.username}**, bạn đã sử dụng **${soluong}** hộp ngọc VIP và nhận được ${a}`
        await message.channel.send(msgg1123)


      }
    }
    else if (idngoc1) {
      const geml = await client.gem(author, `${idngoc1}`)
      const gemlIsZero = 
        `${client.e.fail} | **${message.author.username}**, bạn không có ngọc ${idngoc1}`
      if (geml == 0) return message.channel.send(gemlIsZero)
      const gemlIsZero2 = 
        `${client.e.fail} | **${message.author.username}**, bạn không thể dùng chung loại ngọc!`
      if (buff1 > 0) return message.channel.send(gemlIsZero2)
      const gemlIsZero23 = 
        `${client.e.fail} | **${message.author.username}**, bạn không thể dùng thêm ngọc khi đã dùng KINGSTONE!`
      if (buff4 > 0) return message.channel.send(gemlIsZero23)
      let soluong = checkngoc(gems1, idngoc1, 10)
      let heso = checkbuff(gems1, idngoc1, 1)
      await client.trugem(author, idngoc1, 1)
      await client.addbuff(author, 1, soluong, heso)
      const gemlIsZero234 = 
        `${idngoc1} | **${message.author.username}**, bạn đã sử dụng ngọc ${idngoc1} và được buff **${soluong}** lần hunt x${heso}`
      await db.set(`${message.author.id}.Soluongbuff1`, soluong)
      await db.set(`${message.author.id}.buff1`, idngoc1)
      await message.channel.send(gemlIsZero234)
    }
    else if (idngoc2) {
      const geml = await client.gem(author, `${idngoc2}`)
      const gemlIsZero = 
        `${client.e.fail} | **${message.author.username}**, bạn không có ngọc ${idngoc2}`
      if (geml == 0) return message.channel.send(gemlIsZero)
      const gemlIsZero2 = 
        `${client.e.fail} | **${message.author.username}**, bạn không thể dùng chung loại ngọc!`
      if (buff2 > 0) return message.channel.send(gemlIsZero2)
      const gemlIsZero23 = 
        `${client.e.fail} | **${message.author.username}**, bạn không thể dùng thêm ngọc khi đã dùng KINGSTONE!`
      if (buff4 > 0) return message.channel.send(gemlIsZero23)
      let soluong = checkngoc(gems2, idngoc2, 10)
      await client.trugem(author, idngoc2, 1)
      await client.addbuff(author, 2, soluong, 1)
      const gemlIsZero234 = 
        `${idngoc2} | **${message.author.username}**, bạn đã sử dụng ngọc ${idngoc2} và được buff **${soluong}** lần hunt double!`
      await db.set(`${message.author.id}.Soluongbuff2`, soluong)
      await db.set(`${message.author.id}.buff2`, idngoc2)
      await message.channel.send(gemlIsZero234)
    }
    else if (idngoc3) {
      const geml = await client.gem(author, `${idngoc3}`)
      const gemlIsZero = 
        `${client.e.fail} | **${message.author.username}**, bạn không có ngọc ${idngoc3}`
      if (geml == 0) return message.channel.send(gemlIsZero)
      const gemlIsZero2 = 
        `${client.e.fail} | **${message.author.username}**, bạn không thể dùng chung loại ngọc!`
      if (buff3 > 0) return message.channel.send(gemlIsZero2)
      const gemlIsZero23 = 
        `${client.e.fail} | **${message.author.username}**, bạn không thể dùng thêm ngọc khi đã dùng KINGSTONE!`
      if (buff4 > 0) return message.channel.send(gemlIsZero23)
      let soluong = checkngoc(gems3, idngoc3, 10)
      await client.trugem(author, idngoc3, 1)
      await client.addbuff(author, 3, soluong, 1)

      const gemlIsZero234 = 
        `${idngoc3} | **${message.author.username}**, bạn đã sử dụng ngọc ${idngoc3} và được buff **${soluong}** lần hunt may mắn!`
      await db.set(`${message.author.id}.Soluongbuff3`, soluong)
      await db.set(`${message.author.id}.buff3`, idngoc3)
      await message.channel.send(gemlIsZero234)
    }
    else if (idngoc4) {
      const gem = await client.gem(author, `${idngoc4}`)
      const lackk1 = 
        `${client.e.fail} | **${message.author.username}**, bạn không có ngọc ${idngoc4}`
      if (gem < 1) return message.channel.send(lackk1)
      const lackk2 = 
        `${client.e.fail} | **${message.author.username}**, bạn không thể dùng thêm  KINGSTONE khi vẫn còn sức mạnh đá quý!`
      if (buff1 > 0) return message.channel.send(lackk2)
      if (buff2 > 0) return message.channel.send(lackk2)
      if (buff3 > 0) return message.channel.send(lackk2)
      if (buff4 > 0) return message.channel.send(lackk2)
      let soluong = checkngoc(gems4, idngoc4, 10)
      let heso = checkbuff(gems4, idngoc4, 1)
      await client.trugem(author, idngoc4, 1)
      await client.addbuff(author, 4, soluong, heso)
      const uSED = 
        `${idngoc4} | **${message.author.username}**, bạn đã sử dụng ngọc ${idngoc4} và được buff **${soluong}** lần hunt may mắn!`
      await db.set(`${message.author.id}.Soluongbuff4`, soluong)
      await db.set(`${message.author.id}.buff4`, idngoc4)
      await message.channel.send(uSED)
    }
    else if (idpassport) {

      const passport = await invSchema.findOne({ memberid: message.author.id, name: idpassport })
      if (!passport || passport.quanlity == 0) return message.reply(`${client.e.fail} | Bạn không còn ${idpassport} để dùng!`)

      const date = await client.datepassport(message.author.id)
      const status = await client.checkpassport(date)
      let end = status.after
      let d = status.d
      let h = status.h
      let m = status.m
      let s = status.s
      if (!end) return message.reply(`${client.e.fail} | Passport của bạn vẫn còn ${d + `ngày` + h + `giờ` + m + `phút` + s + `giây`} mới hết hạn !`)
      passport.quanlity -= 1
      await passport.save()
      await client.activatepassport(message.author.id, idpassport)
      await message.channel.send(`${idpassport} | **${message.author.username}**, bạn đã sử dụng PASSPORT ${idpassport}! Passport sẽ có hiệu lực trong 30 ngày!`)
    }
    else {
      return message.channel.send(`**${message.author.username}**, vật phẩm bạn dùng không hợp lệ.`)
    }
  }
}
function checkngoc(array, ngoc, heso) {
  if (ngoc == array[0]) result = heso * 1
  if (ngoc == array[1]) result = heso * 2
  if (ngoc == array[2]) result = heso * 4
  if (ngoc == array[3]) result = heso * 6
  if (ngoc == array[4]) result = heso * 8
  if (ngoc == array[5]) result = heso * 10
  if (ngoc == array[6]) result = heso * 15
  return result
}
function checktype(s1, s2, s3, s4, ngoc) {
  if (s1.includes(ngoc)) result = 1
  if (s2.includes(ngoc)) result = 2
  if (s3.includes(ngoc)) result = 3
  if (s4.includes(ngoc)) result = 4
  return result

}
function checkbuff(array, ngoc) {
  if (ngoc == array[0]) result = 3
  if (ngoc == array[1]) result = 4
  if (ngoc == array[2]) result = 5
  if (ngoc == array[3]) result = 6
  if (ngoc == array[4]) result = 7
  if (ngoc == array[5]) result = 8
  if (ngoc == array[6]) result = 9
  return result
}

const useFishingRod = async (client, message, type, soLuong) => {
  const buffSchema = require("../../models/buffSchema");
  const convertTypeToTypeS = {
    5: emojis.cancaugo,
    6: emojis.cancauhiendai,
    7: emojis.cancaupro,
    8: emojis.cancaudacbiet,
  }

  const authorId = message.author.id;
  const buffData = await buffSchema.find({ memberid: authorId });
  const existRod = await client.cancau(authorId, type);
  const buffDacBiet = await client.buff(authorId, 8);

  let isUserHasBuff = false;
  for (let buff of buffData) {
    if (buff.quanlity != 0 && buff.type >= 5) {
      isUserHasBuff = true;
      break;
    }
  } 

  if (isUserHasBuff)
    return message.reply("Bạn chỉ có thể sử dụng 1 loại cần câu");
  
  if (buffDacBiet > 0)
    return message.reply(`Bạn không thể sử dụng cần câu khác khi đang dùng cần câu đặc biệt ${emojis.cancaudacbiet}`);

  if (existRod > 0) {
    await client.addbuff(authorId, type, soLuong, 10);
    await client.trucancau(authorId, 1, convertTypeToTypeS[type]);

    await message.reply(`Bạn đã sử dụng thành công ${convertTypeToTypeS[type]}!`);
  } else message.reply(`Bạn không đủ ${convertTypeToTypeS[type]} để dùng!`);
}
