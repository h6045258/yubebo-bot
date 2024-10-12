const Autores = require('../models/autoresponderSchema');
const Embed = require('../models/embedSchema');

module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || message.channel.type !== 0) return;

        const guildId = message.guild.id;
        const content = message.content.toLowerCase();

        let db = await Autores.find({ guildId });
        if (!db || db.length === 0) return;

        const matchedEntries = db.filter(entry => {
            const key = entry.trigger.toLowerCase();
            const matchMode = entry.options.matchMode || 'exactly';

            switch (matchMode) {
                case 'exactly':
                    return content === key;
                case 'startswith':
                    return content.startsWith(key);
                case 'endswith':
                    return content.endsWith(key);
                case 'includes':
                    return content.includes(key);
                default:
                    return false;
            }
        });

        for (const entry of matchedEntries) {
            const { reply, embed: embedName } = entry.options;
            const embed = embedName ? await Embed.findOne({ guildId: guildId, name: embedName }) : null;

            const createEmbed = async (embed) => {
                const embedAuthorName = embed.embed && embed.embed.author ? await client.variable(embed.embed.author.text, message, entry) : null;
                const embedAuthorIcon = embed.embed && embed.embed.author ? await client.variable(embed.embed.author.icon, message, entry) : null;
                const embedTitle = embed.embed ? await client.variable(embed.embed.title, message, entry) : null;
                const embedDescription = embed.embed ? await client.variable(embed.embed.description, message, entry) : '\u200b';
                const embedFooterText = embed.embed && embed.embed.footer ? await client.variable(embed.embed.footer.text, message, entry) : null;
                const embedFooterIcon = embed.embed && embed.embed.footer ? await client.variable(embed.embed.footer.icon, message, entry) : null;
                const embedThumbnail = embed.embed ? await client.variable(embed.embed.thumbnail, message, entry) : null;
                const embedImage = embed.embed ? await client.variable(embed.embed.image, message, entry) : null;

                const embedBuilder = client.embed().setColor(embed.embed ? embed.embed.color : client.color.y);

                if (embedAuthorName) {
                    embedBuilder.setAuthor({ name: embedAuthorName, iconURL: embedAuthorIcon });
                }
                if (embedTitle) {
                    embedBuilder.setTitle(embedTitle);
                }
                if (embedDescription) {
                    embedBuilder.setDescription(embedDescription);
                } else {
                    embedBuilder.setDescription('\u200b');
                }
                if (embedFooterText) {
                    embedBuilder.setFooter({ text: embedFooterText, iconURL: embedFooterIcon });
                }
                if (embedThumbnail) {
                    embedBuilder.setThumbnail(embedThumbnail);
                }
                if (embedImage) {
                    embedBuilder.setImage(embedImage);
                }
                if (embed.embed.timestamp) {
                    embedBuilder.setTimestamp(new Date());
                }

                return embedBuilder;
            };

            if (!reply && embed) {
                const embedMessage = await createEmbed(embed);
                await message.channel.send({ embeds: [embedMessage] });
            } else if (reply) {
                const replyMessage = await client.variable(reply, message, entry);

                if (embed) {
                    const embedMessage = await createEmbed(embed);
                    await message.channel.send({ content: replyMessage, embeds: [embedMessage] });
                } else {
                    await message.channel.send({ content: replyMessage });
                }
            }
        }
    });
};