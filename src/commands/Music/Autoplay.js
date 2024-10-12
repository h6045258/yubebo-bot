module.exports = {
    name: "autoplay",
    description: {
        content: "Chuyển đổi sang chế độ autoplay",
        example: ["autoplay"],
        usage: "autoplay",
    },
    category: "Music",
    aliases: ["ap"],
    cooldown: 3,
    run: async (client, message) => {

        const player = client.queue.get(message.guild.id);
        const embed = client.embed();

        const autoplay = player?.autoplay;
        if (!autoplay) {
            embed
                .setDescription(`${client.e.done} | Autoplay đã được kích hoạt.`)
                .setColor(client.color.y);
            player.setAutoplay(true);
        } else {
            embed
                .setDescription(`${client.e.fail} | Autoplay đã bị vô hiệu hóa.`)
                .setColor(client.color.x);
            player.setAutoplay(false);
        }
        message.channel.send({ embeds: [embed] });
    }
};
