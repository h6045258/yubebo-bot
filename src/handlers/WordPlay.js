const wordData = require('../configs/word.json');
const wordRandomData = require('../configs/wordRandom.json');
const wordConnectionModel = require('../models/wordConnectionBot');
const wordConnectionGameModel = require('../models/wordConnectionGame');
const dictionaryModel = require('../models/WordSchema');

module.exports = async (client) => {
    client.checkWord = async (word) => {
        word = word.toLowerCase();
        return wordData.some(w => w.toLowerCase() === word) || (await dictionaryModel.exists({ word }));
    };

    const isValidWord = (prevWord, currentWord) => {
        if (!prevWord || !currentWord) return false;
        return prevWord.split(' ').pop().toLowerCase() === currentWord.split(' ').shift();
    };

    client.getExistedWord = async (word) => {
        let wordList = wordData.filter(w => w.split(" ").shift() === word.toLowerCase().split(" ").pop());
        if (wordList.length == 0) {
            wordList = (await dictionaryModel.find()).filter(v => v.word.split(" ").shift() === word.toLowerCase().split(" ").pop()).map(v => v.word);
        }
        return wordList;
    };

    client.randomWord = () => {
        return wordRandomData.easy[Math.floor(Math.random() * wordRandomData.easy.length)];
    };

    const handleWordGame = async (message, wordConnectionData, mode = 'pvp') => {
        const wordUser = message.content.toLowerCase().trim();
        if (wordUser.split(' ').length !== 2) return;

        const result = {
            react: async () => await message.react('<:yb_fail:1163479516325359666>'),
            save: async () => await wordConnectionData.save(),
            notify: async () => { }
        };

        const wordExists = await client.checkWord(wordUser);
        if (!wordConnectionData.replay && (!wordExists || wordConnectionData.existed.includes(wordUser) || !isValidWord(wordConnectionData.word, wordUser))) {
            return result;
        }

        if (wordConnectionData.replay) {
            wordConnectionData.existed = [wordUser];
            if ((await client.getExistedWord(wordUser)).length < 5) {
                result.notify = async () => {
                    await message.reply("Cho từ này ai dám chơi nữa @_@");
                };
                return result;
            }
            wordConnectionData.replay = false;
        } else wordConnectionData.existed.push(wordUser);

        wordConnectionData.word = wordUser;
        result.react = async () => await message.react('<:yb_success:1163479511636123668>');

        if (mode === 'pvp') {
            wordConnectionData.currentTurn = (wordConnectionData.currentTurn + 1) % wordConnectionData.players.length;
            if ((await client.getExistedWord(wordUser)).length <= 0) {
                wordConnectionData.replay = true;
                result.notify = async () => {
                    await message.channel.send(`${wordUser} đã không còn gì để nối tiếp nữa, người chiến thắng là <@${wordConnectionData.players[(wordConnectionData.currentTurn - 1) % wordConnectionData.players.length]}>`);
                    await message.channel.send(`Đến Lượt của <@${wordConnectionData.players[wordConnectionData.currentTurn]}>\n### - Nếu bạn muốn tiếp tục hãy đưa ra từ mới`);
                };
            }
            else result.notify = async () => await message.channel.send(`Lượt của <@${wordConnectionData.players[wordConnectionData.currentTurn]}> (từ hiện tại là ${wordUser})`);
        } else if (mode === 'bot') {
            const nextWord = wordData.find(word => isValidWord(wordUser, word) && !wordConnectionData.existed.includes(word)) || (await dictionaryModel.find()).find(value => isValidWord(wordUser, value.word) && !wordConnectionData.existed.includes(value.word))?.word;
            if (nextWord) {
                result.notify = async () => await message.reply(nextWord);
                wordConnectionData.word = nextWord;
            } else {
                result.notify = async () => {
                    await message.reply("Toi thua roi~");
                    const randomWord = client.randomWord();
                    wordConnectionData.word = randomWord;
                    wordConnectionData.existed = [];
                    await message.reply(randomWord);

                };
            }
        } else if (mode === "free") {
            if ((await client.getExistedWord(wordUser)).length <= 0) {
                wordConnectionData.replay = true;
                await message.channel.send(`${wordUser} đã không còn gì để nối tiếp nữa, đợi người tiếp theo cho từ thoai:3`);
                await message.channel.send(`Ai đó cho từ chơi tiếp đi~`);
            }
            else result.notify = async () => await message.channel.send(`Ai đó tiếp đi!!(từ hiện tại là ${wordUser})`);
        }

        return result;
    };


    client.on('messageCreate', async message => {
        if (message.author.bot) return;

        const [pvpResult, botResult, freeModeResult] = await Promise.all([
            handlePVPWordConnection(client, message),
            handleBotWordConnection(client, message),
            handleFreeModeWordConnection(client, message)
        ]);

        for (const result of [pvpResult, botResult, freeModeResult]) {
            if (result) {
                result.react && await result.react();
                result.save && await result.save();
                result.notify && await result.notify();
            }
        }
    });

    async function handlePVPWordConnection(client, message) {
        const wordConnectionGameData = await wordConnectionGameModel.findOne({ channelId: message.channelId, mode: 'pvp' });
        if (!wordConnectionGameData || wordConnectionGameData.players[wordConnectionGameData.currentTurn] !== message.author.id) return;
        return handleWordGame(message, wordConnectionGameData, 'pvp');
    }

    async function handleBotWordConnection(client, message) {
        const wordConnectionData = await wordConnectionModel.findOne({ channelId: message.channelId });
        if (!wordConnectionData) return;
        return handleWordGame(message, wordConnectionData, 'bot');
    }

    async function handleFreeModeWordConnection(client, message) {
        const wordConnectionGameData = await wordConnectionGameModel.findOne({ channelId: message.channelId, mode: 'free' });
        if (!wordConnectionGameData) return;
        return handleWordGame(message, wordConnectionGameData, 'free');
    }
};