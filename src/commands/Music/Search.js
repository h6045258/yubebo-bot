const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { LoadType } = require('shoukaku');

module.exports = {
    name: 'search',
    aliases: [],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Tìm kiếm nhạc dựa trên kết quả tìm kiếm',
        example: 'search waiting for you',
        usage: 'search <tên bài/url>'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        let player = client.queue.get(message.guild.id);
        const query = args.join(' ');

        if (!player) {
            const vc = message.member;
            player = await client.queue.create(
                message.guild,
                vc.voice.channel,
                message.channel,
                client.shoukaku.options.nodeResolver(client.shoukaku.nodes)
            );
        }
        const res = await client.queue.search(query);
        if (!res) {
            return await message.channel.send({
                content: `${client.e.fail} | Không tìm thấy kết quả dựa trên tìm kiếm của bạn!`
            });
        }
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("1")
                .setLabel("1")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("2")
                .setLabel("2")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("3")
                .setLabel("3")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("4")
                .setLabel("4")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("5")
                .setLabel("5")
                .setStyle(ButtonStyle.Primary)
        );
        switch (res.loadType) {
            case LoadType.ERROR:
                message.channel.send({
                    content: `${client.e.fail} | Đã xảy ra lỗi khi tìm kiếm`
                });
                break;
            case LoadType.EMPTY:
                message.channel.send({
                    content: `${client.e.fail} | Không tìm thấy kết quả tìm kiếm, hãy thử lại!`
                });
                break;
            case LoadType.SEARCH: {
                const track = res.data.slice(0, 5);
                const embed = track.map((track, index) => `${index + 1}. [${track.info.title}](${track.info.uri}) - \`${track.info.author}\``);
                await message.channel.send({
                    embeds: [
                        client
                            .embed()
                            .setDescription(embed.join('\n'))
                    ]
                });
                break;
            }
        }
        const collector = message.channel.createMessageComponentCollector({ filter: (i) => i.user.id === message.author.id ? true : fasle && i.deferUpdate(), max: 1, time: 60000, idle: 60000 / 2 });
        collector.on('collect', async (i) => {
            const track = res.data[parseInt(i.customId) - 1];
            await i.deferUpdate();
            if (!track) return;
            const song = player.buildTrack(track, message.author);
            player.queue.push(song);
            player.isPlaying();
            await ctx.editMessage({
                embeds: [
                    client
                        .embed()
                        .setColor(client.color.y)
                        .setThumbnmail(song.info.artworkUrl)
                        .setDescription(`${client.config.y} | Đã thêm [${song.info.title}](${song.info.uri}) vào danh sách phát`),
                ],
                components: [],
            });
            return collector.stop();
        });
        collector.on('end', async () => {
            await message.edit({ components: [] });
        });
    }
}
