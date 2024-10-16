const anime = require('anime-actions');

module.exports = {
    name: 'baka',
    aliases: [],
    category: 'Action',
    cooldown: 3,
    description: {
        content: 'Biểu cảm hoạt hình baka',
        example: 'baka @Yubabe bạn có thể nhập tên hoặc Id',
        usage: 'baka [@mention/username/userId]'
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
                            name: `${message.member.displayName} tự nói mình là đồ ngốc`,
                            iconURL: message.member.displayAvatarURL({})
                        })
                        .setImage(await anime.baka())
                ]
            });
        } else {
        client.usedSuccess.set(message.author.id, true);
            return message.channel.send({
                embeds: [
                    client.embed()
                        .setColor(client.color.y)
                        .setAuthor({
                            name: `${message.member.displayName} vừa nói ${user.displayName} là đồ ngốc`,
                            iconURL: message.member.displayAvatarURL({})
                        })
                        .setImage(await anime.baka())
                ]
            });
        }
    }
};
