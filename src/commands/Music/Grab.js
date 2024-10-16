module.exports = {
    name: 'grab',
    aliases: [],
    category: "Music",
    cooldown: 3,
    description: {
        content: 'Lưu lại bài nhạc đang phát',
        example: 'grab (Bot sẽ dms cho bạn thông tin bài nhạc)',
        usage: 'grab'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {

        const embed = client.embed();
        let player = client.queue.get(message.guild.id);
        let song = player.current;
        try {
            const dm = embed
                .setColor(client.color.y)
                .setAuthor({ name: song.info.title, iconURL: song.info.artworkUrl, URL: song.info.url })
                .setThumbnail(song.info.artworkUrl)
                .setDescription(`Thời gian ${song.info.isStream ? 'Live' : client.formatTime(song.info.length)}\n\n**Link: [Ấn Vào Đây](<${song.info.uri}>)**`);
            await message.author.send({ embeds: [dm] });
            return await message.channel.send({
                content: `${client.e.done} | Đã lưu xong, hãy kiểm tra trong hộp thư của ${client.user.displayName}`
            });
        } catch (error) {
            return await message.channel.send({
                content: `${client.e.fail} | Không thể gửi dms tới cho bạn, hãy kiểm tra lại!`
            });
        }
    }
}
