module.exports = {
    name: 'moveme',
    aliases: ['move', 'mvc', 'bvc', 'mm'],
    category: "Music",
    cooldown: 3,
    description: {
        content: 'Di chuyển bạn đến kênh hiện tại bot đang kết nối',
        example: 'moveme',
        usage: 'moveme'
    },
    permissions: {
        bot: [],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        let channel = message.member.voice.channel;
        let botchannel = message.guild.members.me.voice.channel;
        const perm = botchannel.permissionsFor(message.member);
        if (!perm.has('Connect') || !perm.has('ViewChannel')) {
            return await message.channel.send({
                content: `${client.e.fail} | Kênh ${botchannel.name} đang trong trạng thái riêng tư, bạn không có đủ quyền để truy cập vào kênh!`
            });
        }

        if (!botchannel) {
            return await message.channel.send({
                content: `${client.e.fail} | Hiện tại bot không có kết nối tại kênh nào cả!`
            });
        }

        if (!channel) {
            return await message.channel.send({
                content: `${client.e.fail} | Bạn cần phải kết nối vào kênh thoại bất kì, để bot có thể di chuyển bạn!`
            });
        }

        if (botchannel.userLimit >= botchannel.members.length) {
            return await message.channel.send({
                content: `${client.e.fail} | Kênh <#${botchannel.id}> đã giới hạn người có thể tham gia tại kênh này!`
            });
        }

        if (botchannel.id == channel.id) {
            return await message.channel.send({
                content: `${client.e.fail} | Hiện tại bạn đã đang trong kênh <#${botchannel.id}>!`
            });
        }
    }
}