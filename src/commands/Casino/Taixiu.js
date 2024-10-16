const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const Guild = require('../../models/guildModel');
module.exports = {
  name: "taixiu",
  category: "Casino",
  aliases: ["tx"],
  cooldown: 3,
  description: {
    content: "Đổ tài xỉu, cùng bạn bè thư giãn",
    example: "tx",
    usage: "tx"
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
  },
  /**
   * 
   * @param {import('discord.js').Client} client
   * @param {*} message 
   * @param {*} args 
   * @param {client.prefix('prefix')} prefix 
   * @param {client.la('lang')} lang 
   * @returns 
   */
  run: async (client, message, args, prefix, lang) => {
    const { QuickDB } = require("quick.db");
    const db = new QuickDB({ table: "DB" });
    if (args[0] == "check") {
      let guildData = await Guild.findOne({ guildId: message.guild.id });
      if (guildData) {
        const emb = new EmbedBuilder()
          .setTitle("Casino Role")
          .setDescription(`Role Host Casino hiện tại là: <@&${guildData.hostBauCuaRoleId}>`)
        return message.channel.send({ embeds: [emb] })
      }
      if (!guildData) {
        return message.channel.send(":x: | Server này chưa được set role host. Vui lòng soạn \`Ybc set <idrole>\` để setup role casino.\nEx: Ybc set 280018231237123")
      }
    }
    if (args[0] == "set") {
      let fails =
        `${client.e.fail} | Bạn phải là admin server thì mới được set role host!`

      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply(fails);
      }

      let roleId = args[1];

      let guildData = await Guild.findOne({ guildId: message.guild.id });

      if (!guildData) {
        guildData = new Guild({ guildId: message.guild.id });
      }

      guildData.hostBauCuaRoleId = roleId;
      await guildData.save();

      let Set =
        `${client.e.done} | Đã set thành công role host tài xỉu! Chỉ có host được lắc!`

      await message.reply(Set);
    } else {
      let guildData = await Guild.findOne({ guildId: message.guild.id });

      if (!guildData || !guildData.hostBauCuaRoleId) {
        let fails =
          `${client.e.fail} | Bạn phải là HOST thì mới được lắc tài xỉu!
          > Ybc set <ID ROLE HOST>
          > \`Ybc check\` to để check role host hiện tại`

        return message.reply(fails);
      }

      let hostrole = guildData.hostBauCuaRoleId;
      console.log(hostrole);

      let fails =
        `${client.e.fail} | Bạn phải là HOST thì mới được lắc tài xỉu!
        > Ytx set <ID ROLE HOST>
        > \`Ytx check\` to để check role host hiện tại`

      let guild = client.guilds.cache.find(g => g.id == message.guild.id);
      const memberTarget = message.guild.members.cache.get(message.author.id);
      const role = message.guild.roles.cache.find(role => role.id === hostrole);

      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !memberTarget.roles.cache.has(role.id)) {
        return message.reply(fails);
      }
      let thuArray = [
        "<:Ytx_1:1031866523708555335>",
        "<:Ytx_2:1031866428812439562>",
        "<:Ytx_3:1031866398923816982>",
        "<:Ytx_4:1031866367089066044>",
        "<:Ytx_5:1031866336835534868>",
        "<:Ytx_6:1031866305663483944>",
      ]
      let CauTaiXiu = await db.get(`CauTaiXiu`)
      if (!CauTaiXiu) await db.set(`CauTaiXiu`, thuArray)
      let time = await db.get(`soLanLacTX`)
      if (!time) await db.set(`soLanLacTX`, 1)
      if (time >= 5) {
        cau = shuffle(thuArray)
        await db.set(`CauTaiXiu`, cau)
        await db.set(`soLanLacTX`, 1)
      }
      let thu = await db.get(`CauTaiXiu`)
      await db.add(`soLanLacTX`, 1)
      let thuString = {
        "<:Ytx_1:1031866523708555335>": "**Một**",
        "<:Ytx_2:1031866428812439562>": "**Hai**",
        "<:Ytx_3:1031866398923816982>": "**Ba**",
        "<:Ytx_4:1031866367089066044>": "**Bốn**",
        "<:Ytx_5:1031866336835534868>": "**Năm**",
        "<:Ytx_6:1031866305663483944>": "**Sáu**"
      }
      let con1 = thu[Math.floor(Math.random() * thu.length)]
      let con2 = thu[Math.floor(Math.random() * thu.length)]
      let con3 = thu[Math.floor(Math.random() * thu.length)]
      let thuS1 = thuString[con1]
      let thuS2 = thuString[con2]
      let thuS3 = thuString[con3]
      let msgss =
        "<a:DiceDice:1031872079500427324> **| Lắc, lắc, lắc, may túi ba gang, giữ tiền cho chắc...**"
      let msg = await message.reply(msgss).catch(e => console.log(e))
      await msg.edit(`<a:DiceDice:1031872079500427324> <a:DiceDice:1031872079500427324> <a:DiceDice:1031872079500427324>`)
      await client.sleep(1000)
      await msg.edit(`${con1} <a:DiceDice:1031872079500427324> <a:DiceDice:1031872079500427324>`)
      await client.sleep(1000)
      await msg.edit(`${con1} ${con2} <a:DiceDice:1031872079500427324>`)
      await client.sleep(1000)
      await msg.edit(`${con1} ${con2} ${con3}`)
      let quan = {
        "<:Ytx_1:1031866523708555335>": 1,
        "<:Ytx_2:1031866428812439562>": 2,
        "<:Ytx_3:1031866398923816982>": 3,
        "<:Ytx_4:1031866367089066044>": 4,
        "<:Ytx_5:1031866336835534868>": 5,
        "<:Ytx_6:1031866305663483944>": 6
      }
      let so1 = quan[con1]
      let so2 = quan[con2]
      let so3 = quan[con3]
      let tong = so1 + so2 + so3
      let ketqua
      let ketqua2
      if (tong >= 11) ketqua = "**Tài**"
      else if (tong < 11) ketqua = "**Xỉu**"
      if (tong % 2 == 0) ketqua2 = "**Chẵn**"
      else ketqua2 = "**Lẻ**"
      let ketqua3 = "";
      if (so1 == so2 && so2 == so3) ketqua3 = "**Nổ Hũ!**"
      let ketquaString = `__${ketqua} ${ketqua2} ${ketqua3}__`
      let res =
        `Kết quả là: __${thuS1} • ${thuS2} • ${thuS3}__
<a:yl_muiten02:901921065117306920> ${ketquaString} - ${tong}`
      await message.channel.send(res).catch(e => console.log(e))
    }
  }
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
