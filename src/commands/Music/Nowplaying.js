module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    category: "Music",
    cooldown: 3,
    description: {
        content: 'Hiển thị thông tin bài nhạc đang phát',
        example: 'nowplaying',
        usage: 'nowplaying'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        const track = player.current;
        const position = player.player.position;
        const duration = track.info.length;
        const bar = client.progressBar(position, duration, 20);
        return await message.channel.send({
            embeds: [
                client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: 'Đang Phát', iconURL: message.guild.iconURL({}) })
                    .setThumbnail(track.info.artworkUrl)
                    .setDescription(`[${track.info.title}](${track.info.uri}) - Người nghe: ${track.info.requester}\n\n\`${bar}\``)
                    .addFields({ name: "\u200b", value: `\`${client.formatTime(position)} / ${client.formatTime(duration)}\``, })
            ]
        })
    }
}