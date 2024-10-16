module.exports = {
    name: 'shuffle',
    aliases: ['sf'],
    category: "Music",
    cooldown: 3,
    description: {
        content: 'Xáo trộn danh sách bài nhạc đang phát',
        example: 'shuffle',
        usage: 'shuffle'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {

        const embed = client.embed();
        const player = client.queue.get(message.guild.id);
        if (!player) {
            return await message.channel.send({
                content: `${client.e.fail} | Hiện tại không có bài nào đang phát`
            });
        }

        player.setShuffle(true);
        return await message.channel.send({
            content: `${client.e.done} | Đã xáo trộn thành công ${player.queue.length} bài.`
        });
    }
}
