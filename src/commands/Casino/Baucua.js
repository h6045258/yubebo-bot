const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const Guild = require('../../models/guildModel');

module.exports = {
  name: "baucua",
  category: "Casino",
  aliases: ["bc"],
  cooldown: 3,
  description: {
    content: "Đổ bầu cua, cùng bạn bè thư giãn",
    example: "bc",
    usage: "bc"
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
        `${client.e.done} | Đã set thành công role host bầu cua! Chỉ có host được lắc!`

      await message.reply(Set);
    } else {
      let guildData = await Guild.findOne({ guildId: message.guild.id });

      if (!guildData || !guildData.hostBauCuaRoleId) {
        let fails =
          `${client.e.fail} | Bạn phải là HOST thì mới được lắc bầu cua!
          > Ybc set <ID ROLE HOST>
          > \`Ybc check\` to để check role host hiện tại`

        return message.reply(fails);
      }

      let hostrole = guildData.hostBauCuaRoleId;
      console.log(hostrole);

      let fails =
        `${client.e.fail} | Bạn phải là HOST thì mới được lắc bầu cua!
        > Ybc set <ID ROLE HOST>
        > \`Ybc check\` to để check role host hiện tại`

      let guild = client.guilds.cache.find(g => g.id == message.guild.id);
      const memberTarget = message.guild.members.cache.get(message.author.id);
      const role = message.guild.roles.cache.find(role => role.id === hostrole);

      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !memberTarget.roles.cache.has(role.id)) {
        return message.reply(fails);
      }
      let thuArray = [
        "<:Yu_ga:1035685230222266451>",
        "<:Yu_bau:1035685221078683658>",
        "<:Yu_cua:1035685224249565204>",
        "<:Yu_ca:1035685227890233424>",
        "<:Yu_nai:1035685233099558923>",
        "<:Yu_tom:1035685235603542078>"
      ]
      let CauBauCua = await db.get(`CauBauCua`)
      if (!CauBauCua) await db.set(`CauBauCua`, thuArray)
      let time = await db.get(`soLanLac`)
      if (!time) await db.set(`soLanLac`, 1)
      if (time >= 5) {
        cau = shuffle(thuArray)
        await db.set(`CauBauCua`, cau)
        await db.set(`soLanLac`, 1)
      }
      let thu = await db.get(`CauBauCua`)
      await db.add(`soLanLac`, 1)

      // 
      let thuString = {
        "<:Yu_ga:1035685230222266451>": "**Gà**",
        "<:Yu_nai:1035685233099558923>": "**Nai**",
        "<:Yu_tom:1035685235603542078>": "**Tôm**",
        "<:Yu_bau:1035685221078683658>": "**Bầu**",
        "<:Yu_cua:1035685224249565204>": "**Cua**",
        "<:Yu_ca:1035685227890233424>": "**Cá**"
      }
      let con1 = thu[Math.floor(Math.random() * thu.length)]
      let con2 = thu[Math.floor(Math.random() * thu.length)]
      let con3 = thu[Math.floor(Math.random() * thu.length)]
      let thuS1 = thuString[con1]
      let thuS2 = thuString[con2]
      let thuS3 = thuString[con3]
      let msgss =
        "<a:Yu_baucua:1035686579081060392> **| Lắc, lắc, lắc, may túi ba gang, giữ tiền cho chắc...**"
      let msg = await message.reply(msgss).catch(e => console.log(e))
      await msg.edit(`<a:Yu_baucua:1035686579081060392> <a:Yu_baucua:1035686579081060392> <a:Yu_baucua:1035686579081060392>`)
      await client.sleep(5000)
      await msg.edit(`${con1} <a:Yu_baucua:1035686579081060392> <a:Yu_baucua:1035686579081060392>`)
      await client.sleep(3000)
      await msg.edit(`${con1} ${con2} <a:Yu_baucua:1035686579081060392>`)
      await client.sleep(3000)
      await msg.edit(`${con1} ${con2} ${con3}`)
      let res =
        `Kết quả là: __${thuS1} • ${thuS2} • ${thuS3}__`
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
