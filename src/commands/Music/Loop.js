module.exports = {
    name: "loop",
    description: {
        content: "Chỉnh chế độ lặp hiện tại",
        examples: ["loop", "loop queue", "loop song"],
        usage: "loop",
    },
    category: "Music",
    aliases: ["loop"],
    cooldown: 3,
    run: async (client, message) => {
        const embed = client.embed()
        const player = client.queue.get(message.guild.id);
        switch (player.loop) {
            case "off":
                player.loop = "repeat";
                return await message.channel.send({
                    embeds: [
                        embed
                            .setDescription(`${client.e.done} | Đã chuyển sang chế độ lặp 1 bài.`)
                            .setColor(client.color.y),
                    ],
                });
            case "repeat":
                player.loop = "queue";
                return await message.channel.send({
                    embeds: [
                        embed
                            .setDescription(`${client.e.done} | Đã chuyển sang chế độ lặp danh sách.`)
                            .setColor(client.color.y),
                    ],
                });
            case "queue":
                player.loop = "off";
                return await message.channel.send({
                    embeds: [
                        embed
                            .setDescription(`${client.e.done} | Đã reset chế độ lặp.`)
                            .setColor(client.color.y),
                    ],
                });
        }
    }
};
