const { PermissionsBitField } = require(`discord.js`)
module.exports = {
  name: "enable",
  category: "Config",
  aliases: ["en", "ec", "enablecommands", "allow"],
  cooldown: 3,
  description: {
    content: "Kích hoạt một lệnh / một danh mục lệnh hoặc tất cả các lệnh trong kênh",
    example: "enable cash (cash là 1 lệnh) hoặc economy (economy là 1 danh mục)",
    usage: "enable <command/category"
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ['Administrator']
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
    const { readdirSync } = require('fs');

    const { QuickDB } = require('quick.db')
    const db = new QuickDB({ table: "DB" })
    let errorPerms =
      `${client.e.fail} | Bạn phải có quyền \`ADMINISTRATOR\` để cài đặt lệnh trong guild này!`
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await message.channel.send(errorPerms).catch(e => console.log(e))

    const done = client.e.done
    const err = client.e.fail
    if (!args[0]) return
    if (args[0] == `all`) {
      var cms;
      readdirSync("./src/commands").forEach(async (dir) => {
        const commands = readdirSync(`./src/commands/${dir}/`).filter(async (file) => file.endsWith(".js"));
        for (let file of commands) {
          if (dir == `Dev` || dir == `Config`) continue;
          let pull = require(`../../commands/${dir}/${file}`);
          if (pull) await db.set(`${message.channel.id}_${pull.name}`, `true`), cms += pull.name
        }
      })
      let messages =
        `${client.e.done} | Đã kích hoạt tất cả lệnh trong kênh!`
      await message.channel.send(messages).catch(e => console.log(e))
      console.log(cms)
    } else {
      let commandsa = []
      for (var i = 0; i < args.length; i++) {
        if (args[i].length === 0) return;
        let command =
          client.commands.get(args[i]) ||
          client.commands.find((command) => command.aliases && command.aliases.includes(args[i]));
        let errorName =
          `${err} | Không tìm thấy lệnh ${args[i]}`
        if (!command) return await message.channel.send(errorName).catch(e => console.log(e))
        if (command) await db.set(`${message.channel.id}_${command.name}`, `true`)
        if (command) commandsa[i] = command.name
      }
      let messagess =
        `${done} | Lệnh \`${commandsa}\` đã được **Kích Hoạt** trong kênh <#${message.channel.id}>!`
      await message.channel.send(messagess).catch(e => console.log(e))
    }
  }
}
