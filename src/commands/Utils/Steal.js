const { parseEmoji } = require("discord.js");

module.exports = {
  name: 'steal',
    aliases: ['se'],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Ăn cắp emoji từ server khác về server hiện tại !',
        example: 'steal :hihihi: hehe',
        usage: 'steal <emoji> <name>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
  async execute(client, message, args, prefix, lang) {
    let emoji;
    const custom = parseEmoji(args[0]);
    if (custom && custom.id) emoji = custom;
    else
      return message.channel.send({
        content: lang.utils.steal_1.replace(
          "{value}",
          message.member.displayName,
        ),
      });
    if (!args[0]) {
      return message.channel.send({
        content: lang.utils.steal_2.replace(
          "{value}",
          message.member.displayName,
        ),
      });
    }
    if (emoji.id)
      emoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;
    await message.guild.emojis.create({
      attachment: emoji,
      name: args.slice(1).join(" "),
    });
    await message.react(client.e.done);
  },
};
