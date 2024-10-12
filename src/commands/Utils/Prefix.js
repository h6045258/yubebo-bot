const prefix_data = require('../../models/prefixSchema');

module.exports = {
    name: 'prefix',
    aliases: [],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Thay đổi prefix của bot!',
        example: 'prefix y',
        usage: 'prefix <value>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ["Administrator"]
    },
    run: async (client, message, args, prefix, lang) => {

        const ctx = await message.channel.send({ content: `${client.e.load} | ${lang.utils.loading}` });

        let data = await prefix_data.findOne({ GuildId: message.guild.id });
        if (!data) {
            data = new prefix_data({
                GuildId: message.guild.id,
                prefix: 'y'
            });
            await data.save();
        }

        const prefixes = args[0];

        if (!prefixes) {
            ctx.edit({
                content: ' ',
                embeds: [
                    client.embed()
                        .setColor(client.color.x)
                        .setDescription(lang.utils.prefix_1.replace('{value}', prefix))
                ]
            });
            return;
        }

        if (prefixes.length > 2) {
            ctx.edit({
                content: ' ',
                embeds: [
                    client.embed()
                        .setColor(client.color.x)
                        .setDescription(lang.utils.prefix_2)
                ]
            });
            return;
        }

        data.prefix = prefixes;
        await data.save().then(() => {
            ctx.edit({
                content: ' ',
                embeds: [
                    client.embed()
                        .setColor(client.color.y)
                        .setDescription(lang.utils.prefix_3.replace('{value}', data.prefix))
                ]
            });
        }).catch(e => {
            ctx.edit({
                content: ' ',
                embeds: [
                    client.embed()
                        .setColor(client.color.x)
                        .setDescription(lang.utils.prefix_4.replace('{error}', e.message))
                ]
            });
            client.logger.error(`Có lỗi khi cập nhật prefix\n${e}`);
        })
    }
}