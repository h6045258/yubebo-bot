const wordConnectionGameModel = require('../../../models/wordConnectionGame');
const wordData = require('../../../configs/word.json');
module.exports = {
    name: 'pvp',
    description: 'Tạo 1 Thread/Channel chơi đấu tay đôi với người khác',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'ManageThreads'],
        user: ""
    },
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.reply('Hãy ping những người bạn muốn chơi cùng (nhập trong vòng 30 giây):');

        const filter = response => response.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .catch(() => {
                interaction.followUp('Bạn đã hết thời gian để nhập người chơi.');
                return null;
            });

        if (!collected) return;

        const mentionedUsers = collected.first().mentions.users;

        if (mentionedUsers.size < 1) return await interaction.followUp('Cần ít nhất 2 người chơi.');

        const thread = await interaction.channel.threads.create({
            name: `Nối từ PvP - ID.${interaction.user.tag}`,
            autoArchiveDuration: 60, // Tự động lưu trữ sau 60 phút không hoạt động
            reason: 'Trò chơi nối từ PvP',
        });

        const players = mentionedUsers.map(user => user.id);
        players.unshift(interaction.user.id);

        await thread.send('Nhập từ đầu tiên (2 từ):');

        const collectedWord = await thread.awaitMessages({ filter: response => response.author.id === interaction.user.id, max: 1, time: 30000, errors: ['time'] })
            .catch(() => {
                thread.send('Bạn đã hết thời gian nhập từ!');
                return null;
            });

        if (!collectedWord) return;

        const firstWord = collectedWord.first().content.trim();
        if (!(await client.checkWord(firstWord))) return await thread.send("Từ ày ai dám chơi @_@!");

        const game = new wordConnectionGameModel({
            channelId: thread.id,
            word: firstWord,
            players: players,
            currentTurn: 1,
            mode: "pvp"
        });

        await game.save();

        await thread.send(`Trò chơi nối từ bắt đầu với ${players.length} người chơi! Lượt tiếp theo thuộc về <@${players[1]}>.`);
    }
};
