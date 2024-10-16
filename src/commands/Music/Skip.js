module.exports = {
    name: 'skip',
    aliases: ['s'],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Bỏ qua bài nhạc đang phát hiện tại sang bài mới',
        example: 'skip',
        usage: 'skip'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        if (player.queue.length === 0) {
            return await message.channel.send({
                content: `${client.e.fail} | Không còn bài nào trong danh sách phát để tua nữa`
            });
        }
        player.skip();
        message.react(client.e.done);
        return await message.channel.send({
            content: `${client.e.done} | Đã chuyển sang bài [${player.current.info.title}](<${player.current.info.uri}>)`
        });
    }
}
