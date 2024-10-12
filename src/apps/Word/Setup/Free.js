const wordConnectionGameModel = require('../../../models/wordConnectionGame');
const wordData = require('../../../configs/word.json');

module.exports = {
    name: 'free',
    description: 'Tạo 1 Thread/Channel chơi tự do với người khác',
    cooldown: 3,
    options: [
        {
            name: 'inchannel',
            description: 'lựa chọn chơi trong channel hay không',
            type: 'Boolean',
            required: false
        }
    ],
    permission: {
        bot: ['ManageGuild', 'ManageThreads'],
        user: ""
    },
    run: async (client, interaction, user, prefix, message, lang) => {
        const isPlayAtChannel = interaction.options.getBoolean('inchannel') || false;
        if (!isPlayAtChannel) {
            thread = await interaction.channel.threads.create({
                name: `Nối từ tự do - ID.${(await wordConnectionGameModel.find({ mode: "free" })).length + 1}`,
                autoArchiveDuration: 60,
                reason: 'Trò chơi nối từ tự do',
            });

            const filter = response => response.author.id === message.author.id && response.content.trim().split(' ').length === 2;
            await thread.send('Để bắt đầy hãy ra từ đầu tiên (gồm 2 tiếng VD: con cá, cơm chay,...)');

            const collected = await thread.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .catch(() => {
                    thread.send('Bạn đã hết thời gian nhập từ!');
                    return null;
                });

            if (!collected) return;

            const firstWord = collected.first().content.trim();
            if (!client.checkWord(firstWord)) return await thread.send("Từ gì đây bạn @_@");

            const game = new wordConnectionGameModel({
                channelId: thread.id,
                word: firstWord,
                existed: [firstWord],
                players: [],
                mode: 'free'
            });

            await game.save();

            await thread.send(`Trò chơi nối từ kiểu "multiplayer-free" đã bắt đầu! Bất kỳ ai cũng có thể tham gia và nối từ tiếp theo.`);
            await thread.send("Từ đầu tiên tui ra là: " + firstWord);
            await interaction.reply("Đã tạo thành công!");

        } else {
            if (!interaction.member.permissions.has('ManageGuild')) {
                return interaction.reply({ content: 'Bạn cần có quyền Manage Guild và Manage Channels để sử dụng lệnh này.', ephemeral: true });
            }
            const existedGame = await wordConnectionGameModel.findOne({ guildId: interaction.guildId });
            if (existedGame) {
                const channel = interaction.guild.channels.cache.get(existedGame.channelId) || null;
                if (channel) return interaction.reply({ content: `Đã setup chơi nối từ tự do tại <#${existedGame.channelId}>`, ephemeral: true });
                else await existedGame.deleteOne();
            }

            const firstWord = client.randomWord();
            await new wordConnectionGameModel({
                guildId: interaction.guildId,
                channelId: interaction.channel.id,
                word: firstWord,
                existed: [firstWord],
                players: [],
                mode: 'free'
            }).save();

            await interaction.reply(`Trò chơi nối từ kiểu "multiplayer-free" đã bắt đầu! Bất kỳ ai cũng có thể tham gia và nối từ tiếp theo.`);
            await interaction.channel.send("Từ đầu tiên tui ra là: " + firstWord);
        }

    }
};