const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Collection,
    PermissionsBitField,
    AttachmentBuilder
} = require("discord.js");
const prefix_data = require("../../models/prefixSchema");
const { QuickDB } = require("quick.db");

const BanSchema = require('../../models/BanSchema');
const BanGSchema = require('../../models/banguild');
const emojis = require('../../configs/emojis.json');

const db = new QuickDB({ table: "DB" });
module.exports = {
    event: "messageCreate",

    /**
     * 
     * @param {*} client 
     * @param {import('discord.js').Message} message 
     * @returns 
     */
    run: async (client, message) => {
        try {
            if (message.author.bot) return;

            if (message.channel.type == 1 && !message.author.bot) {

                const Dmslog = "995449835350151269";
                const DMS = await client.channels.fetch(Dmslog);
                const onCaptcha3 = await db.get(`${message.author.id}_captchaDMS`);
                let captchaText3 = await db.get(`${message.author.id}_captchaDMSText`);
                if (onCaptcha3) {
                    if (message.content == captchaText3) {
                        await db.delete(`${message.author.id}_captchaDMS`);
                        await db.delete(`${message.author.id}_captchaDMSText`);
                        await message.reply(`Bạn đã hoàn thành captcha, bạn có thể sử dụng bot tiếp !`);
                    }
                }
                let embed = new EmbedBuilder()
                    .setTitle(message.author.username + " đã DMS")
                    .setDescription(message.content)
                    .setThumbnail(message.author.avatarURL())
                    .addFields({ name: "ID", value: message.author.id })
                    .setTimestamp();
                return DMS.send({
                    content: `Dùng Ydm ${message.author.id} để reply mà không hiện tên Mod! 
    Ydms ${message.author.id} để reply với tên Mod`, embeds: [embed]
                });
            }



            if (
                !message.guild ||
                message.guild.available === false ||
                !message.channel ||
                message.webhookId
            )
                return;
            if (message.channel?.partial)
                await message.channel.fetch().catch(() => { });
            if (message.member?.partial)
                await message.member.fetch().catch(() => { });

            const data = await prefix_data.findOne({
                GuildId: message.guild.id,
            });
            let defaultPrefix = "y";
            const escapeRegex = (str) =>
                str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            let prefix = data
                ? escapeRegex(data.prefix)
                : escapeRegex(defaultPrefix);
            let prefixRegex = new RegExp(
                `^(<@!?${client.user.id}>|${escapeRegex(defaultPrefix)}|${prefix})\\s*`,
                "i",
            );
            if (!prefixRegex.test(message.content)) return await handleChatQuest(client, message);
            const [, matchedPrefix] = message.content.match(prefixRegex);
            let args = message.content
                .slice(matchedPrefix.length)
                .trim()
                .split(/ +/g);
            let cmd = args.shift().toLowerCase();
            if (cmd.length === 0) {
                if (matchedPrefix.includes(client.user.id)) {
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("SUPPORT SERVER")
                            .setURL("https://discord.gg/ZbAT9jt5Ak")
                            .setStyle(ButtonStyle.Link)
                            .setEmoji("1123672139988484176"),
                    );
                    const embed = client
                        .embed()
                        .setColor(client.color.y)
                        .setDescription(
                            `Xin chào, prefix của tôi là \`${defaultPrefix}\` hoặc \`${data ? data.prefix : defaultPrefix}\` cho \`${defaultPrefix}help\` or \`${data ? data.prefix : defaultPrefix}help\`\nNếu gặp lỗi hoặc bug, liên hệ dev qua nút phía dưới !`,
                        );
                    return message.channel.send({
                        embeds: [embed],
                        components: [row],
                    });
                }
            }

            const command =
                client.commands.get(cmd) ||
                client.commands.find(
                    (command) =>
                        command.aliases && command.aliases.includes(cmd),
                );
            if (!command) return;

            const ban = await BanSchema.findOne({ memberid: message.author.id });
            if (ban && message.author.id !== "696893548863422494") return;

            //////////////////////////// Xử lý ban guild
            const banG = await BanGSchema.findOne({ guildid: message.guild.id });
            if (banG) return;
            //////////////////////////////

            if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages))
                return message.author
                    .send(`${client.e.fail} | Tôi không thể gửi tin nhắn trong kênh \`${message.channel.name}\``)
                    .catch(e => console.log(e));

            const softban = await db.get(`${message.author.id}_softban1`);
            if (softban == null) {
                const policy = new EmbedBuilder()
                    .setAuthor({ name: "Policy & Term of Service", url: "https://discord.gg/ZbAT9jt5Ak", iconUrl: client.user.defaultAvatarURL })
                    .setTitle("BẰNG VIỆC SỬ DỤNG BOT CỦA CHÚNG TÔI")
                    .setDescription(`Bạn Đồng Ý Với Việc:
1. Tuân Thủ Luật và [Chính Sách Người Dùng](${"https://docs.google.com/document/d/1Llz1gBynvTooI-S5jAWlTiuQZqe6Bp9QV-Vhd14080A/edit?usp=drivesdk"}) Tại [Support Server](${"https://discord.gg/ZbAT9jt5Ak"})!
2. Đảm bảo không sử dụng các phần mềm thứ 3 gây ảnh hưởng đến tài nguyên bot.
3. Đảm bảo chịu trách nhiệm về các thông tin chia sẻ công khai tại Discord!`)
                    .setFooter({ text: "Để biết thêm thông tin, vui lòng nhấp vào link bên trên" });
                let pp = await message.reply({ embeds: [policy] }).catch((err) => {
                    return;
                });
                await client.sleep(10000);
                await pp.delete().catch((err) => {
                    return;
                });
                if (ban) {
                    if (ban.memberid == message.author.id) await db.set(`${message.author.id}_softban1`, true);
                }
                else {
                    await db.set(`${message.author.id}_softban1`, false);
                }
            }
            else if (softban == true) return;
            else {
                const onCaptcha4 = await db.get(`${message.author.id}_captchaDMS`)
                try {
                    if (onCaptcha4) {
                        const onCaptchaTimes = await db.get(`${message.author.id}_captchaDMSTime`);
                        if (onCaptchaTimes == 0) {
                            const banned = new BanSchema({ memberid: message.author.id, guildid: message.guild.id });
                            await banned.save();
                            const yukii = client.users.cache.find(u => u.id == `696893548863422494`);
                            await yukii.send(`<@696893548863422494> | **${message.author.username} (${message.author.id})** đã bị ban bởi CAPTCHA!`);
                            await message.reply(`<:Yl_ban:911688495867777044> | Bạn đã bị ban vì không thực hiện CAPTCHA!
	Nếu bạn nghĩ đây là nhầm lẫn, vui lòng liên hệ support tại: https://discord.gg/ZbAT9jt5Ak để được appeal!`);
                            await db.delete(`${message.author.id}_captchaDMSTime`);
                            await db.delete(`${message.author.id}_captchaDMSText`);
                            await db.delete(`${message.author.id}_captchaDMS`);
                            return;
                        }
                        await message.reply(`${client.e.fail} | Bạn phải DMS tôi mã CAPTCHA! Bạn còn **[${onCaptchaTimes}/5]** lần cảnh báo!`);
                        await db.sub(`${message.author.id}_captchaDMSTime`, 1);
                        return;
                    }

                    // const buttons = new ButtonBuilder()
                    //     .setStyle(ButtonStyle.Danger)
                    //     .setLabel('Check AutoSpam')
                    //     .setCustomId(`${message.id}_loggingButtons`);
                    // const row_one = new ActionRowBuilder().addComponents(buttons);
                    // const YubabeLog = client.guilds.cache.get("1157597853431103559").channels.cache.get("1254984842295119933");
                    // const logging = await YubabeLog.send({
                    //     embeds: [new EmbedBuilder()
                    //         .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    //         .setTitle(`${message.author.username} đã dùng lệnh ${command.name} tại ${message.guild.name}`)
                    //         .addFields(
                    //             [
                    //                 { name: `Guild: ${message.guild.name}`, value: message.guild.id },
                    //                 { name: `Channel: ${message.channel.name}`, value: message.channel.id },
                    //                 { name: `Message: ${message.content}`, value: message.id },
                    //                 { name: `User: ${message.author.username}`, value: message.author.id },
                    //             ]
                    //         )
                    //     ],
                    //     components: [row_one]
                    // });
                    // const filter = i => i.isButton() && i.message.author.id == client.user.id;
                    // const collector = YubabeLog.createMessageComponentCollector({ filter: filter, time: 10_000 });
                    // collector.on("collect", async (interaction) => {
                    //     if (interaction.customId == `${message.id}_loggingButtons`) {
                    //         interaction.deferUpdate();
                    //         try {
                    //             const { createCanvas, registerFont } = require('canvas');
                    //             let captchaText = '';
                    //             const FONT_FILE_PATH = './assets/fonts/BlaxSlabXXL.ttf';
                    //             const CAPTCHA_LENGTH = 6;
                    //             const DOT_COUNT = 300;
                    //             const LINE_COUNT = 28;
                    //             function getRandomHexColor() {
                    //                 let color;
                    //                 do {
                    //                     color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    //                 } while (color === '#000000'); // Keep generating until a non-black color is obtained
                    //                 return color;
                    //             }
                    //             registerFont(FONT_FILE_PATH, { family: 'Serif' });
                    //             function generateCaptcha(width, height) {
                    //                 const canvas = createCanvas(width, height);
                    //                 const ctx = canvas.getContext('2d');
                    //                 const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    //                 for (let i = 0; i < CAPTCHA_LENGTH; i++) {
                    //                     captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
                    //                 }
                    //                 // Set canvas background with a random hex color
                    //                 const backgroundColor = getRandomHexColor();
                    //                 ctx.fillStyle = backgroundColor;
                    //                 ctx.fillRect(0, 0, width, height);
                    //                 // Draw captcha text using the Arial font
                    //                 ctx.font = `80px Serif`;
                    //                 ctx.fillStyle = 'black';
                    //                 ctx.textAlign = 'center';
                    //                 ctx.textBaseline = 'middle';
                    //                 ctx.fillText(captchaText, width / 2, height / 2);
                    //                 // Draw random dots
                    //                 for (let i = 0; i < DOT_COUNT; i++) {
                    //                     ctx.fillStyle = getRandomHexColor();
                    //                     ctx.beginPath();
                    //                     ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
                    //                     ctx.fill();
                    //                 }
                    //                 // Draw random lines
                    //                 for (let i = 0; i < LINE_COUNT; i++) {
                    //                     ctx.strokeStyle = getRandomHexColor();
                    //                     ctx.beginPath();
                    //                     ctx.moveTo(Math.random() * width, Math.random() * height);
                    //                     ctx.lineTo(Math.random() * width, Math.random() * height);
                    //                     ctx.stroke();
                    //                 }


                    //                 // Return the captcha image as a Discord.js attachment
                    //                 return canvas.toBuffer();
                    //             }
                    //             const canvasW = 300; // rộng
                    //             const canvasH = 100; // cao
                    //             const image = generateCaptcha(canvasW, canvasH);
                    //             const attachment = new AttachmentBuilder(image, 'captcha.png');
                    //             await YubabeLog.send({ content: `${client.e.done} | Đã gửi CAPTCHA ${captchaText}`, files: [attachment] });
                    //             await db.set(`${message.author.id}_captchaDMS`, true);
                    //             await db.set(`${message.author.id}_captchaDMSText`, captchaText);
                    //             await db.set(`${message.author.id}_captchaDMSTime`, 5);
                    //             await message.reply({
                    //                 content: `### 𝓒𝓐𝓟𝓣𝓒𝓗𝓐 DMS!!! Hãy DMS tôi với mã captcha này để chứng minh bạn không auto-spam!\nBạn còn [5/5] cảnh báo!\nNếu bạn gặp vấn đề về giải captcha, xin hãy tải ảnh này về và screen-shot màn hình DMS của tôi đến support server để được trợ giúp!`, files: [attachment]
                    //             });
                    //         } catch (e) {
                    //             console.log("Lỗi button check AUTO", e);
                    //         }
                    //     }
                    // });
                    // collector.on("end", async () => {
                    //     collector.stop();
                    //     buttons.setDisabled(true);
                    //     const row_disbled = new ActionRowBuilder().addComponents(buttons);
                    //     await logging.edit({ content: `Tin nhắn này đã hết hạn`, components: [row_disbled] });
                    // });
                } catch {
                    async err => {
                        console.err;
                        const guilds = client.guilds.cache.find(c => c.id === '1157597853431103559');
                        const ChRules = guilds.channels.cache.find(c => c.id === '1254984842295119933');
                        ChRules.send(err);
                    };
                }
            }



            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Collection());
            }
            const a = await db.get(`${message.channel.id}_${command.name}`);
            const success =
                `${client.e.fail} | Lệnh đã bị vô hiệu hóa tại ${message.channel.name}!`;
            if (a === `false`) return message.reply(success).then(async msg => {
                await client.sleep(5000);
                await msg.delete();
            });
            const now = Date.now();
            const timest = client.cooldowns.get(command.name);
            const cdam = (command.cooldown || 1) * 1000;
            if (timest.has(message.author.id)) {
                let extime = timest.get(message.author.id) + cdam;
                if (now < extime) {
                    let timelms = (extime - now);
                    if (timelms < 1) timelms = Math.round(timelms / 1000);;
                    const timels = Math.round(timelms / 1000);
                    const timeux = Math.floor(Date.now() / 1000) + timels;
                    const timestamp = `<t:${timeux}:R>`;
                    if (timelms && timelms != 0) {
                        not_allowed = true;
                        const logId = "1261103019869868032";
                        const spamId = await client.channels.fetch(logId);
                        const embed = client.embed()
                            .setColor(client.color.x)
                            .setAuthor({ name: `Spamming Log`, iconURL: message.member.displayAvatarURL() })
                            .addFields([
                                { name: `Lệnh Spam`, value: `${command.name} ${timels.toFixed(1)}` },
                                { name: `Người Spam`, value: `${message.author} | ${message.author.username} - ${message.member.displayName}\n(${message.author.id})` },
                                { name: `Server`, value: `${message.guild.name}(${message.guild.id})` }
                            ]);
                        spamId?.send({ embeds: [embed] }).catch(() => { });
                        client.logger.warn(`[SPAMING] - LỆNH ${command.name.toUpperCase()} • ${message.author.tag.toUpperCase()}-(${message.member.displayName.toUpperCase()}) • Tại ${message.guild.name.toUpperCase()}_(${message.guild.id})`);
                        const cdm = await message.channel.send(`**${client.e.fail} | ${message.author.tag}**, hãy chậm lại và thử lại lệnh \`${command.name}\` sau ${timestamp}`);
                        setTimeout(async () => {
                            return cdm.delete().catch(() => { });
                        }, timelms < 15000 ? timelms : 15000);
                        return;
                    }
                }
            }
            timest.set(message.author.id, now);
            setTimeout(() => timest.delete(message.author.id), cdam);

            // Ban mimi bitch
            if (message.guild.members.cache.some(member =>
                [
                    '1207923287519268875',
                    "1271101244089434254"
                ].includes(member.user.id))) return;
            /////////////////////////////

            if (
                command.permissions?.dev &&
                !client.config.dev.includes(message.author.id)
            ) {
                return message.reply(
                    `${client.e.fail} | Lệnh này chỉ dành cho nhà phát triển của bot!`,
                );
            }

            if (command.permissions?.bot) {
                const botPerms = command.permissions.bot;
                if (!message.guild.members.me.permissions.has(botPerms)) {
                    return message.reply(
                        `${client.e.fail} | Bot cần có quyền sau: \`${botPerms.join(", ")}\` để sử dụng lệnh \`${command.name}\``,
                    );
                }
            }

            if (command.permissions?.user) {
                const userPerms = command.permissions.user;
                if (!message.member.permissions.has(userPerms)) {
                    return message.reply(
                        `${client.e.fail} | Bạn cần có quyền sau: \`${userPerms.join(", ")}\` để sử dụng lệnh \`${command.name}\``,
                    );
                }
            }

            const lang = await client.la(message.guild.id);

            const player = client.queue.get(message.guild.id);

            /////////// KHOÁ ECONOMY
            // if (["Economy", "Casino", "Inventory"].includes(command.category)) return await message.reply("Lệnh đang được bảo trì");


            await command
                .run(client, message, args, matchedPrefix, lang)
                .catch((e) => console.error(e));


            // command quest
            await handleCommandQuest(client, message, command);


            let text2 = `[${message.author.tag.toUpperCase()} ĐÃ DÙNG LỆNH ${command.name.toUpperCase()} TẠI ${message.guild.name.toUpperCase()}]`;
            client.logger.log(
                `[CLUSTER ${client.cluster ? client.cluster.id : undefined}] ${text2}`,
            );
        } catch (e) {
            client.logger.error(e.stack);
            client.logger.error(`Có lỗi xảy ra\n${e}`);
        }
    },
};

