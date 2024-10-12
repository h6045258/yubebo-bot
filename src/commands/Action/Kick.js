const anime = require('anime-actions');

module.exports = {
    name: 'kick',
    aliases: [],
    category: 'Action',
    cooldown: 3,
    description: {
        content: 'Hành động hoạt hình kick',
        example: 'kick @Yubabe bạn có thể nhập tên hoặc Id',
        usage: 'kick [@mention/username/userId]'
    },
    permission: {
        bot: [],
        user: []
    },
    /**
     * 
     * @param {import('discord.js').Client} client
     * @param {*} message 
     * @param {*} args 
     * @param {client.prefix('prefix')} prefix 
     * @param {client.la('lang')} lang 
     * @returns 
     */
    run: async (client, message, args, prefix, lang) => {

        let user = null;
        if (args.length) {
            try {
                user = await client.getUser(message, args);
            } catch (e) {
                return message.reply({
                    embeds: [
                        client.embed()
                            .setColor(client.color.y)
                            .setDescription(
                                `${client.e.fail} | ${lang.utils.avatar_1.replace('{value}', args)}`
                            ),
                    ],
                }).then(async (msg) => {
                    await client.sleep(5000);
                    await msg.delete();
                });
            }
        }

        if (!user || !user.id || user == null || user == undefined) {
        client.usedSuccess.set(message.author.id, true);
            return message.channel.send({
                embeds: [
                    client.embed()
                        .setColor(client.color.y)
                        .setAuthor({
                            name: `${message.member.displayName} tự sút vào chính mình`,
                            iconURL: message.member.displayAvatarURL({})
                        })
                        .setImage(await anime.kick())
                ]
            });
        } else {
        client.usedSuccess.set(message.author.id, true);
            return message.channel.send({
                embeds: [
                    client.embed()
                        .setColor(client.color.y)
                        .setAuthor({
                            name: `${message.author.username} vừa mới sút ${user.displayName}`,
                            iconURL: message.member.displayAvatarURL({})
                        })
                        .setImage(await anime.kick())
                ]
            });
        }
    }
};