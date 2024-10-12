let animal = require("../../configs/fishes.json")
module.exports = {
  name: 'banca',
  aliases: ['sf', 'sellfish'],
  category: 'Inventory',
  cooldown: 15,
  description: {
      content: 'Bán cá trong hồ cá của bạn !',
      example: 'sf all',
      usage: 'sf [all/s/f/c/]'
  },
  permissions: {
      bot: ['ViewChannel', 'SendMessages'],
      user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    let fishesSchema = require("../../models/fishesSchema")
    let authorid = message.author.id
    const fishId = {
      "1": "<:3751488:1034941169840422952>",
      "2": "<:3751471:1034941167235780720>",
      "3": "<:3751442:1034941165029568663>",
      "4": "<:2_:1029687338118430731>",
      "5": "<:3751207:1034941150227873932>",
      "6": "<:3751249:1034941152375361617>",
      "7": "<:1_:1029686391455629333>",
      "8": "<:10:1029696302159761418>",
      "9": "<:34:1029699111269715979>",
      "10": "<:3751401:1034941161573449818>",
      "11": "<:33:1029699094584766464>",
      "12": "<:17:1029696468820430878>",
      "13": "<:6_:1029689502479949886>",
      "14": "<:9_:1029693917962178592>",
      "15": "<:3_:1029687639168790548>",
      "16": "<:5042254:1034941186965786664>",
      "17": "<:5042249:1034947525922267146>",
      "18": "<:5042237:1034947519307841556>",
      "19": "<:cangua:1034945771256168479>",
      "20": "<:4516068:1034941175897018448>",
      "21": "<:5042236:1034941179088863252>",
      "22": "<:5042263:1034941189083889766>",
      "23": "<:5042261:1034947866881433631>",
      "24": "<:5042243:1034947521933492304>",
      "25": "<:5042257:1034946179336773673>",
    }
    const fishPrice = {
      "<:3751488:1034941169840422952>": 5,
      "<:3751471:1034941167235780720>": 5,
      "<:3751442:1034941165029568663>": 5,
      "<:2_:1029687338118430731>": 5,
      "<:3751207:1034941150227873932>": 5,
      "<:3751249:1034941152375361617>": 10,
      "<:1_:1029686391455629333>": 10,
      "<:10:1029696302159761418>": 10,
      "<:34:1029699111269715979>": 10,
      "<:3751401:1034941161573449818>": 10,
      "<:33:1029699094584766464>": 50,
      "<:17:1029696468820430878>": 50,
      "<:6_:1029689502479949886>": 50,
      "<:9_:1029693917962178592>": 50,
      "<:3_:1029687639168790548>": 50,
      "<:5042254:1034941186965786664>": 500,
      "<:5042249:1034947525922267146>": 500,
      "<:5042237:1034947519307841556>": 500,
      "<:cangua:1034945771256168479>": 500,
      "<:4516068:1034941175897018448>": 500,
      "<:5042236:1034941179088863252>": 1000,
      "<:5042263:1034941189083889766>": 1000,
      "<:5042261:1034947866881433631>": 1000,
      "<:5042243:1034947521933492304>": 1000,
      "<:5042257:1034946179336773673>": 1000,
    }
    const fishType = {
      "<:3751488:1034941169840422952>": "common",
      "<:3751471:1034941167235780720>": "common",
      "<:3751442:1034941165029568663>": "common",
      "<:2_:1029687338118430731>": "common",
      "<:3751207:1034941150227873932>": "common",
      "<:3751249:1034941152375361617>": "uncommon",
      "<:1_:1029686391455629333>": "uncommon",
      "<:10:1029696302159761418>": "uncommon",
      "<:34:1029699111269715979>": "uncommon",
      "<:3751401:1034941161573449818>": "uncommon",
      "<:33:1029699094584766464>": "rare",
      "<:17:1029696468820430878>": "rare",
      "<:6_:1029689502479949886>": "rare",
      "<:9_:1029693917962178592>": "rare",
      "<:3_:1029687639168790548>": "rare",
      "<:5042254:1034941186965786664>": "superrare",
      "<:5042249:1034947525922267146>": "superrare",
      "<:5042237:1034947519307841556>": "superrare",
      "<:cangua:1034945771256168479>": "superrare",
      "<:4516068:1034941175897018448>": "superrare",
      "<:5042236:1034941179088863252>": "epic",
      "<:5042263:1034941189083889766>": "epic",
      "<:5042261:1034947866881433631>": "epic",
      "<:5042243:1034947521933492304>": "epic",
      "<:5042257:1034946179336773673>": "epic",
    }
    let allName = ``
    let money = 0
    if (args.length <= 2) {
      if (args[0] !== `all`) {
        let fishToSell = args[0]
        let quanlity = args[1]
        let fishes = await fishesSchema.findOne({ id: authorid, name: fishId[fishToSell] })
        if (args[1] == 'all') quanlity = fishes.quanlity
        //fishes.forEach(async f => {
        if (!fishes || quanlity > fishes.quanlity || isNaN(quanlity)) return;
        let name = fishes.name
        fishes.quanlity -= quanlity
        fishes.type = checkthu(animal.common, animal.uncommon, animal.rare, animal.superrare, animal.epic, animal.pro, animal.glory, animal.devil, animal.vip, fishType[name])
        await fishes.save()
        allName += `${fishId[fishToSell]}, `
        money += fishPrice[fishId[fishToSell]] * quanlity
        //})
        await client.cong(authorid, money)
        await message.reply(`${client.e.done} | **__${message.author.username}__** đã bán **${quanlity}** ${allName} và thu được **__${parseInt(money).toLocaleString("en-us")}__** Ycoin`)
      }
      else if (args[0] == `all`) {
        let fishes = await fishesSchema.find({ id: authorid, quanlity: { $gt: 0 } })
        if (!fishes[0]) return;
        fishes.forEach(async f => {
          let type = checkthu(animal.common, animal.uncommon, animal.rare, animal.superrare, animal.epic, animal.pro, animal.glory, animal.devil, animal.vip, f.name)
          money += fishPrice[f.name] * f.quanlity
          allName += `**__${parseInt(f.quanlity).toLocaleString("En-Us")}__** ${f.name}`
          f.quanlity = 0
          f.type = type
          await f.save()
        })
        await client.cong(authorid, money)
        await message.reply(`${client.e.done} | **__${message.author.username}__** đã bán ${allName} và thu được **__${parseInt(money).toLocaleString("en-us")}__** Ycoin`)
      }
    }
    else {
      for (let i = 0; i < args.length; i++) {
        let 
      }
    }
  }
}
function checkthu(c, u, r, sr, e, p, g, d, v, thu) {
  let result
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