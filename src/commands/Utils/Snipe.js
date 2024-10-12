module.exports = {
  name: 'snipe',
    aliases: ['sn'],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Xem lại tin nhắn vừa bị xóa !',
        example: 'snipe',
        usage: 'snipe'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: 'ManageMessages'
    },
  run: async (client, message, args, prefix, lang) => {
    const snipes = client.snipes.get(message.channel.id);
    if (!snipes)
      return message.lang.utils.snipe.channel.send({
        content: _1,
      });

    const getSnipe = (index) => {
      const tnxoa = snipes[index];
      const { content, image, author, date } = tnxoa;
      const time = (Date.now() - date.getTime()) / 1000;

      const embed = client
        .embed()
        .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
        .setDescription(`${content.length != 0 ? content : lang.utils.snipe_3}`)
        .setFooter({
          text: `${secondsToDhms(time, lang)} ${lang.utils.snipe_4} | ${index + 1}/${snipes.length}`,
        })
        .setColor(client.color.y);
      if (image) {
        embed.setImage(image);
      }
      return embed;
    };

    const pages = snipes.map((_, index) => getSnipe(index));

    await client.swap(message, pages);
  },
};

function secondsToDhms(seconds, lang) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay =
    d > 0 ? d + (d == 1 ? ` ${lang.main.day}, ` : ` ${lang.main.day}, `) : "";
  const hDisplay =
    h > 0 ? h + (h == 1 ? ` ${lang.main.hour}, ` : ` ${lang.main.hour}, `) : "";
  const mDisplay =
    m > 0 ? m + (m == 1 ? ` ${lang.main.minute}, ` : ` ${lang.main.minute}, `) : "";
  const sDisplay =
    s > 0 ? s + (s == 1 ? ` ${lang.main.second}` : ` ${lang.main.second}`) : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}
