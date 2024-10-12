const { Collection } = require('discord.js');

const questModel = require('../models/questSchema');

const delay = 15;

module.exports = async client => {
    client.timeStampUser = new Collection();
    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (newState.member?.user.bot) return;

        const userId = newState.member.id;
        const guildID = newState.guild.id;

        if (newState.channel && !client.timeStampUser.has(userId)) {
            const timeInterval = setInterval(async () => {
                const questData = await questModel.findOne({ userId: userId });
                if (!questData) return;
                if (questData.voice.isComplete) return;
                questData.voice.progress += (delay / 3600);

                if (questData.voice.progress >= questData.voice.maxProgress) {
                    questData.voice.isComplete = true;
                    questData.voice.progress = questData.voice.maxProgress;
                    await handleRewardQuest(userId, client, questData, "voice");
                }

                await questData.save();
            }, delay * 1000);
            client.timeStampUser.set(userId, timeInterval);
        }


        if (oldState.channel?.id && !newState.channel?.id) {
            clearInterval(client.timeStampUser.get(userId));
            client.timeStampUser.delete(userId);
        }
    });
};

const handleRewardQuest = async (authorId, client, questData, questType) => {
    const reward = questData[questType].reward.reward;
    const rewardName = questData[questType].reward.rewardName;

    const rewardNames = {
        "ycoin": async () => { await client.cong(authorId, reward); },
        "gembox": async () => { await client.addgem(authorId, `<:GEMBOX:982028743952441355>`, reward, 0); },
        "pro_gembox": async () => { await client.addgem(authorId, `<:PRO_GEMBOX:982028744057298964>`, reward, 0); },
        "vip_gembox": async () => { await client.addgem(authorId, `<:VIP_GEMBOX:982028743889543278>`, reward, 0); },
    };

    await rewardNames[rewardName]();
};