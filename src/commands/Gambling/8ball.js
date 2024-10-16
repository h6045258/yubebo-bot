module.exports = {
  name: "8ball",
  category: "Gambling",
  aliases: ["cothay", "chohoi", "ask"],
  cooldown: 3,
  description: {
    content: "Trả lời một câu hỏi của bạn yes/no",
    example: "8ball Có thấy Yubabe đẳng cấp không => Yubabe sẽ trả lời yes/no",
    usage: "8ball <content>"
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    let answers = require('../../configs/8ball.json')
    const question = args.join(" ")

    if (!question) {
      const missingQuestion = 
        `Xin hãy đưa ra một câu hỏi!`
      return await message.channel.send(missingQuestion).catch(e => console.log(e))
    }
    let answer = answers[Math.floor(Math.random() * answers.length)];
    const responses = 
      `Nếu mà **${message.author.username}** hỏi **${question}** thì **${answer}**`
    await message.channel.send(responses).catch(e => console.log(e));
		client.usedSuccess.set(message.author.id, true);

  }
}
