const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av", "avt"],
  category: "Utils",
  cooldown: 3,
  description: {
    content: "Xem avatar/banner của người khác hoặc của bạn",
    example: "avatar @Yubabe , Bạn có thể nhập Id hoặc tên của người đó nếu không muốn ping, nhập global trước tên để xem avatar của người đó tại server khác",
    usage: "avatar <[global] |@user/userId/username>"
  }, 
  permissions: {
    bot: ['ViewChannels', 'SendMessages'],
    user: '',
  },
  run: async (client, message, args, prefix, lang) => {
    try {
      let user;
      if (args[0]) {
        try {
          if (args[1] && args[1].toLowerCase() === "global") {
            args.pop();
            user = await client.GetGlobalUser(message, args);
          } else {
            user = await client.getUser(message, args);
          }
        } catch (e) {
          client.logger.error(e.stack);
          return message
            .reply({
              embeds: [
                client
                  .embed()
                  .setColor(client.color.y)
                  .setDescription(
                    `${client.e.fail} | ${lang.utils.avatar_1.replace('{value}', args)}`,
                  ),
              ],
            })
            .then(async (msg) => {
              await client.sleep(5000);
              await msg.delete();
            });
        }
      } else {
        user = message.author;
      }

      if (!user || !user.id) {
        return message
          .reply({
            embeds: [
              client
                .embed()
                .setColor(client.color.y)
                .setDescription(
                  `${client.e.fail} | ${lang.utils.avatar_2.replace('{value2}', args)}`,
                ),
            ],
          })
          .then(async (msg) => {
            await client.sleep(5000);
            await msg.delete();
          });
      }

      const authorAvatar = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("author_avatar")
        .setLabel("Avatar");
      const guildAvatar = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("guild_avatar")
        .setLabel("Server Avatar");
      const authorBanner = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("author_banner")
        .setLabel("Banner");
      const authorAvatarDis = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("author_avatar")
        .setLabel("Avatar")
        .setDisabled(true);
      const guildAvatarDis = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("guild_avatar")
        .setLabel("Server Avatar")
        .setDisabled(true);
      const authorBannerDis = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("author_banner")
        .setLabel("Banner")
        .setDisabled(true);

      const row1 = new ActionRowBuilder().addComponents(
        authorAvatarDis,
        guildAvatar,
        authorBanner,
      );
      const row2 = new ActionRowBuilder().addComponents(
        authorAvatar,
        guildAvatarDis,
        authorBanner,
      );
      const row3 = new ActionRowBuilder().addComponents(
        authorAvatar,
        guildAvatar,
        authorBannerDis,
      );

      let embed = client
        .embed()
        .setAuthor({
          name: `${user.username} Avatar`,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.color.y)
        .setImage(
          user.displayAvatarURL({
            dynamic: true,
            extension: "png",
            size: 4096,
          }),
        )
        .setFooter({
          text: message.guild.name,
          iconURL: message.guild.iconURL(),
        });

      const messageInfo = await message.channel.send({
        embeds: [embed],
        components: [row1],
      });

      const filter = (i) => i.isButton() && i.user.id === message.author.id;
      const collector = messageInfo.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "author_avatar") {
          embed.setAuthor({
            name: `${user.username} Avatar`,
            iconURL: user.displayAvatarURL(),
          });
          embed.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));
          await i.update({ embeds: [embed], components: [row1] });
        } else if (i.customId === "guild_avatar") {
          const member =
            message.guild.members.cache.get(user.id) ||
            (await message.guild.members.fetch(user.id).catch(() => null));
          if (member) {
            const memberAvatar = member.displayAvatarURL({
              extension: "png",
              size: 4096,
            });
            embed.setAuthor({
              name: `${user.username} Server Avatar`,
              iconURL: memberAvatar,
            });
            embed.setImage(memberAvatar);
          }
          await i.update({ embeds: [embed], components: [row2] });
        } else if (i.customId === "author_banner") {
          await user.fetch().then((fetchedUser) => {
            if (fetchedUser.banner) {
              embed.setAuthor({
                name: `${user.username} Banner`,
                iconURL: user.displayAvatarURL(),
              });
              embed.setImage(
                fetchedUser.bannerURL({ dynamic: true, size: 4096 }),
              );
            }
          });
          await i.update({ embeds: [embed], components: [row3] });
        }
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          messageInfo.edit({ embeds: [embed], components: [] });
        }
      });
    } catch (e) {
      client.logger.error(e.stack);
      return message
        .reply({
          embeds: [
            client
              .embed()
              .setColor(client.color.x)
              .setDescription(
                `${client.e.fail} | ${lang.utils.prefix_3}`,
              ),
          ],
        })
        .then(async (msg) => {
          await client.sleep(5000);
          await msg.delete();
        });
    }
  },
};