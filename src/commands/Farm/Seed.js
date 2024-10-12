const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: "seed",
  category: "Farm",
  aliases: ['hatgiong', 'hg', 'nongsan', 'ns', 'crop', 'cr'],
  cooldown: 15,
  description: {
    content: "Xem kho hạt giống của bạn",
    example: "crop",
    usage: "crop"
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    const invSchema = require("../../models/invSchema")
    let hg1 = client.seed.ot.emoji
    let hg2 = client.seed.lua.emoji
    let hg3 = client.seed.carot.emoji
    let hg4 = client.seed.cachua.emoji
    let hg5 = client.seed.ngo.emoji
    let hg6 = client.seed.khoaimi.emoji
    let hg7 = client.seed.khoaitay.emoji
    let hg8 = client.seed.caingot.emoji
    let hg9 = client.seed.mia.emoji
    let hg10 = client.seed.dao.emoji
    let hg11 = client.seed.dautay.emoji
    let hg12 = client.seed.duagang.emoji
    let hg13 = client.seed.mit.emoji

    let s1 = client.seed.ot.seedEmoji
    let s2 = client.seed.lua.seedEmoji
    let s3 = client.seed.carot.seedEmoji
    let s4 = client.seed.cachua.seedEmoji
    let s5 = client.seed.ngo.seedEmoji
    let s6 = client.seed.khoaimi.seedEmoji
    let s7 = client.seed.khoaitay.seedEmoji
    let s8 = client.seed.caingot.seedEmoji
    let s9 = client.seed.mia.seedEmoji
    let s10 = client.seed.dao.seedEmoji
    let s11 = client.seed.dautay.seedEmoji
    let s12 = client.seed.duagang.seedEmoji
    let s13 = client.seed.mit.seedEmoji

    let thoc = "thoc"
    let co = "co"
    let camheo = "camheo"
    let arrF = [hg1, hg2, hg3, hg4, hg5, hg6, hg7, hg8, hg9, hg10, hg11, hg12, hg13];
    let arrS = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13];
    let arrN = [thoc, co, camheo]
    let arrTL = ["trung", "sua", "thitheo"];
    let soluongF = []
    let soluongS = []
    let soluongN = []
    let soluongTL = []

    for (let a in arrF) {
      let amountFruit = await invSchema.findOne({ memberid: message.author.id, name: arrF[a], type: "ns" })
      soluongF.push(amountFruit ? amountFruit.quanlity : 0)
    }
    for (let a in arrS) {
      let amountFruit = await invSchema.findOne({ memberid: message.author.id, name: arrS[a], type: "hg" })
      soluongS.push(amountFruit ? amountFruit.quanlity : 0)
    }
    for (let a in arrN) {
      let amountFruit = await invSchema.findOne({ memberid: message.author.id, name: arrN[a], type: "food" })
      soluongN.push(amountFruit ? amountFruit.quanlity : 0)
    }
    for (let a in arrTL) {
      let amountFruit = await invSchema.findOne({ memberid: message.author.id, name: arrTL[a], type: "tulanh" })
      soluongTL.push(amountFruit ? amountFruit.quanlity : 0)
    }
    const cropembed = new EmbedBuilder()
      .setTitle(`🌾 Kho Nông Sản Của ${message.author.username} 🌾`)
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setDescription(`<a:Yngoisaohivong:919968345418268714> **Hạt Giống** :

${s1} : \`${soluongS[0]}\` ${s2} : \`${soluongS[1]}\` ${s3} : \`${soluongS[2]}\` ${s4} : \`${soluongS[3]}\` ${s5} : \`${soluongS[4]}\` 
${s6} : \`${soluongS[5]}\` ${s7} : \`${soluongS[6]}\` ${s8} : \`${soluongS[7]}\` ${s9} : \`${soluongS[8]}\` ${s10} : \`${soluongS[9]}\` 
${s11} : \`${soluongS[10]}\` ${s12} : \`${soluongS[11]}\` ${s13} : \`${soluongS[12]}\`
<a:Yngoisaohivong:919968345418268714> **Rau Củ** :

${hg1} : \`${soluongF[0]}\` ${hg2} : \`${soluongF[1]}\` ${hg3} : \`${soluongF[2]}\` ${hg4} : \`${soluongF[3]}\` ${hg5} : \`${soluongF[4]}\` 
${hg6} : \`${soluongF[5]}\` ${hg7} : \`${soluongF[6]}\` ${hg8} : \`${soluongF[7]}\` ${hg9} : \`${soluongF[8]}\` ${hg10} : \`${soluongF[9]}\` 
${hg11} : \`${soluongF[10]}\` ${hg12} : \`${soluongF[11]}\` ${hg13} : \`${soluongF[12]}\`

<a:Yngoisaohivong:919968345418268714> **Nguyên Liệu** :

<:Yu_thoc:953407482884161566> : \`${soluongN[0].toLocaleString()}\` <:Yu_co:953408530474475520> : \`${soluongN[1].toLocaleString()}\` <:Yu_camheo:953407482955436062> : \`${soluongN[2].toLocaleString()}\`

<a:Yngoisaohivong:919968345418268714> **Tủ Lạnh** :
<:eggs:1279089883918503977> : \`${soluongTL[0]}\` <:milk_1:1279089889278824458> : \`${soluongTL[1]}\` <:hamleg:1279089886460248127> : \`${soluongTL[2]}\`
`)
      .setColor(`#FFCC00`)
      .setTimestamp()
    await message.channel.send({ embeds: [cropembed] }).catch(e => console.log(e))
  }
}