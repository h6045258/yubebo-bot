const { LoadType } = require("shoukaku");

module.exports = {
  name: 'play',
  aliases: ['p'],
  description: {
    content: 'Phát nhạc từ đa nền tảng âm nhạc',
    example: 'play see you again',
    usage: 'play <url/name>'
  },
  category: 'Music',
  permissions: {
    bot: [],
    user: []
  },
  cooldown: 3,
  run: async (client, message, args, prefix, lang) => {
    try {
      const query = args.join(' ');
      let player = client.queue.get(message.guild.id);
      const vc = message.member;
      const voiceChannel = vc.voice.channel;
      if (voiceChannel) {
        const members = voiceChannel.members;
      }

      if (!player) {
        player = await client.queue.create(
          message.guild,
          vc.voice.channel,
          message.channel
        )
      }

      const embed = client.embed()
      const res = await client.queue.search(query);
      switch (res.loadType) {
        case LoadType.ERROR:
        message.channel.send({
            content: `Đã xảy ra lỗi khi tìm nhạc, hãy thử lại!`
          });
          break;
        case LoadType.EMPTY:
        message.channel.send({
            content: `Không tìm thấy kết quả cho tìm kiếm của bạn, hãy thử lại!`
          });
          break;
        case LoadType.TRACK: {
          const track = player.buildTrack(res.data, message.author);
          if (player.queue.length > 1000) {
          return message.channel.send({
              content: `Danh sách phát quá dài`
            });
          }
          player.queue.push(track);
          await player.isPlaying();
          message.channel.send({
            embeds: [
              embed
              .setColor(client.color.y)
              .setThumbnail(res.data.info.artworkUrl)
              .setDescription(`${client.e.done} | Đã thêm [${res.data.info.title}](${res.data.info.uri}) vào danh sách phát.`)
            ]
          });
          break;
        }
        case LoadType.PLAYLIST: {
          if (res.data.tracks.length > 1000) {
          return message.channel.send({
              content: `Playlist quá dài`
            });
          }
            for (const track of res.data.tracks) {
              const pl = player.buildTrack(track, message.author);
              if (player.queue.length > 2000) {
              return message.channel.send({
                  content: `Hàng chờ của bạn đang có quá nhiều bài`
                });
              }
              player.queue.push(pl)
            }
            await player.isPlaying();
            message.channel.send({
              embeds: [
                embed
                .setColor(client.color.y)
                .setAuthor({ name: 'Đã Thêm Playlist', iconURL: message.member.displayAvatarURL({}) })
                .setThumbnail(client.user.displayAvatarURL({}))
                .addFields([
                  { name: 'Tên Playlist', value: `[${res.data.info.name}](<${query}>)` },
                  { name: 'Tổng Số Bài', value: `${res.data.tracks.length}` },
                  { name: 'Kênh', value: `<#${player.channelId}>` }
                ])
              ]
            });
            break;
          }
          case LoadType.SEARCH: {
          const track1 = player.buildTrack(res.data[0], message.author);
          if (player.queue.length > 2000)
            return message.channel.send({
              embeds: [
                embed
                .setColor(client.color.x)
                  .setDescription(
                    `${client.e.fail} | Danh sách phát này quá dài, tối đa chỉ cho phép 2000 bài.`
                  ),
              ],
            });
          player.queue.push(track1);
          await player.isPlaying();
          message.channel.send({
            embeds: [
              embed
                .setColor(client.color.y)
                .setThumbnail(res.data[0].info.artworkUrl)
                .setDescription(
                  `${client.e.done} | Đã thêm [${res.data[0].info.title}](${res.data[0].info.uri}) vào danh sách phát.`
                ),
            ],
          });
          break;
        }
      }    
    } catch (e) {
      client.logger.error(e.stack)
    }
  }
}