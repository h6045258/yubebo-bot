const calc = require("ez-calculator");

module.exports = {
  name: "calculator",
  aliases: ["calc", "cal", "math"],
  category: "Utils",
  cooldown: 3,
  description: {
    content: "Tính giùm bạn các phép tính đơn giản",
    example: "calculator 1+1 sẽ bằng 2",
    usage: "calculator +-*%"
  },
  permissions: {
    bot: ['SendMessages'],
    user: []
  },
  run: async (client, message, args, prefix, lang) => {
    const replaceAll = (str, find, replace) => {
      var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      return str.replace(new RegExp(escapedFind, "g"), replace);
    };

    let pheptinh = args.join("");
    let replace = pheptinh;
    pheptinh = replaceAll(pheptinh, `^`, `**`);
    const result = calc.calculate(pheptinh);
    if (!result) {
      return message.reply({
        content: `${client.e.fail} | ${lang.utils.calc_1.replace('{value}', message.member.displayName)}`,
      });
    }
    replace = replaceAll(replace, `*`, `\\*`);

    await message.reply({
      embeds: [
        client
          .embed()
          .setColor(client.color.y)
          .setAuthor({
            name: `🧮 ${lang.utils.calc_2.replace("{value}", client.user.username)} 🧮`,
            iconURL: client.user.displayAvatarURL({}),
          })
          .addFields({
            name: lang.utils.calc_3.replace("{value}", replace),
            value: lang.utils.calc_4.replace("{value}", result),
          })
          .setFooter({ text: "Nhấn giữ kết quả để copy" }),
      ],
    });
  },
};
