const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const isInTrading = new Map();
module.exports = {
  name: "give",
  category: "Economy",
  aliases: ["chuyentien", "ct", "send", "tf"],
  cooldown: 5,
  description: {
    content: "Chuyển tiền của bạn sang người khác",
    example: "give @Yubabe 50000 (Đảm bảo số tiền của bạn đủ để chuyển) và thao tác đúng hạn",
    usage: "give <@user> <amount>",
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
    const member =
      message.mentions.members.first() ||
      client.users.cache.find((u) => u.id == args[0] || u.id == args[1]);

    if (isInTrading.has(message.author.id)) return message.reply("You have a trading section is not complete!").then(msg => setTimeout(() => msg.delete(), 15000));
    if (!member) {
      return message.channel.send({
        content: lang.economy.give_1,
      });
    }

    if (
      member.id == message.author.id &&
      message.mentions.members.first().id == message.author.id
    ) {
      return message.channel.send({
        content: lang.economy.give_2,
      });
    }

    let target = args[1];

    if (target?.includes(member.id)) target = args[0];
    if (!target) {
      return message.channel.send({
        content: lang.economy.give_3,
      });
    }

    if (isNaN(target) || !Number(target)) {
      return message.channel.send({
        content: lang.economy.give_4,
      });
    }

    if (parseInt(target) <= 0) {
      return message.channel.send({
        content: lang.economy.give_5,
      });
    }

    const convert = parseInt(target);
    const authorCash = await client.cash(message.author.id);
    const memberCash = await client.cash(member.id);

    if (authorCash < convert) {
      return message.channel.send({
        content: lang.economy.give_6,
      });
    }

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setEmoji(client.e.done)
      .setLabel(lang.economy.give_7)
      .setStyle(ButtonStyle.Success);
    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setEmoji(client.e.fail)
      .setLabel(lang.economy.give_8)
      .setStyle(ButtonStyle.Danger);

    const giveRow = new ActionRowBuilder().addComponents(confirm, cancel);

    const embed = client
      .embed()
      .setColor(client.color.y)
      .setAuthor({
        name: lang.economy.give_9,
        iconURL: message.member.displayAvatarURL({}),
      })
      .setDescription(
        lang.economy.give_10
          .replaceAll("{value1}", message.author)
          .replaceAll("{value2}", member)
          .replace("{value3}", convert.toLocaleString()),
      )
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL({}),
      })
      .setTimestamp();

    const ctx = await message.channel.send({
      embeds: [embed],
      components: [giveRow],
    });

    const filter = (i) => i.user.id === message.author.id;
    const collector = ctx.createMessageComponentCollector({
      filter,
      time: 60000,
    });
    isInTrading.set(message.author.id, true);
    isInTrading.set(member.id, true);

    collector.on("collect", async (i) => {
      if (!i.isButton()) return;
      if (i.user.id !== message.author.id)
        return i.reply({
          content: `${client.e.fail} | ${lang.economy.give_11}`,
          ephemeral: true,
        });

      if (i.customId === "confirm") {
        isInTrading.delete(message.author.id);
        isInTrading.delete(member.id);
        // Kiểm tra số dư của người gửi trước khi tiến hành giao dịch
        const updatedAuthorCash = await client.cash(message.author.id);
        if (updatedAuthorCash < convert) {
          return i.update({
            content: lang.economy.give_6,
            embeds: [],
            components: [],
          });
        }

        // Lưu lại số tiền trước và sau khi giao dịch
        const authorCashBefore = authorCash;
        const memberCashBefore = memberCash;

        await client.cong(member.id, convert);
        await client.tru(message.author.id, convert);

        const authorCashAfter = await client.cash(message.author.id);
        const memberCashAfter = await client.cash(member.id);

        i.update({
          content: lang.economy.give_12
            .replace("{value1}", message.author)
            .replace("{value2}", member)
            .replace("{value3}", convert.toLocaleString()),
          embeds: [],
          components: [],
        });

        // Gửi log về kênh chỉ định
        const logChannelId = '1275199094285008997'; // Thay bằng ID kênh log của bạn
        const logChannel = client.channels.cache.get(logChannelId);

        if (logChannel) {
          const eb = new EmbedBuilder()
            .setDescription(`- **Tên server:** **${message.guild.name}** (ID: ${message.guild.id})
- **Tên kênh:** **${message.channel.name}** (ID: ${message.channel.id})
========
- **Người gửi:** **${message.author.tag}** (ID: ${message.author.id})
- **Số dư trước:** **${authorCashBefore.toLocaleString()}**
- **Số dư sau:** **${authorCashAfter.toLocaleString()}**
========
- **Người nhận:** **${member.user.tag}** (ID: ${member.id})
- **Số dư trước:** **${memberCashBefore.toLocaleString()}**
- **Số dư sau:** **${memberCashAfter.toLocaleString()}**
========
- **Số tiền chuyển:** **${convert.toLocaleString()}**`);
          logChannel.send({
            content: `💸 **LOG GIAO DỊCH:**`,
            embeds: [eb]
          });
        }
      } else if (i.customId === "cancel") {
        embed.setColor(client.color.x);
        embed.setDescription(lang.economy.give_13);
        i.update({ embeds: [embed], components: [] });
        isInTrading.delete(message.author.id);
        isInTrading.delete(member.id);
      }
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        confirm.setDisabled(true);
        cancel.setDisabled(true);
        embed.setColor(client.color.x);
        embed.setDescription(lang.economy.give_14);
        ctx.edit({ embeds: [embed], components: [giveRow] });
      }
    });
  },
};
