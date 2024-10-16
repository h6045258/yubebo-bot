const { AttachmentBuilder } = require("discord.js")
const animal = require("../configs/animal.json")
const buffSchema = require('../models/buffSchema')
const vipSchema = require('../models/vipSchema')
const { QuickDB } = require("quick.db")
const db = new QuickDB({ table: "DB" })
const BatThuThuong = async (client, message) => {
  const provip = await vipSchema.findOne({ memberid: message.author.id })
  let pro = false
  let vip = false
  let limit = 0
  if (provip) {
    const date = await client.datepassport(message.author.id)
    const status = await client.checkpassport(date)
    let end = status.after
    if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true, limit = 50
    if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true, limit = 75
    if (end) {
      await vipSchema.deleteOne({ memberid: message.author.id })
      await message.reply(`Passport của bạn đã hết hạn! Cảm ơn bạn đã đồng hành cùng tôi trong suốt tháng qua! <3`)
    }
  }
  let author = message.author.id
  const buffs = await buffSchema.find({
    memberid: author
  })
  let heso = 1
  let x2 = false
  let lucky = false
  let buffmsg = ``
  let soluongbuff1 = await db.get(`${message.author.id}.Soluongbuff1`)
  let soluongbuff2 = await db.get(`${message.author.id}.Soluongbuff2`)
  let soluongbuff3 = await db.get(`${message.author.id}.Soluongbuff3`)
  let soluongbuff4 = await db.get(`${message.author.id}.Soluongbuff4`)
  let icon1 = await db.get(`${message.author.id}.buff1`)
  let icon2 = await db.get(`${message.author.id}.buff2`)
  let icon3 = await db.get(`${message.author.id}.buff3`)
  let icon4 = await db.get(`${message.author.id}.buff4`)
  for (let b in buffs) {
    let buf = buffs[b]
    let type = buf.type
    let quanlity = buf.quanlity
    if (quanlity > 0 && type == 1) {
      //await db.set(`${message.author.id}.denbumatbuff`, true)
      heso = buf.heso;
      digit = Math.trunc(Math.log10(heso) + 1);
      buffmsg += `${icon1} \`[${quanlity - 1}/${soluongbuff1 ? soluongbuff1 : quanlity - 1}]\``;
      await client.trubuff(message.author.id, 1, 1)
    };
    if (quanlity > 0 && type == 2) {
      x2 = true
      buffmsg += `${icon2} \`[${quanlity - 1}/${soluongbuff2 ? soluongbuff2 : quanlity - 1}]\``
      await client.trubuff(message.author.id, 2, 1)
    };
    if (quanlity > 0 && type == 3) {
      lucky = true
      buffmsg += `${icon3} \`[${quanlity - 1}/${soluongbuff3 ? soluongbuff3 : quanlity - 1}]\``
      await client.trubuff(message.author.id, 3, 1)
    }
    if (quanlity > 0 && type == 4) {
      heso = buf.heso
      x2 = true
      lucky = true
      digit = Math.trunc(Math.log10(heso) + 1);
      buffmsg += `${icon4} \`[${quanlity - 1}/${soluongbuff4 ? soluongbuff4 : quanlity - 1}]\``
      await client.trubuff(message.author.id, 4, 1)
    };
  }
  const array = chonthu(animal, lucky, pro, vip, heso, x2)
  let point = array.point
  let hunted = array.arr
  return { hunted: hunted, point: point, buffmsg: buffmsg, limit: limit }
}

