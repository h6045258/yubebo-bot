

module.exports = {
    name: 'pick',
    aliases: ['choose'],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Để Yubabe lựa chọn giùm bạn giữa các phương án !',
        example: 'pick phankha, phankhe',
        usage: 'pick <choose1>, <choose2>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const array = args.join(" ")
        let question = array.split(",")
        if (!question[1]) {
            const missingQuestion =
                `Xin hãy đưa ra những lựa chọn! cách nhau bằng dấu phẩy!`
            return await message.channel.send(missingQuestion).catch(e => console.log(e))
        }
        let answer = question[Math.floor(Math.random() * question.length)];
        const responses =
            `**${message.author.username}** tôi sẽ chọn: **__${answer}__**`
        await message.channel.send(responses).catch(e => console.log(e));

    }
}