const questModel = require('../../models/questSchema');
async function handleCommandQuest(client, message, command) {
    if (!client.usedSuccess.get(message.author.id)) return;
    const questData = await questModel.findOne({ userId: message.author.id });
    if (!questData) return;

    const quests = {
        "Farm": questData.plant,
        "Gambling": questData.gambling,
        "Action": questData.action
    };

    const updateProgressQuest = async (quest, commandName, categoryName) => {
        if (quest.isComplete) return;
        if (categoryName == "Gambling" || categoryName == "Action") {
            if (quest.commandName != commandName || quest.isComplete) return;
        }
        quest.progress++;

        if (quest.progress >= quest.maxProgress) {
            quest.isComplete = true;
            await handleRewardQuest(message, client, command, questData, categoryName.toLowerCase());
        }
    };

    const quest = quests[command.category];

    if (quest)
        updateProgressQuest(quest, command.name, command.category);

    if (command.name === "daily" && !questData.daily.isComplete) {
        questData.daily.progress++;
        if (questData.daily.progress >= questData.daily.maxProgress) {
            questData.daily.isComplete = true;
            await handleRewardQuest(message, client, command, questData, "daily");
        }
    };

    await questData.save();
    client.usedSuccess.delete(message.author.id);
}

const handleChatQuest = async (client, message) => {
    if (message.content.length < 5) return;

    else {
        const questData = await questModel.findOne({ userId: message.author.id });
        if (!questData || questData.chat.isComplete) return;

        const contentLength = message.content.length;

        questData.chat.progress += contentLength;

        if (questData.chat.progress >= questData.chat.maxProgress && questData.chat.isComplete == false) {
            questData.chat.progress = questData.chat.maxProgress;
            questData.chat.isComplete = true;
            await handleRewardQuestChat(message, client, questData, "chat");
        }

        await questData.save();
    }
};

