module.exports = {
    name: 'queue',
    aliases: ['q'],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Xem danh sách phát hiện tại',
        example: 'queue',
        usage: 'queue'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        if (player.queue.length === 0) {
            return await message.channel.send({
                embeds: [
                    client
                        .embed()
                        .setColor(client.color.y)
                        .setDescription(`Đang phát: [${player.current.info.title}](<${player.current.info.uri}>) - Người nghe: ${player.current?.info.requester} - Thời gian: ${player.current.info.isStream ? 'Live' : client.formatTime(player.current.info.length)}`)
                ]
            });
        }
        const queue = player.queue.map((track, index) => `${index + 1}. [${track.info.title}](${track.info.uri}) - Người nghe: ${track?.info.requester} - Thời gian: ${track.info.isStream ? "Live" : client.formatTime(track.info.length)}`);
        const chunk = client.chunk(queue, 10);
        if (chunk.length === 0) chunk = 1;
        const page = [];
        for (let i = 0; i < chunk.length; i++) {
            const embed = client
                .embed()
                .setColor(client.color.y)
                .setAuthor({ name: `Danh Sách Phát Tại ${message.guild.name}`, iconURL: message.guild.iconURL({}) })
                .setDescription(chunk[i].join('\n'))
                .setFooter({ text: `Trang ${i + 1} / ${chunk.length}` });
            page.push(embed);
        }
        return await client.swap(message, page);
    }
}