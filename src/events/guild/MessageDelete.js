const { Collection } = require("discord.js");

module.exports = {
  event: "messageDelete",
  run: async (client, message) => {
    if (
      !message.guild ||
      message.guild.available === false ||
      !message.channel ||
      !message.author
    )
      return;

    if (!client.snipes.has(message.channel.id)) {
      client.snipes.set(message.channel.id, []);
    }

    const snipes = client.snipes.get(message.channel.id);
    if (snipes.length > 30) snipes.pop();

    snipes.unshift({
      channel: message.channel,
      content: message.content,
      author: message.author,
      avatar: message.author.displayAvatarURL({}),
      image: message.attachments.first()
        ? message.attachments.first().proxyURL
        : null,
      date: new Date(),
    });

    client.snipes.set(message.channel.id, snipes);
  },
};