const handleNotiCompletedQuest = (message, command, rewardName, reward) => {
    const reward_emojis = {
        "ycoin": emojis.coin,
        "gembox": emojis.gembox,
        "pro_gembox": emojis.progembox,
        "vip_gembox": emojis.vipgembox
    };

    const notiCompletedQuestEmbed = new EmbedBuilder()
        .addFields({
            name: `Chúc mừng bạn đã xong làm xong quest ${command.name}`,
            value: `Phần thưởng: ${reward} ${reward_emojis[rewardName]}`
        })
        .setColor("Green")
        .setTimestamp();
    return message.reply({ embeds: [notiCompletedQuestEmbed] });
};

const handleRewardQuest = async (message, client, command, questData, questType) => {
    const authorId = message.author.id;
    const reward = questData[questType].reward.reward;
    const rewardName = questData[questType].reward.rewardName;

    const rewardNames = {
        "ycoin": async () => { await client.cong(authorId, reward); },
        "gembox": async () => { await client.addgem(authorId, emojis.gembox, reward, 0); },
        "pro_gembox": async () => { await client.addgem(authorId, emojis.progembox, reward, 0); },
        "vip_gembox": async () => { await client.addgem(authorId, emojis.vipgembox, reward, 0); },
    };

    handleNotiCompletedQuest(message, command, rewardName, reward);

    await rewardNames[rewardName]();
};

