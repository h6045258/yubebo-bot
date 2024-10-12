module.exports = {
    name: 'resume',
    aliases: ['re'],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Tiếp tục phát bài nhạc đang tạm dừng trước đó',
        example: 'resume',
        usage: 'resume'
    },
    permissions: {
        bot: [],
        user: '',
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        if (!player.pause) {
            return await message.channel.send({
                content: `${client.e.fail} | Hiện tại bot vẫn đang phát nhạc, không bị tạm dừng!`
            });
        }
        player.pause();
        return await message.channel.send({
            content: `${client.e.done} | Tiếp tục phát nhạc`
        });
    }
}