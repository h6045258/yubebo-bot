const anime = require('anime-actions');

module.exports = {
    name: 'thinking',
    aliases: [],
    category: 'Emote',
    description: {
        content: 'Biểu cảm hoạt hình suy nghĩ',
        example: 'thinking @Yubabe | ngoài ra bạn có thể nhập tên hoặc Id đều được',
        usage: 'thinking [@mention/username/userId]'
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
                    .setAuthor({ name: `${message.member.displayName} Đang suy nghĩ hmm,...`, iconURL: message.member.displayAvatarURL({}) })
                    .setImage(await anime.thinking())
            ]
        });
    }
}