const handleRewardQuestChat = async (message, client, questData, questType) => {
    const authorId = message.author.id;
    const reward = questData[questType].reward.reward;
    const rewardName = questData[questType].reward.rewardName;

    const rewardNames = {
        "ycoin": async () => { await client.cong(authorId, reward); },
        "gembox": async () => { await client.addgem(authorId, emojis.gembox, reward, 0); },
        "pro_gembox": async () => { await client.addgem(authorId, emojis.progembox, reward, 0); },
        "vip_gembox": async () => { await client.addgem(authorId, emojis.vipgembox, reward, 0); },
    };

    await handleNotiCompletedQuestChat(client, message, rewardName, reward);
    await rewardNames[rewardName]();
};

const handleNotiCompletedQuestChat = async (client, message, rewardName, reward) => {
    try {
        const reward_emojis = {
            "ycoin": emojis.coin,
            "gembox": emojis.gembox,
            "pro_gembox": emojis.progembox,
            "vip_gembox": emojis.vipgembox
        };

        const notiCompletedQuestEmbed = new EmbedBuilder()
            .addFields({
                name: `Chúc mừng bạn đã xong làm xong quest Chat`,
                value: `Phần thưởng: ${reward} ${reward_emojis[rewardName]}`
            })
            .setColor("Green")
            .setTimestamp();
        return message.reply({ embeds: [notiCompletedQuestEmbed] });
    } catch {
        const reward_emojis = {
            "ycoin": emojis.coin,
            "gembox": emojis.gembox,
            "pro_gembox": emojis.progembox,
            "vip_gembox": emojis.vipgembox
        };

        const notiCompletedQuestEmbed = new EmbedBuilder()
            .addFields({
                name: `Chúc mừng bạn đã xong làm xong quest Chat`,
                value: `Phần thưởng: ${reward} ${reward_emojis[rewardName]}`
            })
            .setColor("Green")
            .setTimestamp();

        const toSendUser = await client.users.fetch(message.author.id);
        toSendUser.send({ embeds: [notiCompletedQuestEmbed] });
    }
};
