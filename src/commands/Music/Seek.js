module.exports = {
    name: 'seek',
    aliases: ['sk'],
    category: "Music",
    cooldown: 3,
    description: {
        content: 'Tua nhanh bài nhạc đến thời điểm bạn muốn',
        example: 'seek 1m 30s',
        usage: 'seek <duration>'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {

        const player = client.queue.get(message.guild.id);
        if (!player) {
            return await message.channnel.send({
                content: `${client.e.fail} | Không có bài nào đang phát tại server!`
            });
        }

        
    }
}
