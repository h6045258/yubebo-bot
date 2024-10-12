module.exports = {
    name: 'volume',
    aliases: ['vol', 'vl'],
    category: 'Music',
    cooldown: 3,
    description: {
        content: 'Chỉnh sửa âm lượng phát nhạc',
        example: 'volume 30 (Tối đa 150)',
        usage: 'volume <mức âm lượng>'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        const number = Number(args[0]);
        if (isNaN(number)) {
            return await message.channel.send({
                content: `${client.e.fail} | Bạn cần nhập mức âm lượng phù hợp để chỉnh!`
            });
        }
        if (number > 150) {
            return await message.channel.send({
                content: `${client.e.fail} | Mức âm lượng tối đa có thể chỉnh là 150%`
            });
        }
        if (number < 0) {
            return await message.channel.send({
                content: `${client.e.fail} | Âm lượng không được thấp hơn 0%`
            });
        }
        player.player.setGlobalVolume(number);
        return await message.channel.send({
            content: `${client.e.done} | Đã chỉnh thành công âm lượng ở mức ${player.player.volume}%`
        });
    }
}