const Captcha = async (client, message) => {

  const provip = await vipSchema.findOne({ memberid: message.author.id })
  let pro = false
  let vip = false
  let limit = 100
  if (provip) {
    const date = await client.datepassport(message.author.id)
    const status = await client.checkpassport(date)
    let end = status.after
    if (!end && provip.type == `<:VIPPassport:988093810955411456>`) vip = true, limit = 50
    if (!end && provip.type == `<:ProPassport:988093838348410930>`) pro = true, limit = 75
    if (end) {
      await vipSchema.deleteOne({ memberid: message.author.id })
      await message.reply(`Passport của bạn đã hết hạn! Cảm ơn bạn đã đồng hành cùng tôi trong suốt tháng qua! <3`)
    }
  }
  const a = Math.floor(Math.random() * 1999)
  const b = Math.floor(Math.random() * 1999)
  if (a + b < limit) {
    const { createCanvas, registerFont } = require('canvas');

    let captchaText = '';
    const FONT_FILE_PATH = './assets/fonts/BlaxSlabXXL.ttf';
    const FONT_SIZE = 80;
    const CAPTCHA_LENGTH = 6;
    const DOT_COUNT = 100;
    const LINE_COUNT = 5;

    function getRandomHexColor() {
      let color = "#FFFFFF"
      // do {
      //   color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      // } while (color === '#000000'); 
      return color;
    }
    registerFont(FONT_FILE_PATH, { family: 'Serif' })
    function generateCaptcha(width, height) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Generate a random captcha string
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < CAPTCHA_LENGTH; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      // Set canvas background with a random hex color
      const backgroundColor = getRandomHexColor();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Draw captcha text using the Arial font
      ctx.font = `${FONT_SIZE}px Serif`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(captchaText, width / 2, height / 2);

      // Draw random dots
      for (let i = 0; i < DOT_COUNT; i++) {
        ctx.fillStyle = getRandomHexColor();
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw random lines
      for (let i = 0; i < LINE_COUNT; i++) {
        ctx.strokeStyle = getRandomHexColor();
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }


      // Return the captcha image as a Discord.js attachment
      return canvas.toBuffer()
    }

    const canvasW = 300; // rộng
    const canvasH = 100; // cao
    let image = generateCaptcha(canvasW, canvasH);

    const attachment = new AttachmentBuilder(image, 'profile-image.png');
    const content = captchaText.toLowerCase()
    let random = [
      `### 𝘾𝘼𝙋𝙏𝘾𝙃𝘼 DMS !!! Hãy DMS tôi với mã captcha này để chứng minh bạn không auto-spam!
      Bạn còn [5/5] cảnh báo!
      Nếu bạn gặp vấn đề về giải captcha, xin hãy tải ảnh này về và Screen-shot màn hình DMS của tôi đến Support Server để được trợ giúp!`,
      `### Bạn đã dính 𝘾𝘼𝙋𝙏𝘾𝙃𝘼, Vui lòng DMS (Nhắn tin cho tôi) dòng chữ bạn nhìn thấy ở ảnh phía dưới để chứng mình rằng bạn không auto
      Bạn còn (5/5) cảnh báo
      Nếu bạn gặp vấn đề về 𝘾𝘼𝙋𝙏𝘾𝙃𝘼, Hãy chụp màn hình và báo vào Server Support trong bio của tôi để được trợ giúp`,
      `### !!! BẠN BỊ NGHI NGỜ AUTO, HÃY CHỨNG MINH BẠN KHÔNG AUTO BẰNG CÁCH NHẮN TIN CHO TÔI DÒNG CHỮ MÀ BẠN THẤY Ở ẢNH BÊN DƯỚI !!!
      Bạn sẽ bị ban sau 5 lần xài lệnh
      Nếu có vấn đề về 𝓒𝓐𝓟𝓣𝓒𝓗𝓐 vui lòng chụp màn hình và báo cáo với admin thông qua Server Suport trong bio của tôi !!`,
    ]
    let word = random[Math.floor(Math.random() * random.length)]
    let messagess = [
      `${word}`,
      `### 𝘾𝘼𝙋𝙏𝘾𝙃𝘼 DMS !!! DMS me with captcha to confirm you're human!
      [5/5] try left!
      If you had problem captcha solves, save this Image and Screen-shot my DMS to Support Server for get help!`
    ]
    //await client.sendFile(client, message, messagess, attachment).catch(e => console.log(e))
    //await db.set(`${message.author.id}_captchaDMS`, true)
    //await db.set(`${message.author.id}_captchaDMSText`, captchaText)
    //await db.set(`${message.author.id}_captchaDMSTime`, 5)
  }
}


module.exports = {  Captcha, BatThuThuong }

