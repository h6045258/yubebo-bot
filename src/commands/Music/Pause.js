module.exports = {
    name: 'pause',
    aliases: [],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Tạm dừng phát bài nhạc hiện tại',
        example: 'pause',
        usage: 'pause'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        if (!player.pause) {
            player.pause();
            return await message.channel.send({
                content: `${client.e.done} | Đã tạm dừng phát`
            });
        } else {
            return await message.channel.send({
                content: `${client.e.fail} | Bài nhạc hiện đã được tạm dừng phát!`
            });
        }
    }
}