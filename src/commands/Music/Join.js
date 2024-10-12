module.exports = {
    name: 'join',
    aliases: ['summon', 'j', 'vaoday'],
    category: "Music",
    cooldown: 3,
    description: {
        content: 'Triệu hồi bot vào kênh thoại của bạn',
        example: 'join',
        usage: 'join'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {

        const vc = message.member.voice.channel;
        let player = client.queue.get(message.guild.id);
        if (!vc) {
            return await message.channel.send({
                content: `${client.e.fail} | Bạn cần phải tham gia 1 kênh thoại để sử dụng lệnh!`
            });
        }

        if (!player) {
            player = await client.queue.create(
                message.guild.id,
                vc,
                message.channel,
                client.shoukaku.options.nodeResolver(client.shoukaku.nodes)
            );
            return await message.channel.send({
                content: `${client.e.done} | Đã tham gia và kết nối vào kênh <#${vc.id}>`
            });
        } else {
            return await message.channel.send({
                content: `${client.e.fail} | Hiện tại đã kết nối vào kênh <#${player.node.manager.connections.get(ctx.guild.id).channelId}>`
            });
        }
    }
}