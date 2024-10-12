const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ComponentType } = require("discord.js");
const TrungThuModel = require('../../models/trungThuSchema');
const isCrafting = new Map();
const lantern = {
    name: "Lồng đèn trung thu chống nước",
    dataName: "longdenchongnuoc",
    material: {
        paper: {
            name: "giay",
            required: 4
        },
        stick: {
            name: "que",
            required: 3
        },
        colorBag: {
            name: "mau",
            required: 1
        },
        tape: {
            name: "bangkeo",
            required: 1
        },
        candle: {
            name: "nen",
            required: 1
        },
        lighter: {
            name: "batlua",
            required: 1
        }
    }
};

module.exports = {
    name: "craft",
    category: "Economy",
    aliases: ['chetao', 'dapda', 'trungthu', 'chobomaylongden', 'longden'],
    cooldown: 3,
    description: {
        content: "Hệ thống bảng craft đồ",
        example: "craft",
        usage: "craft"
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    /**
     * 
     * @param {*} client 
     * @param {import('discord.js').Message} message 
     * @param {*} args 
     * @param {*} prefix 
     * @param {*} lang 
     */
    run: async (client, message, args, prefix, lang) => {
        const trungThuData = await TrungThuModel.findOne({ userId: message.author.id }) || await TrungThuModel.create({ userId: message.author.id });

        const buttonCraft = new ButtonBuilder()
            .setCustomId("craft")
            .setLabel("Chế tạo")
            .setStyle(ButtonStyle.Primary);
        const buttonFastCraft = new ButtonBuilder()
            .setCustomId("fastcraft")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Chế tạo nhanh");

        const row = new ActionRowBuilder().addComponents(buttonCraft, buttonFastCraft);

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Bảng chế tạo", iconURL: message.author.displayAvatarURL() })
            .setColor(client.color.y)
            .setFooter({ text: "Hãy cố gắng kiếm thêm nguyên vật liệu :3", iconURL: client.user.avatarURL() });

        addCraftFields(embed, trungThuData, lantern, client);

        const msg = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id && ['craft', 'fastcraft'].includes(i.customId);
        const collector = msg.createMessageComponentCollector({ filter, time: 1000 * 60, componentType: ComponentType.Button });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'craft') {
                const canCraft = checkMaterials(trungThuData, lantern.material);
                if (!canCraft) return await interaction.reply({ content: '<:yb_fail:1163479516325359666> | Bạn không có đủ nguyên liệu để chế tạo.', ephemeral: true });
                if (isCrafting.has(message.id)) return await interaction.reply({ content: "<:yb_fail:1163479516325359666> | Đang trong quá trình chế tạo...", ephemeral: true });
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle("Tiến hành chế tạo lồng đèn...")
                        .setColor(client.color.y)
                        .setImage("https://media.discordapp.net/attachments/1272958150567530587/1285086722836922450/animationtrungthu.gif?ex=66e8fdc6&is=66e7ac46&hm=08898c5a11b21cf57a8e45f0dbf8fb096fe9ca6189f698bafe55d8196f0e8495&=&width=662&height=662")]
                });
                isCrafting.set(message.id, true);
                await client.sleep(6 * 1000);
                isCrafting.delete(message.id);
                await interaction.editReply({ content: `<:yb_success:1163479511636123668> Bạn đã chế tạo thành công x1 **${lantern.name}**!`, embeds: [] });

                deductMaterials(trungThuData, lantern.material);
                const newEmbed = EmbedBuilder.from(msg.embeds[0]);
                await trungThuData.save();
                addCraftFields(newEmbed, trungThuData, lantern, client);

                await msg.edit({ embeds: [newEmbed], components: [row] });

            } else if (interaction.customId === 'fastcraft') {
                const passportCheck = await client.provip2(client, interaction.user.id);
                if (!passportCheck || (!passportCheck?.vip && !passportCheck?.pro)) return await interaction.reply({ content: "Tính năng chỉ cho người dùng có passport!", ephemeral: true });
                const canCraft = checkMaterials(trungThuData, lantern.material);
                if (!canCraft) return await interaction.reply({ content: '<:yb_fail:1163479516325359666> | Bạn không có đủ nguyên liệu để chế tạo.', ephemeral: true });
                if (isCrafting.has(message.id)) return await interaction.reply({ content: "<:yb_fail:1163479516325359666> | Đang trong quá trình chế tạo...", ephemeral: true });


                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle("Tiến hành chế tạo lồng đèn...")
                        .setColor(client.color.y)
                        .setImage("https://media.discordapp.net/attachments/1272958150567530587/1285086722836922450/animationtrungthu.gif?ex=66e8fdc6&is=66e7ac46&hm=08898c5a11b21cf57a8e45f0dbf8fb096fe9ca6189f698bafe55d8196f0e8495&=&width=662&height=662")]
                });

                isCrafting.set(message.id, true);
                await client.sleep(6 * 1000);
                isCrafting.delete(message.id);

                const maxCraftCount = Math.min(
                    Math.floor(trungThuData.giay / lantern.material.paper.required),
                    Math.floor(trungThuData.que / lantern.material.stick.required),
                    Math.floor(trungThuData.mau / lantern.material.colorBag.required),
                    Math.floor(trungThuData.bangkeo / lantern.material.tape.required),
                    Math.floor(trungThuData.nen / lantern.material.candle.required),
                    Math.floor(trungThuData.batlua / lantern.material.lighter.required)
                );

                if (maxCraftCount > 0) {
                    trungThuData.giay -= maxCraftCount * lantern.material.paper.required;
                    trungThuData.que -= maxCraftCount * lantern.material.stick.required;
                    trungThuData.mau -= maxCraftCount * lantern.material.colorBag.required;
                    trungThuData.bangkeo -= maxCraftCount * lantern.material.tape.required;
                    trungThuData.nen -= maxCraftCount * lantern.material.candle.required;
                    trungThuData.batlua -= maxCraftCount * lantern.material.lighter.required;
                    trungThuData.longdenchongnuoc += maxCraftCount;
                }

                const newEmbed = EmbedBuilder.from(msg.embeds[0]);
                await interaction.editReply({ content: `<:yb_success:1163479511636123668> | Bạn đã chế tạo thành công x${maxCraftCount} **${lantern.name}**!`, embeds: [] });

                await trungThuData.save();
                addCraftFields(newEmbed, trungThuData, lantern, client);

                await msg.edit({ embeds: [newEmbed], components: [row] });
            }

        });

        collector.on('end', async () => {
            await msg.edit({ components: [] });
        });
    }
};
const underlineEmoji = "<:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628><:yb_gach:1259907092777537628>";
function addCraftFields(embed, userData, lantern, client) {
    const materials = Object.values(lantern.material);
    embed.spliceFields(0, embed.data.fields?.length || 0);
    materials.forEach(material => {
        embed.addFields({
            name: `${client.trungthu(material.name).emoji}`,
            value: `${formatQuantity(userData[material.name], material.required)} ${isFullRequired(userData[material.name], material.required)}`,
            inline: true
        });
    });
    embed.addFields({
        name: `Tổng ${client.trungthu(lantern.dataName).emoji} đang có: \`${userData.longdenchongnuoc}\``,
        value: underlineEmoji
    });
}

function isFullRequired(current, required) {
    return current >= required ? "<:yb_success:1163479511636123668>" : "<:yb_fail:1163479516325359666>";
}

function formatQuantity(current, min) {
    return `**${current}** / **${min}**`;
}

function checkMaterials(userData, materials) {
    return Object.values(materials).every(material => userData[material.name] >= material.required);
}

function deductMaterials(userData, materials) {
    Object.values(materials).forEach(material => {
        userData[material.name] -= material.required;
    });
    userData.longdenchongnuoc += 1;
}
