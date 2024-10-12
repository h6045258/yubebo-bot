const anime = require('anime-actions');

module.exports = {
    name: 'smile',
    aliases: [],
    category: 'Emote',
    description: {
        content: 'Biểu cảm hoạt hình cười tươi',
        example: 'smile @Yubabe | ngoài ra bạn có thể nhập tên hoặc Id đều được',
        usage: 'smile [@mention/username/userId]'
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
                    .setAuthor({ name: `${message.member.displayName} Đang nở một nụ cười rất tươi`, iconURL: message.member.displayAvatarURL({}) })
                    .setImage(await anime.smile())
            ]
        });
    }
}