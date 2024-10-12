module.exports = {
    name: 'translate',
    aliases: ['tr'],
    category: 'Utils',
    description: {
        content: 'Hỗ trợ dịch từ ngôn ngữ này sang ngôn ngữ khác',
        example: 'translate vi en content',
        usage: 'translate <language> <to language> <content>'
    },
    permissions: {
        bot: [],
        user: []
    },
    cooldown: 3,
    run: async (client, message, args, prefix, lang) => {

        const from = args[0];
        const to = args[1];
        const content = args.slice(2).join(' ');

        if (!from) {
            return message.channel.send({
                content: lang.utils.translate_1
                .replace('{value}', message.member.displayName)
            });
        }

        if (!to) {
            return message.channel.send({
                content: lang.utils.translate_2
                .replace('{value}', message.member.displayName)
            });
        }

        if (args.length < 3) {
            return message.channel.send({
                content: lang.utils.translate_3
                .replace('{value}', message.member.displayName)
            });
        }

        const translate = await client.translate(content, from ,to);
        if (translate) {
            message.channel.send({
                embeds: [
                    client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: 'Translate', iconURL: 'https://imgur.com/0DQuCgg.png' })
                    .setDescription(lang.utils.translate_4
                        .replace('{value}', translate)
                    )
                    .setFooter({ text: lang.utils.translate_5
                        .replace('{value1}', from)
                        .replace('{value2}', to),
                        iconURL: client.user.displayAvatarURL({})
                    })
                ]
            });
        } else {
            message.channel.send({
                content: lang.utils.translate_6
                .replace('{value}', message.member.displayName)
            })
        }
    },
}