function chonthu(animals, lucky, pro, vip, heso, double) {
  let arr = []
  let point = 0
  let price = 0
  let number = []
  //dưới mỗi vòng lặp, thêm dòng number[i] = r3, nhớ thêm bên dưới r3 cho r3 thành văn bản nha = `${}`
  let hesothat = heso
  if (double) hesothat = heso * 2
  //4 logic khi hunt thú :
  if (lucky && !pro && !vip) {//logic khi chỉ dùng gem03
    for (let i = 0; i < hesothat; i++) {
      let rand = Math.random() - 0.000049;
      let vipRate = null
      let proRate = null
      let devilRate = 0.000199
      let gloryRate = 0.000799
      if (rand < devilRate) {
        arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
        point += animals.points["devil"]
        price += animals.price["devil"]
      }
      else if (rand < gloryRate) {
        arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
        point += animals.points["glory"]
        price += animals.price["glory"]
      }
      else if (rand < animals.common[0]) {
        arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
        point += animals.points["common"]
        price += animals.price["common"]
      }
      else if (rand < animals.uncommon[0]) {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
      else if (rand < animals.rare[0]) {
        arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
        point += animals.points["rare"]
        price += animals.price["rare"]
      }
      else if (rand < animals.superrare[0]) {
        arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
        point += animals.points["superrare"]
        price += animals.price["superrare"]
      }
      else if (rand < animals.epic[0]) {
        arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
        point += animals.points["epic"]
        price += animals.price["epic"]
      }
      else {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
    }
  }
  else if (pro && !lucky) {
    for (let i = 0; i < hesothat; i++) {
      let rand = Math.random() - 0.000099;
      let proRate = 0.000099
      let devilRate = 0.000199
      let gloryRate = 0.000799
      // else 
      if (rand < proRate) {
        arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
        point += animals.points["pro"]
        price += animals.price["pro"]
      }
      else if (rand < devilRate) {
        arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
        point += animals.points["devil"]
        price += animals.price["devil"]
      }
      else if (rand < gloryRate) {
        arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
        point += animals.points["glory"]
        price += animals.price["glory"]
      }
      else if (rand < animals.common[0]) {
        arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
        point += animals.points["common"]
        price += animals.price["common"]
      }
      else if (rand < animals.uncommon[0]) {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
      else if (rand < animals.rare[0]) {
        arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
        point += animals.points["rare"]
        price += animals.price["rare"]
      }
      else if (rand < animals.superrare[0]) {
        arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
        point += animals.points["superrare"]
        price += animals.price["superrare"]
      }
      else if (rand < animals.epic[0]) {
        arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
        point += animals.points["epic"]
        price += animals.price["epic"]
      }
      else {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
    }
  }
  else if (vip && !lucky) {
    for (let i = 0; i < hesothat; i++) {
      let rand = Math.random() - 0.000149;
      let vipRate = 0.0000099
      let proRate = 0.0000999
      let devilRate = 0.000199
      let gloryRate = 0.000799
      if (rand < vipRate) {
        arr.push(animals.vip[Math.ceil(Math.random() * (animals.vip.length - 1))])
        point += animals.points["vip"]
        price += animals.price["vip"]
      }

      else if (rand < proRate) {
        arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
        point += animals.points["pro"]
        price += animals.price["pro"]
      }
      else if (rand < devilRate) {
        arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
        point += animals.points["devil"]
        price += animals.price["devil"]
      }

      else if (rand < gloryRate) {
        arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
        point += animals.points["glory"]
        price += animals.price["glory"]
      }

      else if (rand < animals.common[0]) {
        arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
        point += animals.points["common"]
        price += animals.price["common"]
      }
      else if (rand < animals.uncommon[0]) {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
      else if (rand < animals.rare[0]) {
        arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
        point += animals.points["rare"]
        price += animals.price["rare"]
      }
      else if (rand < animals.superrare[0]) {
        arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
        point += animals.points["superrare"]
        price += animals.price["superrare"]
      }
      else if (rand < animals.epic[0]) {
        arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
        point += animals.points["epic"]
        price += animals.price["epic"]
      }

      else {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
    }
  }
  else if (pro && lucky) {//logic khi dùng gem03 và propassport
    for (let i = 0; i < hesothat; i++) {
      let rand = Math.random() - 0.000149;
      let vipRate = null
      let proRate = 0.0000999
      let devilRate = 0.000199
      let gloryRate = 0.000799
      if (rand < proRate) {
        arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
        point += animals.points["pro"]
        price += animals.price["pro"]
      }
      else if (rand < devilRate) {
        arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
        point += animals.points["devil"]
        price += animals.price["devil"]
      }

      else if (rand < gloryRate) {
        arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
        point += animals.points["glory"]
        price += animals.price["glory"]
      }

      else if (rand < animals.common[0]) {
        arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
        point += animals.points["common"]
        price += animals.price["common"]
      }
      else if (rand < animals.uncommon[0]) {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
      else if (rand < animals.rare[0]) {
        arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
        point += animals.points["rare"]
        price += animals.price["rare"]
      }
      else if (rand < animals.superrare[0]) {
        arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
        point += animals.points["superrare"]
        price += animals.price["superrare"]
      }
      else if (rand < animals.epic[0]) {
        arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
        point += animals.points["epic"]
        price += animals.price["epic"]
      }

      else {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
    }
  }
  else if (vip && lucky) {
    for (let i = 0; i < hesothat; i++) {
      let rand = Math.random() - 0.000199;
      let vipRate = 0.0000499
      let proRate = 0.0000999
      let devilRate = 0.000199
      let gloryRate = 0.000799
      if (rand < vipRate) {
        arr.push(animals.vip[Math.ceil(Math.random() * (animals.vip.length - 1))])
        point += animals.points["vip"]
        price += animals.price["vip"]
      }
      else if (rand < proRate) {
        arr.push(animals.pro[Math.ceil(Math.random() * (animals.pro.length - 1))])
        point += animals.points["pro"]
        price += animals.price["pro"]
      }
      else if (rand < devilRate) {
        arr.push(animals.devil[Math.ceil(Math.random() * (animals.devil.length - 1))])
        point += animals.points["devil"]
        price += animals.price["devil"]
      }
      else if (rand < gloryRate) {
        arr.push(animals.glory[Math.ceil(Math.random() * (animals.glory.length - 1))])
        point += animals.points["glory"]
        price += animals.price["glory"]
      }
      else if (rand < animals.common[0]) {
        arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
        point += animals.points["common"]
        price += animals.price["common"]
      }
      else if (rand < animals.uncommon[0]) {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
      else if (rand < animals.rare[0]) {
        arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
        point += animals.points["rare"]
        price += animals.price["rare"]
      }
      else if (rand < animals.superrare[0]) {
        arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
        point += animals.points["superrare"]
        price += animals.price["superrare"]
      }
      else if (rand < animals.epic[0]) {
        arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
        point += animals.points["epic"]
        price += animals.price["epic"]
      }
      else {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
    }
  }
  else {//logic khi ko dùng gì cả
    for (let i = 0; i < hesothat; i++) {
      let rand = Math.random();
      if (rand < animals.common[0]) {
        arr.push(animals.common[Math.ceil(Math.random() * (animals.common.length - 1))])
        point += animals.points["common"]
        price += animals.price["common"]
      }
      else if (rand < animals.uncommon[0]) {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
      else if (rand < animals.rare[0]) {
        arr.push(animals.rare[Math.ceil(Math.random() * (animals.rare.length - 1))])
        point += animals.points["rare"]
        price += animals.price["rare"]
      }
      else if (rand < animals.superrare[0]) {
        arr.push(animals.superrare[Math.ceil(Math.random() * (animals.superrare.length - 1))])
        point += animals.points["superrare"]
        price += animals.price["superrare"]
      }
      else if (rand < animals.epic[0]) {
        arr.push(animals.epic[Math.ceil(Math.random() * (animals.epic.length - 1))])
        point += animals.points["epic"]
        price += animals.price["epic"]
      }

      else {
        arr.push(animals.uncommon[Math.ceil(Math.random() * (animals.uncommon.length - 1))])
        point += animals.points["uncommon"]
        price += animals.price["uncommon"]
      }
    }
  }

  //CHAY CODE
  return { arr: arr, point: point, price: price }
}
function checkthu(c, u, r, sr, e, p, g, d, v, thu) {
  if (c.includes(thu)) result = `common`
  if (u.includes(thu)) result = `uncommon`
  if (r.includes(thu)) result = `rare`
  if (sr.includes(thu)) result = `superrare`
  if (e.includes(thu)) result = `epic`
  if (p.includes(thu)) result = `pro`
  if (g.includes(thu)) result = `glory`
  if (d.includes(thu)) result = `devil`
  if (v.includes(thu)) result = `vip`
  return result
}
