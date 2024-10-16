const dictionaryModel = require('../../models/WordSchema');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, ComponentType } = require('discord.js');
const forbiddenWord = ["cac", "cặc", "lồn", "địt"];
module.exports = {
    name: 'suggest',
    description: 'góp từ làm phong phú vốn từ cho bot',
    cooldown: 20,
    options: [
        {
            name: "word",
            description: "nhập từ muốn góp ý vào đây",
            required: true,
            type: "String"
        }
    ],
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     * @param {*} user 
     * @param {*} prefix 
     * @param {*} message 
     * @param {*} lang 
     */
    run: async (client, interaction, user, prefix, message, lang) => {
        const censorChannel = client.guilds.cache.get("1157597853431103559").channels.cache.get("1277685061487034421");
        if (!censorChannel.isTextBased()) return;
        const wordDictionaryData = await dictionaryModel.find();

        const word = interaction.options.getString('word').toLowerCase();
        if (word.split(" ").length !== 2) return await interaction.reply({ content: "Chỉ được phép nhập 2 từ", ephemeral: true });
        if (forbiddenWord.includes(word)) return await interaction.reply({ content: "Từ bạn cung cấp đã bị cấm", ephemeral: true });
        else if (await client.checkWord(word)) return await interaction.reply({ content: "Từ nãy đã có trong từ điển rồi <3" });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag} đã góp ý thêm từ mới`, iconURL: client.user.avatarURL() })
            .addFields([
                {
                    name: "Người góp ý",
                    value: `${interaction.user} | ${interaction.user.tag}`,
                    inline: true
                },
                {
                    name: "Từ góp ý",
                    value: `\`\`\`${word}\`\`\``,
                    inline: true
                }
            ]);

        const rejectButton = new ButtonBuilder()
            .setCustomId('reject')
            .setLabel("Từ chối")
            .setStyle(ButtonStyle.Danger);
        const acceptButton = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Đồng ý')
            .setStyle(ButtonStyle.Success);

        const msg = await censorChannel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(acceptButton, rejectButton)] });
        await interaction.reply("Đã gửi yêu cầu góp ý tới máy chủ <3, cảm ơn bạn đã đóng góp :3");

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button
        });

        collector.on('collect', async i => {
            if (!(i.member.roles.cache.has("1157904544378925127") || i.member.permissions.has(PermissionsBitField.Flags.ManageGuild))) {
                return i.reply({ content: "Bạn không có quyền dùng nút này!", ephemeral: true });
            }

            if (i.customId === "accept") {
                await new dictionaryModel({
                    word: word,
                    censorId: i.user.id,
                    suggesterId: interaction.user.id
                }).save();
                await i.reply({ content: `${i.user} Đã duyệt từ **${word}** vào từ điển bot`, components: [], embeds: [] });
                await msg.edit({ components: [] });
            } else if (i.customId === "reject") {
                await i.reply({ content: `${i.user} Đã từ chối duyệt từ **${word}** vào từ điển bot`, components: [], embeds: [] });
                await msg.edit({ components: [] });
            }
        });
    }
};
