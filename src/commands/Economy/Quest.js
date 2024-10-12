const questModel = require('../../models/questSchema.js');
const questConfig = require('../../configs/quest.json');
const questRewardConfig = require('../../configs/questReward.json');
const { EmbedBuilder } = require('discord.js');
const emojis = require("../../configs/emojis.json");

module.exports = {
    name: "quest",
    category: "Economy",
    aliases: ['chobonhanquest', 'nhiemvu', 'q'],
    cooldown: 3,
    description: {
        content: "Hệ thống nhận nhiệm vụ/theo dõi tiến độ nhiệm vụ",
        example: "quest",
        usage: "quest"
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
        if (client.isDeleteQuest.get('quest')) return await message.reply('...Đang trong quá trình reset quest ngày mới. Vui lòng quay lại sau ít phút nữa!');
        const questData = await questModel.findOne({ userId: message.author.id }) || new questModel({ userId: message.author.id });
        if (!questData) return;

        const questTypes = Object.keys(questConfig);
        const rewardTypes = Object.keys(questRewardConfig);

        if (!questData.isCreatedNewQuest) {
            for (const questType of questTypes) {
                const questValue = questConfig[questType];

                questData[questType].maxProgress = randomMaxProgress(questValue.min, questValue.max);
                if (questType === "gambling") {
                    const gamblingCommands = [...client.commands.values()].filter(c => c.category === "Gambling");
                    questData.gambling.commandName = gamblingCommands[Math.floor(Math.random() * gamblingCommands.length)].name;
                } else if (questType === "action") {
                    const actionCommands = [...client.commands.values()].filter(c => c.category === "Action");
                    questData.action.commandName = actionCommands[Math.floor(Math.random() * actionCommands.length)].name;
                }

                const randomReward = Math.floor(Math.random() * rewardTypes.length);
                const rewardName = rewardTypes[randomReward];
                const rewardValue = questRewardConfig[rewardTypes[randomReward]];
                const reward = randomMaxProgress(rewardValue.min, rewardValue.max);

                questData[questType].reward.rewardName = rewardName;
                questData[questType].reward.reward = reward;
            }


            questData.isCreatedNewQuest = true;

            await questData.save();
        }


        const showQuestEmbed = new EmbedBuilder()
            .setAuthor({ name: `Bảng Nhiệm Vụ Hôm Nay`, iconURL: message.author.displayAvatarURL() })
            .setColor('LuminousVividPink')
            .setTimestamp();
        let isCompleteCount = 0;

        let fieldDescription = `Dưới đây là danh sách nhiệm vụ của ${message.author}\n`;

        let trungThuRewardNoti = false;

        questTypes.forEach(questType => {
            const quest = questData[questType];
            const progressText = `${questType === "voice" ? quest.progress.toFixed(2) : quest.progress}/${quest.maxProgress}`;
            //const questName = ` ${questType.charAt(0).toUpperCase()}${questType.slice(1)}`;


            if (questData.chat.isComplete &&
                questData.voice.isComplete &&
                questData.action.isComplete &&
                questData.gambling.isComplete &&
                questData.plant.isComplete &&
                questData.daily.isComplete
            ) {
                trungThuRewardNoti = true;
                if (questData.vote.isComplete) showQuestEmbed.setColor('Green');
            }

            if (quest.isComplete) {
                isCompleteCount++;
            }
            if (questType === "gambling" || questType === "action") {
                fieldDescription += `\n**${quest.isComplete ? "<:checked:1183702384837410837>" : "<:cancel:1183702388616482918>"} Dùng lệnh \`${quest.commandName}\`!**`;
            } else if (questType === "chat") {
                fieldDescription += `\n**${quest.isComplete ? "<:checked:1183702384837410837>" : "<:cancel:1183702388616482918>"} Chat ${quest.maxProgress} ở bất kì đâu!**`;
            } else if (questType === "voice") {
                fieldDescription += `\n**${quest.isComplete ? "<:checked:1183702384837410837>" : "<:cancel:1183702388616482918>"} Voice ${quest.maxProgress} giờ!**`;
            } else if (questType === "plant") {
                fieldDescription += `\n**${quest.isComplete ? "<:checked:1183702384837410837>" : "<:cancel:1183702388616482918>"} Dùng nhóm lệnh \`${questType.toUpperCase()}\`!**`;
            } else if (questType === "daily") {
                fieldDescription += `\n**${quest.isComplete ? "<:checked:1183702384837410837>" : "<:cancel:1183702388616482918>"} Điểm danh**`;
            }
            else if (questType === "vote") {
                fieldDescription += `\n**${quest.isComplete ? "<:checked:1183702384837410837>" : "<:cancel:1183702388616482918>"} Tặng 1 vote cho bot :3**`;
            }

            const reward_emojis = {
                "ycoin": emojis.coin,
                "gembox": emojis.gembox,
                "pro_gembox": emojis.progembox,
                "vip_gembox": emojis.vipgembox
            };

            fieldDescription += `\nTiến độ: ${progressText} | Thưởng: ${quest.reward.reward} ${reward_emojis[quest.reward.rewardName]}\n`;
        });

        showQuestEmbed.setDescription(`${fieldDescription}`);

        showQuestEmbed.addFields({
            name: "Thống kê tiến trình nhiệm vụ".toUpperCase(),
            value: `> Tổng số nhiệm vụ đã hoàn thành: \`${isCompleteCount}/7\`\n> Nhiệm vụ sẽ được reset vào mỗi \`12 giờ đêm\``
        });

        await message.reply({ embeds: [showQuestEmbed] });
        if (trungThuRewardNoti) {
            const random = Math.floor(Math.random() * 9) + 1;
            await message.reply(`Bạn nhận đc ${random} <:lighter:1284016956709666889> vì đã hoàn thành hết quest!`);
            await client.congItemTrungThu(message.author.id, "batlua", random);
        }
    }
};

const randomMaxProgress = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
