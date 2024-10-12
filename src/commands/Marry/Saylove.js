
const userReg = RegExp(/<@!?(\d+)>/)
const marrySchema = require('../../models/marrySchema');
const { EmbedBuilder } = require("discord.js")
module.exports = {
  name: 'saylove',
  aliases: ["yeuem", 'yeuanh', 'iuem', 'iuanh', 'loveyou', 'iuxop', 'dumamay', 'ditmemay', 'iuchi', 'yeuchi'],
  category: 'Marry',
  cooldown: 300,
  description: {
      content: 'Nói lời yêu nhau khi còn có thể !',
      example: 'iuem',
      usage: 'iuem'
  },
  permissions: {
      bot: ['ViewChannel', 'SendMessages'],
      user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    const husband = message.author
    const data = await marrySchema.findOne({ authorid: message.author.id })
    const error = 
      `Yêu thì cưới đi chời! Nói suông...`
    if (!data) return await message.channel.send(error)
    const vkid = data.wifeid
    const lovedata = await marrySchema.findOne({ authorid: vkid })
    const thanmatck = data.together || 0
    data.together += 1
    await data.save()
    if (lovedata) lovedata.together = thanmatck + 1
    await lovedata.save()
    const tm = thanmatck + 1;
    if (message.author.id === "655414799454437384") {
      await message.channel.send(`**Adu vjp, <@${husband.id}> đã ôm hun <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần gòi kìa !** <a:tcp_blobloveletter:1230958507293933699>`).catch(e => console.log(e))
    }
    else if (message.author.id === "696893548863422494") {
      await message.channel.send(`>>> **Âu sít, <@${husband.id}> đã quánh đíc <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần gòi kìa <a:yb_yeuyeu:1253033929666199634> !**`).catch(e => console.log(e))
    }
    else if (message.author.id === "1025114658539053138") {
      await message.channel.send(`<@${husband.id}> hun <@${vkid}> **__${tm.toLocaleString('en-us')}__** cái <:yl_ngaiqua:1140069424972439602><:yl_ngaiqua:1140069424972439602>!`).catch(e => console.log(e))
    }
    else if (message.author.id === "1195025087116615703") {
      await message.channel.send(`**Adu vjp, <@${husband.id}> đã ôm hun <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần gòi kìa !** <a:tcp_blobloveletter:1230958507293933699>`).catch(e => console.log(e))
    }
    else if (message.author.id === "1111663085846003793") {
      await message.channel.send(`**Adu vjp, <@${husband.id}> đã ôm hun <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần gòi kìa !** <a:tcp_blobloveletter:1230958507293933699>`).catch(e => console.log(e))
    }
    else if (message.author.id === "884375748662661120") {
      await message.channel.send(`**thi sĩ <@${husband.id}> đã tặng nàng thơ <@${vkid}> __${tm.toLocaleString('en-us')}__ bức hoạ tình !**`).catch(e => console.log(e))
    }
    else if (message.author.id === "562199263178653696") {
      await message.channel.send(`Quá trời rồi, <@${husband.id}> đã kêu <@${vkid}> đi ngủ **__${tm.toLocaleString('en-us')}__** lần <:Yl_concacgie:925550246732394516>`)
    }

    else if (message.author.id === "931410874084773969") {
      await message.channel.send(`**Ui dào, <@${husband.id}> này! Hương thơm phảng phất, đã làm trái tim <@${vkid}> rung động __${tm.toLocaleString('en-us')}__ lần rồi kìa.** <a:Yl_tim:948207713328959538>`)
    }
    else if (message.author.id === "655257495769448488") {
      await message.channel.send(`**Ui dào, <@${husband.id}> này! Hương thơm phảng phất, đã làm trái tim <@${vkid}> rung động __${tm.toLocaleString('en-us')}__ lần rồi kìa.** <a:Yl_tim:948207713328959538>`)

    }
    else if (message.author.id == "512984785262739457") {
      await message.channel.send(`**Quái thú <@${husband.id}> đã nói yêu người đẹp <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần rồi nè <:1164137991866957854:1233309781805109289> **`)
    }
    else if (message.author.id == "1088353513349853256") {
      await message.channel.send(`**<@${husband.id}> đã đưa <@${vkid}> lên sofa xem phim như ở CGV __${tm.toLocaleString('en-us')}__ lần <a:yl_muacot:1109793897879715861> **`)
    }
    else if (message.author.id == "650516583738769428") {
      await message.channel.send(`**<@${husband.id}> đã đưa <@${vkid}> lên sofa xem phim như ở CGV __${tm.toLocaleString('en-us')}__ lần <a:yl_muacot:1109793897879715861> **`)
    }
    else if (message.author.id == "1156949163985088573") {
      await message.channel.send(`**Vclll... <@${husband.id}> đã hunn đc <@${vkid}> __${tm.toLocaleString('en-us')}__ lần rùi nekkk <:tcp_bunnydrool:1230964529664491622>**`)
    }

    else if (message.author.id == "1147291659516772382") {
      await message.channel.send(`**aaaa, <@${husband.id}> đã thơm má <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần gòi kìa !**`)
    }
    else if (message.author.id == "883021701120684073") {
      await message.channel.send(`**aaaa, <@${husband.id}> đã thơm má <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần gòi kìa !**`)
    }

    
    else if (message.author.id === "851124504902238229") {
      await message.channel.send(`>>> **Òi oi, <@${husband.id}> đã thơm má <@${vkid}> được __${tm.toLocaleString('en-us')}__ lần gòi kìa !**`).catch(e => console.log(e))
    }
    else if (message.author.id === "1137665463766237244") {
      await message.channel.send(`>>> <a:yb_thodao:1253530446776500225> Ping pingg <:yb_gaogao:1253538602210689085> **<@${husband.id}>** đã gửi __${tm.toLocaleString('en-us')}__ video top top cho **<@${vkid}>** <a:emoji_106:1253533555393564772>iu thì ping lại <a:emoji_88:1253531534263058524>!`).catch(e => console.log(e))
    }
    else if (message.author.id === "869614723283435602") {
      await message.channel.send(`> **Yeee, <@${husband.id}> đã hun môi <@${vkid}> __${tm.toLocaleString('en-us')}__ lần rùi <a:emoji_331:1258304638919118879>**`).catch(e => console.log(e))
    }
    else if (message.author.id === "756114367791235122") {
      await message.channel.send(`" Dị ó hỏ... <@${husband.id}> đã Mukbang <@${vkid}>! Hai bạn đã Mukbang được __${tm.toLocaleString('en-us')}__ lần gòi kìa! Quá đã ~ <a:custom1:1265992165428035687> `).catch(e => console.log(e))
    }
    else if (message.author.id === "1160654242143547552") {
      await message.channel.send(`" Dị ó hỏ... <@${husband.id}> đã Mukbang <@${vkid}>! Hai bạn đã Mukbang được __${tm.toLocaleString('en-us')}__ lần gòi kìa! Quá đã ~ <a:custom1:1265992165428035687> `).catch(e => console.log(e))
    }
    else if (message.author.id === "967114432163491960") {
      await message.channel.send(`<@${husband.id}> đã cho mèo <@${vkid}> ăn __${tm.toLocaleString('en-us')}__ lần <a:emoji_330:1258304611157147678>`).catch(e => console.log(e))
    }
    else if (message.author.id === "696297742950989845") {
      await message.channel.send(`<@${husband.id}> threw <@${vkid}> into the bed __${tm.toLocaleString('en-us')}__ <a:emoji_hugg:1272554133508849748>`).catch(e => console.log(e))
    }

    else if (message.author.id === "") {
      const eb = new EmbedBuilder()
        .setDescription(`**Em à, dù thế giới có đổi thay thế nào đi chăng nữa, Em hãy nhớ một điều rằng; “Anh yêu Em”. Điều đó mãi mãi không ai có thể thay đổi được <:IuemCuccu:1236383885877711010>**\n**<@${husband.id}>** đã nói yêu **<@${vkid}>** được **__${tm.toLocaleString('en-us')}__** lần rồi.`)
        .setThumbnail("https://media.discordapp.net/attachments/1237321892512272475/1237330844385808454/Tao-anh-ong-trong-powerpoint-1.gif")
      await message.reply({ embeds: [eb] }).catch(e => console.log(e))
    }
    else if (message.author.id === "") {
      const eb = new EmbedBuilder()
        .setDescription(`**Anh à, dù thế giới có đổi thay thế nào đi chăng nữa, Anh hãy nhớ một điều rằng; “Em yêu Anh”. Điều đó mãi mãi không ai có thể thay đổi được** <:iuemCuccu:1236383934301077544>\n**<@${husband.id}>** đã nói yêu **<@${vkid}>** được **__${tm.toLocaleString('en-us')}__** lần rồi.`)
        .setThumbnail("https://media.discordapp.net/attachments/1237321892512272475/1237330844385808454/Tao-anh-ong-trong-powerpoint-1.gif")
      await message.reply({ embeds: [eb] }).catch(e => console.log(e))
    }
    else if (message.author.id === "788393593051021342") {
      await message.channel.send(`next level <a:emoji_227:1258230726667665490> <@${husband.id}> đã cùng <@${vkid}> đi đến concert của aespa __**${tm.toLocaleString('en-us')}**__ <a:yb_yeuuvai:1253033824615661609>`)
    }
    else if (message.author.id === "1117881151042883676") {
      const eb = new EmbedBuilder()
      .setDescription(`"The world is dull, but it has you.\n(Thế gian vô vị, nhưng nó lại có anh)" _thoxinh  \nCòn cuộc sống của anh thật thú vị từ khi có em. _baptramtinh  \n**<@${husband.id}>** đã nói yêu **<@${vkid}>__${tm.toLocaleString('en-us')}__** lần rồi
      `)
        .setThumbnail("https://cdn.discordapp.com/emojis/1239117250661711902.gif")
      await message.reply({ embeds: [eb] }).catch(e => console.log(e))
    }
    else if (message.author.id === "1203593506069807104") {
      const eb = new EmbedBuilder()
      .setDescription(`"The world is dull, but it has you.\n(Thế gian vô vị, nhưng nó lại có anh)" _thoxinh  \nCòn cuộc sống của anh thật thú vị từ khi có em. _baptramtinh  \n**<@${husband.id}>** đã nói yêu **<@${vkid}>__${tm.toLocaleString('en-us')}__** lần rồi
      `)
        .setThumbnail("https://cdn.discordapp.com/emojis/1239117250661711902.gif")
      await message.reply({ embeds: [eb] }).catch(e => console.log(e))
    }
    else {
      let content = 
        `Dữ vậy chời... <@${husband.id}> đã nói lời yêu với <@${vkid}>! Hai bạn được **${tm.toLocaleString('en-us')}** điểm thân mật~ ${client.i("iuem")} `
      let custom = await client.custom(message.author.id, "love", false)
      if (custom) {
        const u1 = message.author.username
        const u2 = await client.users.cache.find(e => e.id == vkid)
        const u3 = u2.username
        let startContent = custom
        let moneyText = "{love}"
        console.log(startContent)
        if (!startContent.includes(moneyText)) startContent += "{love}"
        let newcontent = startContent
          .replaceAll(/\\n/g, "\n")
          .replaceAll(/{wife}/g, `<@${vkid}>`)
          .replaceAll(/{wifename}/g, u3)
          .replaceAll(/{husband}/g, `<@${husband.id}>`)
          .replaceAll(/{husbandname}/g, u1)
          .replaceAll(/{love}/g, `${tm.toLocaleString('en-us')}`)
        content = [
          newcontent,
          newcontent
        ]
      }
      await message.channel.send(content).catch(e => console.log(e))
    }
  }
}