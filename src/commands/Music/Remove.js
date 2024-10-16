module.exports = {
    name: 'remove',
    aliases: ['rm'],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Xóa 1 bài nhạc ra khỏi danh sách phát',
        example: 'remove 3 (bài số 3 trong queue)',
        usage: 'remove <số thứ tự>'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        if (!player.queue.length) {
            return await message.channel.send({
                content: `${client.e.fail} | Không có bài nào trong danh sách phát để xóa cả`
            });
        }

        if (isNaN(Number(args[0])) && Number(args[0]) > player.queue.length && Number(args[0]) < 1) {
            return await message.channel.send({
                content: `${client.e.fail} | Số bạn vừa nhập không hợp lệ, số hợp lệ phải từ 1 tới ${player.queue.length} dựa theo danh sách phát!`
            });
        }

        player.remove(Number(args[0]) - 1);
        return await message.channel.send({
            content: `${client.e.done} | Đã xóa bài số ${Number(args[0])} ra khỏi danh sách phát`
        });
    }
}
