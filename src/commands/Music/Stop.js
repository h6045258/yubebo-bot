module.exports = {
    name: 'stop',
    aliases: ['dunglai'],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Dừng phát nhạc và xóa toàn bộ danh sách phát',
        example: 'stop',
        usage: 'stop'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        player.queue = [];
        player.stop();
        return await message.channel.send({
            content: `${client.e.done} | Đã dừng phát nhạc, và xóa đi danh sách phát của bạn`
        });
    }
}