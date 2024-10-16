const anime = require('anime-actions');

module.exports = {
    name: 'dance',
    aliases: [],
    category: 'Emote',
    description: {
        content: 'Biểu cảm hoạt hình nhảy nhót',
        example: 'dance @Yubabe | ngoài ra bạn có thể nhập tên hoặc Id đều được',
        usage: 'dance [@mention/username/userId]'
    },
    permissions: {
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

        return await message.channel.send({
            embeds: [
                client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `${message.member.displayName} Đang nhảy tưng tưng tưng`, iconURL: message.member.displayAvatarURL({}) })
                    .setImage(await anime.dance())
            ]
        });
    }
}
