const wordConnectionModel = require('../../../models/wordConnectionBot');
const wordData = require('../../../configs/word.json');

module.exports = {
    name: 'bot',
    description: 'Tạo 1 thread/channel chơi nối từ với bot',
    cooldown: 3,
    options: [
        {
            name: 'inchannel',
            description: 'chơi trong channel',
            type: "Boolean",
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
                name: `Nối từ với bot - ID.${(await wordConnectionModel.find()).length + 1}`,
                autoArchiveDuration: 60, // Tự động lưu trữ sau 60 phút không hoạt động
                reason: 'Trò chơi nối từ với bot',
            });

            const firstWord = client.randomWord();
            // if (!client.checkWord(firstWord)) return await thread.send("Từ gì vậy con?");

            await new wordConnectionModel({
                channelId: thread.id,
                word: firstWord,
                existed: [firstWord]
            }).save();

            await thread.send(`Chào bạn! Trò chơi đã bắt đầu với từ "${firstWord}".`);
            await interaction.reply({ content: "Đã tạo thành công!", ephemeral: true });

        } else {
            if (!interaction.member.permissions.has('ManageGuild')) {
                return interaction.reply({ content: 'Bạn cần có quyền Manage Guild và Manage Channels để sử dụng lệnh này.', ephemeral: true });
            }
            const existedGame = await wordConnectionModel.findOne({ guildId: interaction.guildId });
            if (existedGame) {
                const channel = interaction.guild.channels.cache.get(existedGame.channelId) || null;

                if (channel) return interaction.reply(`Đã setup chơi nối từ với bot tại <#${existedGame.channelId}>`);
                else await existedGame.deleteOne();
            }

            const firstWord = client.randomWord();

            await new wordConnectionModel({
                channelId: interaction.channel.id,
                word: firstWord,
                existed: [firstWord]
            }).save();

            await interaction.reply(`Chào bạn! Trò chơi đã bắt đầu với từ "${firstWord}".`);
        }

    }

};