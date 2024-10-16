module.exports = {
    name: 'skipto',
    aliases: ['sk'],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Chuyển sang phát bài nhạc được chỉ định trong danh sách phát',
        example: 'skipto 7',
        usage: 'skipto <số thứ tự>'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        if (!player.queue.length) {
            return await message.channel.send({
                content: `${client.e.fail} | Không còn bài nào trong danh sách phát!`
            });
        }

        if (isNaN(Number(args[0])) && Number(args[0]) > player.queue.length && Number(args[0]) < 1) {
            return await message.channel.send({
                content: `${client.e.fail} | Số bạn vừa nhập không hợp lệ, số hợp lệ phải từ 1 tới ${player.queue.length} dựa theo danh sách phát!`
            });
        }
        player.skip(Number(args[0]));
        return await message.channel.send({
            content: `${client.e.done} | Đã chuyển sang bài số ${args[0]}`
        });
    }
}
