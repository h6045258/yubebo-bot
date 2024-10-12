const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "pray",
    category: "Economy",
    aliases: ['dotnhang', 'dichua', 'ditu', 'samhoi', 'caunguyen'],
    cooldown: 300,
    description: {
        content: "Cầu nguyện để nhận lại mai mắn !",
        example: "pray",
        usage: "pray <@user>"
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
        const { QuickDB } = require("quick.db")
        const db = new QuickDB({ table: "DB" })
        if (message.author.id == "869614723283435602") {
            const member = message.author;
            const user = message.mentions.users.first();
            if (!user) {
                await client.pray(member.id);
                const prayed = await client.prayed(member.id);
                const prays = new EmbedBuilder()
                    .setTitle(`<:emoji_247:1276532401522085960> | Qi đã miss you `)
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1252441223294222437/1266346653238169611/image0.gif`)
                    .setDescription(`## Yêu và được yêu, yeee!!
<:emoji_23:1276538318078869514> **__${prayed}__** <:emoji_23:1276538318078869514>`)
                    .setFooter({ text: `💗 Miss tui để được hên 💗`, iconURL: 'https://cdn.discordapp.com/emojis/983135001300307968.png' })
                message.channel.send({ content: `<@${message.author.id}>`, embeds: [prays] });
            }
            else {
                await client.pray(user.id);
                await client.curse(member.id)
                const prayed = await client.prayed(user.id)
                const cursed = await client.prayed(member.id);
                const prays = new EmbedBuilder()
                    .setTitle(`<a:yl_moon:920437547950301294> | ${message.author.username} đã cầu nguyện cho ${user.username}`)
                    .setColor(0xfae4ff)
                    .setThumbnail(`https://i.gifer.com/7Or5.gif`)
                    .addFields({ name: `<a:Yngoisaohivong:919968345418268714> | ${user.username}, bạn đã có được ${prayed + 1} điểm may mắn `, value: `<a:Yngoisaohivong:919968345418268714> | ${message.author.username}, bạn còn ${cursed - 1} điểm may mắn`, inline: true })
                    .setFooter({ text: `Cầu nguyện để nhận sự may mắn!🍀`, iconURL: 'https://cdn.discordapp.com/emojis/983135001300307968.png' })
                await message.channel.send({ content: `<@${message.author.id}>`, embeds: [prays] }).catch(e => console.log(e));
            }
        }
        else {
            const member = message.author;
            const user = message.mentions.users.first();
            if (!user) {
                await client.pray(member.id);
                const prayed = await client.prayed(member.id);
                const prays = new EmbedBuilder()
                    .setTitle(`<a:yl_moon:920437547950301294> | ${message.author.username} đã cầu nguyện`)
                    .setColor(0xfae4ff)
                    .setThumbnail(`https://i.gifer.com/7Or5.gif`)
                    .setDescription(`\`Bạn đã thắp được:\`
<a:Yngoisaohivong:919968345418268714> **__${prayed + 1}__**  <a:Yngoisaohivong:919968345418268714> **ngọn nến may mắn!**`)
                    .setFooter({ text: `Cầu nguyện để nhận sự may mắn!🍀`, iconURL: 'https://cdn.discordapp.com/emojis/983135001300307968.png' })
                message.channel.send({ content: `<@${message.author.id}>`, embeds: [prays] });
            }
            else {
                await client.pray(user.id);
                await client.curse(member.id)
                const prayed = await client.prayed(user.id)
                const cursed = await client.prayed(member.id);
                const prays = new EmbedBuilder()
                    .setTitle(`<a:yl_moon:920437547950301294> | ${message.author.username} đã cầu nguyện cho ${user.username}`)
                    .setColor(0xfae4ff)
                    .setThumbnail(`https://i.gifer.com/7Or5.gif`)
                    .addFields({ name: `<a:Yngoisaohivong:919968345418268714> | ${user.username}, bạn đã có được ${prayed + 1} điểm may mắn `, value: `<a:Yngoisaohivong:919968345418268714> | ${message.author.username}, bạn còn ${cursed - 1} điểm may mắn`, inline: true })
                    .setFooter({ text: `Cầu nguyện để nhận sự may mắn!🍀`, iconURL: 'https://cdn.discordapp.com/emojis/983135001300307968.png' })
                await message.channel.send({ content: `<@${message.author.id}>`, embeds: [prays] }).catch(e => console.log(e))
            }
        }
    }
}