const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const farmSchema = require("../../models/farmSchema");
const invSchema = require("../../models/invSchema");
const emoji = require("../../configs/config.json");
const feedingSchema = require("../../models/feedingSchema");

const maxTimeLive = 43200000; // 12 tiếng

const obj = {
    "thoc": "ga",
    "co": "bo",
    "camheo": "heo",
};

const awdwadw = {
    "thoc": "gacon",
    "co": "bocon",
    "camheo": "heocon",
};

const convertObj = {
    "gacon": "ga",
    "bocon": "bo",
    "heocon": "heo",
};

module.exports = {
    name: "feed",
    description: {
        content: "Mở bảng cho thú ăn",
        example: "feed",
        usage: "feed"
    },
    aliases: ["thunuoi"],
    cooldown: 10,
    category: "Farm",
    run: async (client, message, args) => {
        const userId = message.author.id;
        const cattles = await farmSchema.find({ memberid: userId, type: "cattle" });
        const feeding = await feedingSchema.findOne({ memberid: userId });

        if (!feeding)
            await feedingSchema.create({
                memberid: userId
            });

        if (cattles.length === 0)
            return message.reply("Hiện tại bạn không có vật nuôi nào");

        let thunuoi = ``;
        let cattleStr = ``;

        const buttons = {
            thoc: new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setEmoji(`${emoji.food.thoc}`)
                .setCustomId(`thoc`)
                .setDisabled(true),
            co: new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setEmoji(`${emoji.food.co}`)
                .setCustomId(`co`)
                .setDisabled(true),
            camheo: new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setEmoji(`${emoji.food.camheo}`)
                .setCustomId(`camheo`)
                .setDisabled(true),
        };

        let notiUser = false;
        let notiStr = ``;

        for (let cattle of cattles) {
            if (feeding[convertObj[cattle.name]].solan < 8 && feeding[convertObj[cattle.name]].timechoangannhat != 0 && Date.now() - feeding[convertObj[cattle.name]].timechoangannhat >= maxTimeLive && await client.cattle(userId, awdwadw[client.thunuoi[convertObj[cattle.name]].thucan], "cattle") > 0) {
                try {
                    notiStr += `${client.thunuoi[convertObj[cattle.name]].emoji} đã chết vì bạn không cho ăn trong 1 thời gian dài\n`;
                    await client.truCattle(userId, cattle.name, cattle.quanlity, "cattle");
                    feeding[convertObj[cattle.name]].timechoangannhat = 0;
                    feeding[convertObj[cattle.name]].solan = 0;
                    feeding[convertObj[cattle.name]].luutrusanpham = 0;

                    await feeding.save();
                    notiUser = true;
                } catch {
                    throw new Error();
                }
            }

            thunuoi += `${emoji.cattle[cattle.name]} : \`${cattle.quanlity}\` `;

            if (feeding[convertObj[cattle.name]].timechoan >= 0 && Date.now() - feeding[convertObj[cattle.name]].timechoan >= 0) {
                buttons[client.thunuoi[convertObj[cattle.name]].thucan].setStyle(ButtonStyle.Success);
                feeding[convertObj[cattle.name]].timechoan = 0;
                await feeding.save();
                if (convertObj[cattle.name] == "ga" && feeding[convertObj[cattle.name]].solan >= 8) buttons[client.thunuoi[convertObj[cattle.name]].thucan].setEmoji(emoji.cattle.gacon);
                if (convertObj[cattle.name] == "bo" && feeding[convertObj[cattle.name]].solan >= 8) buttons[client.thunuoi[convertObj[cattle.name]].thucan].setEmoji(emoji.cattle.bocon);
                if (convertObj[cattle.name] == "heo" && feeding[convertObj[cattle.name]].solan >= 8) buttons[client.thunuoi[convertObj[cattle.name]].thucan].setEmoji(emoji.cattle.heocon);
            } else if (feeding[convertObj[cattle.name]].timechoan !== 0 && Date.now() - feeding[convertObj[cattle.name]].timechoan < 0) {
                buttons[client.thunuoi[convertObj[cattle.name]].thucan].setDisabled(true).setEmoji(client.thunuoi[convertObj[cattle.name]].emoji).setStyle(ButtonStyle.Secondary);
            }

            cattleStr += `\n${client.thunuoi[convertObj[cattle.name]].emoji} | `;
            if (feeding[convertObj[cattle.name]].timechoan !== 0 && Date.now() - feeding[convertObj[cattle.name]].timechoan <= 0) {
                cattleStr += `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - feeding[convertObj[cattle.name]].timechoan).string.long}\``;
            } else if (feeding[convertObj[cattle.name]].solan < 8) {
                cattleStr += `${client.i("fail")} | Chưa Cho Ăn (${feeding[convertObj[cattle.name]].solan}/8)!`;
            } else {
                cattleStr += `${client.i("done")} | Thu hoạch đi bà con (${feeding[convertObj[cattle.name]].solan}/8)!`;
            }

        }

        if (notiUser) {
            const toSendUser = await client.users.fetch(userId);
            return toSendUser.send(notiStr);
        }

        let foods = await invSchema.find({ memberid: userId, type: "food" });

        for (let food of foods) {
            if (food.quanlity > 0 && Date.now() - feeding[obj[food.name]].timechoan >= 0) buttons[food.name].setDisabled(false);
            if (feeding[obj[food.name]].solan >= 8) buttons[food.name].setDisabled(false);
        }

        const foodBtn = new ActionRowBuilder()
            .addComponents(
                buttons.thoc,
                buttons.co,
                buttons.camheo,
            );

        const thunuoiEmbed = new EmbedBuilder()
            .setTitle(`Nhấp vào các nút bên dưới để cho vật nuôi ăn`)
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFields(
                {
                    name: "<a:Yl_ngoisaohivong:919968345418268714> Số vật nuôi hiện có",
                    value: `${thunuoi}`
                },
                {
                    name: "<a:Yl_ngoisaohivong:919968345418268714> Trạng thái vật nuôi",
                    value: `${cattleStr}`,
                    inline: false
                }
            )
            .setColor(`#FFCC00`)
            .setTimestamp();

        const a = await message.channel.send({ embeds: [thunuoiEmbed], components: [foodBtn] });

        const collector = a.createMessageComponentCollector({
            filter: interaction => (interaction.isButton()) && interaction.message.id == a.id,
        });
        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id) {
                const notForYou =
                    `${client.e.fail} | **${i.user.username}** , không phải nút dành cho bạn!`;
                return await i.reply({ content: notForYou, ephemeral: true });
            }

            if (i.customId == client.thunuoi[obj[i.customId]].thucan) {
                !i.replied && await i.deferUpdate();
                const codeCattle = client.thunuoi[obj[i.customId]].code;
                const amountCattle = await client.cattle(i.user.id, awdwadw[i.customId], "cattle");

                if (amountCattle <= 0) {
                    return await message.channel.send(`Bạn không có ${client.thunuoi[codeCattle].emoji} nào để cho ăn`);
                }

                if (!feeding[codeCattle] || feeding && feeding[codeCattle].timechoan === 0) {
                    if (feeding[codeCattle].solan >= 8) {
                        const emojis = {
                            "ga": "<:eggs:1279089883918503977>",
                            "bo": "<:milk_1:1279089889278824458>",
                            "heo": "<:hamleg:1279089886460248127>"
                        };

                        const deobtdatten = {
                            "ga": "trung",
                            "bo": "sua",
                            "heo": "thitheo"
                        };

                        const SP = feeding[codeCattle].luutrusanpham;

                        await message.channel.send(`Bạn đã thu hoạch và lấy được ${SP} ${emojis[codeCattle]}`);

                        let invData = await invSchema.findOne({ memberid: i.user.id, name: deobtdatten[codeCattle], type: "tulanh" });
                        if (!invData)
                            invData = new invSchema({
                                memberid: i.user.id,
                                name: deobtdatten[codeCattle],
                                quanlity: SP,
                                type: "tulanh"
                            });
                        else {
                            invData.quanlity += SP;
                        }

                        feeding[codeCattle].solan = 0;
                        feeding[codeCattle].luutrusanpham = 0;
                        feeding[codeCattle].timechoangannhat = 0;
                        feeding[codeCattle].timechoan = 0;
                        await client.truCattle(i.user.id, awdwadw[i.customId], 1, "cattle");
                        await feeding.save();
                        await invData.save();
                    } else {
                        //!i.replied && await i.deferUpdate();
                        const food = await invSchema.findOne({ memberid: i.user.id, name: client.thunuoi[codeCattle].thucan, type: "food" });

                        food.quanlity -= 1;
                        await food.save();

                        const minSP = client.thunuoi[codeCattle].minHarvest;
                        const maxSP = client.thunuoi[codeCattle].maxHarvest;
                        const randomSP = getRandomSanPham(minSP, maxSP);

                        feeding[codeCattle].timechoan = Date.now() + client.thunuoi[codeCattle].maturityTime;
                        feeding[codeCattle].timechoangannhat = Date.now() + client.thunuoi[codeCattle].maturityTime;
                        feeding[codeCattle].solan++;
                        feeding[codeCattle].luutrusanpham += randomSP;

                        await feeding.save();

                        let timestamp = client.timeStamp(client.thunuoi[codeCattle].maturityTime);

                        await message.channel.send({ content: `**${message.author.username}** đã cho ` + client.thunuoi[codeCattle].emoji + ` ăn! Xin hãy đợi ${timestamp.string.short}!` }).catch();

                        buttons[i.customId].setDisabled(true);
                        buttons[i.customId].setEmoji(client.thunuoi[codeCattle].emoji);
                        buttons[i.customId].setStyle(ButtonStyle.Secondary);
                        const editfoodBtn = new ActionRowBuilder()
                            .addComponents(
                                buttons.thoc,
                                buttons.co,
                                buttons.camheo,
                            );
                        await a.edit({ components: [editfoodBtn] });
                    }
                }
            }
        });

    }
};

const getRandomSanPham = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};
