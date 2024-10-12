module.exports = {
    name: "checkauto",
    description: ["Check user có auto spam hay không."],
    aliases: ["auto", "autocheck", "checkauto"],
    usage: ["{prefix}auto <id> <captcha>"],
    cooldown: 10,
    category: "Dev",
    permissions: {
        dev: true,
    },
    /**
     * 
     * @param {import('discord.js').Client} client
     * @param {*} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {
        let captcha = args[1]
        if (!captcha) captcha = "NOSPAMVERIFY"
        const mentionedUser = message.mentions.members.first() || client.users.cache.find(u => u.id == args[0])
        let username = mentionedUser.username || mentionedUser.user.username
        if (!mentionedUser) return
        await mentionedUser
            .send(`Xin chào **${username}**, hãy reply tin nhắn này để xác nhận bạn không treo auto spam!
\`\`\`${captcha}\`\`\`
`)
            .catch(e => console.log(e))
        await message.channel.send("ok")
    }
}