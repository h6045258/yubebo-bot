
module.exports = {
    name: "vcoin",
    category: "Economy",
    aliases: ['ucoin'],
    cooldown: 5,
    description: {
        content: "Xem kiểm tra số Yucoin bạn đang có",
        example: "vcoin",
        usage: "vcoin"
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
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
        let memberid = message.author.id
        let cash = await client.yucoin(memberid)
        let content =
            `<:Yucoin:1191320153594531840> **|** **${message.author.username}** , bạn đang có **${cash.toLocaleString('En-us')} Vcoin**`
        await message.reply(content).catch((e) => console.log(e))
    }
}
