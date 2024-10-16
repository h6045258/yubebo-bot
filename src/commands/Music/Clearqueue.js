module.exports = {
    name: 'clearqueue',
    aliases: ['clear', 'clq', 'cl'],
    category: "Music",
    cooldown: 3,
    description: {
        content: 'Xóa tất cả các bài có trong danh sách phát',
        example: 'clearqueue',
        usage: 'clearqueue'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const player = client.queue.get(message.guild.id);
        const embed = client.embed();
        if (!player.queue.length) {
            return await message.channel.send({
                content: `${client.e.fail} | Không còn bài nào trong danh sách phát để xóa`
            });
        }
        player.queue = [];
        return await message.channel.send({
            embeds: [
                embed
                    .setColor(client.color.y)
                    .setDescription(`${client.e.done} | Đã xóa thành công tất cả các bài trong danh sách phát`)
            ]
        });
    }
}
