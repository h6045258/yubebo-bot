const Welcome = require('../models/welcomeSchema');
const Embed = require('../models/embedSchema');

module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
        const guildId = member.guild.id;
        const config = await Welcome.findOne({ guildId });
        if (!config) return;

        const channelId = config.options.welcome.channel;
        if (!channelId) return;

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        let content = config.options.welcome.content;
        const embedName = config.options.welcome.embed;

        let embed = null;
        if (embedName) {
            embed = await Embed.findOne({ guildId, name: embedName });
            if (!embed) {
                config.options.welcome.embed = null;
                await config.save();
                return;
            }
        }

        const message = {};

        if (content) {
            const context = await client.variable(content, member);
            message.content = context;
        }

        if (embed) {
            const welcomeEmbed = client
                .embed()
                .setColor(embed.embed.color || client.color.y)
                .setAuthor(embed.embed.author ? { name: await client.variable(embed.embed.author.text, member), iconURL: await client.variable(embed.embed.author.icon, member) || null } : null)
                .setTitle(embed.embed ? await client.variable(embed.embed.title, member) : null)
                .setDescription(embed.embed ? await client.variable(embed.embed.description, member) : '\u200b')
                .setFooter(embed.embed.footer ? { text: await client.variable(embed.embed.footer.text, member), iconURL: await client.variable(embed.embed.footer.icon, member) || null } : null)
                .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, member) : null)
                .setImage(embed.embed ? await client.variable(embed.embed.image, member) : null)
                .setTimestamp(embed.embed.timestamp === true ? new Date() : null);
            message.embeds = [welcomeEmbed];
        }

        await channel.send(message);
    });

    client.on('guildMemberRemove', async (member) => {
        const guildId = member.guild.id;
        const config = await Welcome.findOne({ guildId });
        if (!config) return;

        const channelId = config.options.leave.channel;
        if (!channelId) return;

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        let content = config.options.leave.content;
        const embedName = config.options.leave.embed;

        let embed = null;
        if (embedName) {
            embed = await Embed.findOne({ guildId, name: embedName });
            if (!embed) {
                config.options.leave.embed = null;
                await config.save();
                return;
            }
        }

        const message = {};

        if (content) {
            const context = await client.variable(content, member);
            message.content = context;
        }

        if (embed) {
            const leaveEmbed = client
                .embed()
                .setColor(embed.embed.color || client.color.y)
                .setAuthor(embed.embed.author ? { name: await client.variable(embed.embed.author.text, member), iconURL: await client.variable(embed.embed.author.icon, member) || null } : null)
                .setTitle(embed.embed ? await client.variable(embed.embed.title, member) : null)
                .setDescription(embed.embed ? await client.variable(embed.embed.description, member) : '\u200b')
                .setFooter(embed.embed.footer ? { text: await client.variable(embed.embed.footer.text, member), iconURL: await client.variable(embed.embed.footer.icon, member) || null } : null)
                .setThumbnail(embed.embed ? await client.variable(embed.embed.thumbnail, member) : null)
                .setImage(embed.embed ? await client.variable(embed.embed.image, member) : null)
                .setTimestamp(embed.embed.timestamp === true ? new Date() : null);
            message.embeds = [leaveEmbed];
        }

        await channel.send(message);
    });

    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        if (!oldMember.premiumSince && newMember.premiumSince) {
            await sendBoostMessage(newMember, client);
        } else if (oldMember.premiumSince && !newMember.premiumSince) {

        } else if (oldMember.premiumSince && newMember.premiumSince && oldMember.premiumSince.getTime() !== newMember.premiumSince.getTime()) {
            await sendBoostMessage(newMember, client);
        }
    });
    async function sendBoostMessage(member, client) {
        const guildId = member.guild.id;
        const config = await Welcome.findOne({ guildId });
        if (!config) return;
        const channelId = config.options.boost.channel;
        if (!channelId) return;
        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;
        let content = config.options.boost.content;
        const embedName = config.options.boost.embed;
        let embed = null;
        if (embedName) {
            embed = await Embed.findOne({ guildId, name: embedName });
            if (!embed) {
                config.options.boost.embed = null;
                await config.save();
                return;
            }
        }
        const ctx = { newMember: member };
        const message = {};
        if (content) {
            const context = await client.variable(content, ctx);
            message.content = context;
        }
        if (embed) {
            const boostEmbed = client
                .embed()
                .setColor(embed.embed.color || client.color.y)
                .setAuthor(embed.embed.author ? { name: await client.variable(embed.embed.author.text, ctx), iconURL: await client.variable(embed.embed.author.icon, ctx) || null } : null)
                .setTitle(embed.embed ? await client.variable(embed.embed.title, ctx) : null)
                .setDescription(embed.embed ? client.variable(embed.embed.description, ctx) : '\u200b')
                .setFooter(embed.embed.footer ? { text: client.variable(embed.embed.footer.text, ctx), iconURL: client.variable(embed.embed.footer.icon, ctx) || null } : null)
                .setThumbnail(embed.embed ? client.variable(embed.embed.thumbnail, ctx) : null)
                .setImage(embed.embed ? client.variable(embed.embed.image, ctx) : null)
                .setTimestamp(embed.embed.timestamp === true ? new Date() : null);
            message.embeds = [boostEmbed];
        }
        await channel.send(message);
    }
}