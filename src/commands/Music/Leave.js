module.exports = {
    name: "leave",
    description: {
        content: "Ngừng phát nhạc hoặc ngừng speak và rời khỏi kênh thoại",
        examples: ["leave"],
        usage: "leave",
    },
    category: "Music",
    aliases: ["cut"],
    cooldown: 3,
    run: async (client, message) => {
        const player = client.queue.get(message.guild.id);
        const embed = client.embed();
        let botchannel = message.guild.members.me.voice.channel;
        if (player) {
            await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.y)
                        .setDescription(
                            `${client.e.done} | Đã rời khỏi kênh <#${player.node.manager.connections.get(message.guild.id).channelId
                            }>`
                        ),
                ],
            });
            return await player.destroy();
        } else if (botchannel) {
            await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.y)
                        .setDescription(
                            `${client.e.done} | Đã rời khỏi kênh <#${botchannel.id}>`
                        ),
                ],
            });
            return await message.guild.members.me.voice.disconnect();
        } else {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.x)
                        .setDescription(`${client.config.x} | Hiện tại đang không kết nối tại kênh thoại nào cả!`),
                ],
            });
        }
    }
};
