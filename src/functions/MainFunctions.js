const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    Message,
    ChatInputCommandInteraction,
    GuildMember,
    PermissionsBitField
} = require("discord.js");

const language = require("../models/languageSchema");
const translate = require("translatte");

module.exports = async (client) => {
    // Client ngôn ngữ
    client.la = async (guildId) => {
        const data = (await language.findOne({ GuildId: guildId })) || {
            language: "vi",
        };
        const lang = data.language;
        return client.language[lang];
    };

    // Client dịch
    client.translate = async (text, from, to) => {
        try {
            const response = await translate(text, {
                from: from,
                to: to,
            });
            return response.text;
        } catch (error) {
            client.logger.error(`Lỗi khi dịch: ${error.stack}`);
            return null;
        }
    };

    // Client lấy user
    client.getUser = async (message, args) => {
        const errormessage = `Không tìm thấy user!`;
        return new Promise(async (resolve, reject) => {
            let user;
            try {
                user =
                    message.mentions.users.first() ||
                    message.guild.members.cache.get(args[0])?.user ||
                    (await message.guild.members
                        .fetch({ query: args.join(" "), limit: 1 })
                        .then((members) => members.first()?.user)) ||
                    (await client.users.fetch(args[0]).catch(() => null));
                if (!user) return reject(errormessage);
                resolve(user);
            } catch (error) {
                reject(errormessage);
            }
        });
    };

    // Client lấy global user
    client.GetGlobalUser = async (message, args) => {
        const errormessage = `Không tìm thấy user!`;
        return new Promise(async (resolve, reject) => {
            let user;
            try {
                user =
                    message.mentions.users.first() ||
                    (await client.users.fetch(args[0]).catch(() => null));
                if (!user && args.length) {
                    for (const guild of client.guilds.cache.values()) {
                        const member = await guild.members
                            .fetch({ query: args.join(" "), limit: 1 })
                            .then((members) => members.first());
                        if (member) {
                            user = member.user;
                            break;
                        }
                    }
                }
                if (!user) return reject(errormessage);
                resolve(user);
            } catch (error) {
                reject(errormessage);
            }
        });
    };

    client.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    client.findUserById = async (userId) => {
        try {
            const user = await client.users.fetch(userId);
            return user;
        } catch (error) {
            console.error(`Failed to fetch user with ID ${userId}: ${error}`);
            return null;
        }
    };

    client.chunk = (array, size) => {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
            chunked_arr.push(array.slice(index, size + index));
            index += size;
        }
        return chunked_arr;
    }

    client.formatTime = (ms) => {
        const minuteMs = 60 * 1000;
        const hourMs = 60 * minuteMs;
        const dayMs = 24 * hourMs;
        if (ms < minuteMs) {
            return `${ms / 1000}s`;
        } else if (ms < hourMs) {
            return `${Math.floor(ms / minuteMs)} phút ${Math.floor(
                (ms % minuteMs) / 1000
            )} giây`;
        } else if (ms < dayMs) {
            return `${Math.floor(ms / hourMs)} giờ ${Math.floor(
                (ms % hourMs) / minuteMs
            )} phút`;
        } else {
            return `${Math.floor(ms / dayMs)} ngày ${Math.floor((ms % dayMs) / hourMs)} giờ`;
        }
    }

    client.progressBar = (current, total, size = 20) => {
        const percent = Math.round((current / total) * 100);
        const filledSize = Math.round((size * current) / total);
        const emptySize = size - filledSize;
        const filledBar = "▓".repeat(filledSize);
        const emptyBar = "░".repeat(emptySize);
        const progressBar = `${filledBar}${emptyBar} ${percent}%`;
        return progressBar;
    }

    // Client phân trang (message, interaction) đều dùng được
    client.swap = async (ctx, embed) => {
        try {
            let page = 0;
            const getButton = (page) => {
                const firstEmbed = page === 0;
                const lastEmbed = page === embed.length - 1;
                const pageEmbed = embed[page];
                const first = new ButtonBuilder()
                    .setCustomId("fast")
                    .setEmoji(client.e.swap_page.previous)
                    .setStyle(ButtonStyle.Secondary);
                if (firstEmbed) first.setDisabled(true);
                const back = new ButtonBuilder()
                    .setCustomId("back")
                    .setEmoji(client.e.swap_page.rewind)
                    .setStyle(ButtonStyle.Secondary);
                if (firstEmbed) back.setDisabled(true);
                const next = new ButtonBuilder()
                    .setCustomId("next")
                    .setEmoji(client.e.swap_page.forward)
                    .setStyle(ButtonStyle.Secondary);
                if (lastEmbed) next.setDisabled(true);
                const last = new ButtonBuilder()
                    .setCustomId("last")
                    .setEmoji(client.e.swap_page.skip)
                    .setStyle(ButtonStyle.Secondary);
                if (lastEmbed) last.setDisabled(true);
                const stop = new ButtonBuilder()
                    .setCustomId("stop")
                    .setEmoji(client.e.swap_page.home)
                    .setStyle(ButtonStyle.Danger);
                const row = new ActionRowBuilder().addComponents(
                    first, back, stop, next, last
                );
                return { embeds: [pageEmbed], components: [row] };
            };
            const msgOptions = getButton(0);
            let msg;
            let author;
            if (ctx instanceof CommandInteraction) {
                msg = await ctx.editReply({ ...msgOptions, fetchReply: true });
                author = ctx.user;
            } else if (ctx instanceof Message) {
                msg = await ctx.channel.send(msgOptions);
                author = ctx.author;
            } else {
                throw new Error("ctx must be an instance of CommandInteraction or Message");
            }
            const filter = (int) => int.user.id === author.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                time: 60000,
            });
            collector.on("collect", async (interaction) => {
                if (interaction.user.id === author.id) {
                    await interaction.deferUpdate();
                    if (interaction.customId === "fast") {
                        if (page !== 0) {
                            page = 0;
                            const newEmbed = getButton(page);
                            if (ctx instanceof CommandInteraction) {
                                await interaction.editReply(newEmbed);
                            } else {
                                await msg.edit(newEmbed);
                            }
                        }
                    }
                    if (interaction.customId === "back") {
                        if (page !== 0) {
                            page--;
                            const newEmbed = getButton(page);
                            if (ctx instanceof CommandInteraction) {
                                await interaction.editReply(newEmbed);
                            } else {
                                await msg.edit(newEmbed);
                            }
                        }
                    }
                    if (interaction.customId === "stop") {
                        collector.stop();
                        if (ctx instanceof CommandInteraction) {
                            await interaction.editReply({
                                embeds: [embed[page]],
                                components: [],
                            });
                        } else {
                            await msg.edit({
                                embeds: [embed[page]],
                                components: [],
                            });
                        }
                    }
                    if (interaction.customId === "next") {
                        if (page !== embed.length - 1) {
                            page++;
                            const newEmbed = getButton(page);
                            if (ctx instanceof CommandInteraction) {
                                await interaction.editReply(newEmbed);
                            } else {
                                await msg.edit(newEmbed);
                            }
                        }
                    }
                    if (interaction.customId === "last") {
                        if (page !== embed.length - 1) {
                            page = embed.length - 1;
                            const newEmbed = getButton(page);
                            if (ctx instanceof CommandInteraction) {
                                await interaction.editReply(newEmbed);
                            } else {
                                await msg.edit(newEmbed);
                            }
                        }
                    }
                } else {
                    await interaction.reply({
                        content: `${client.emoji.fail} | Bạn không có quyền sử dụng các phím điều khiển này!`,
                        ephemeral: true,
                    });
                }
            });
            collector.on("end", async () => {
                msg.edit({ embeds: [embed[page]], components: [] });
            });
        } catch (error) {
            console.error(`Error in client.swap:`, error);
            if (ctx instanceof CommandInteraction) {
                await ctx.editReply({ content: 'Đã xảy ra lỗi khi phân trang.', ephemeral: true });
            } else {
                await ctx.channel.send({ content: 'Đã xảy ra lỗi khi phân trang.' });
            }
        }
    };

    client.variable = async (content, ctx, entry /* args = [], additional = {}*/) => {
        if (!content) return content;

        let user = null;
        let guildMember = null;
        let guild = null;
        let channel = null;
        let message = null;
        let ignoreErrors = false;

        if (ctx instanceof Message) {
            user = ctx.author;
            guildMember = ctx.member;
            guild = ctx.guild;
            channel = ctx.channel;
            message = ctx;
        } else if (ctx instanceof ChatInputCommandInteraction) {
            user = ctx.user;
            guildMember = ctx.member;
            guild = ctx.guild;
            channel = ctx.channel;
            message = ctx.options.getMessage('message') || ctx;
        } else if (ctx instanceof GuildMember) {
            user = ctx.user;
            guildMember = ctx;
            guild = ctx.guild;
        } else if (ctx.oldMember && ctx.newMember) {
            user = ctx.newMember.user;
            guildMember = ctx.newMember;
            guild = ctx.newMember.guild;
        }

        const boost = {
            0: 0,
            1: 3,
            2: 7,
            3: 14
        };
        const curBoostLvl = guild ? guild.premiumTier : 0;
        const curBoostcount = guild ? guild.premiumSubscriptionCount : 0;
        const nextBoostLvl = curBoostLvl < 3 ? (curBoostLvl + 1) : null;
        const nextBoostLvlReq = nextBoostLvl ? boost[nextBoostLvl] : null;
        const endBoost = (nextBoostLvlReq !== null) ? (nextBoostLvlReq - curBoostcount) : null;

        const checkPermission = (permissions) => guildMember.permissions.has(PermissionsBitField.Flags[permissions]);
        const replace = {
            'require_user': {
                regex: /{require_user:([\d,]+)}/g,
                action: (match) => {
                    const ids = match[1].split(',').map(id => id.trim());
                    return ids.some(id => user.id === id);
                }
            },
            'require_perm': {
                regex: /{require_perm:([A-Za-z_,]+)}/g,
                action: (match) => {
                    const permissions = match[1].split(',').map(perm => perm.trim());
                    return permissions.every(permission => checkPermission(permission));
                }
            },
            'require_channel': {
                regex: /{require_channel:([\d,]+)}/g,
                action: (match) => {
                    const ids = match[1].split(',').map(id => id.trim());
                    return ids.some(id => channel.id === id);
                }
            },
            'require_role': {
                regex: /{require_role:([\d,]+)}/g,
                action: (match) => {
                    const ids = match[1].split(',').map(id => id.trim());
                    return ids.some(id => guildMember.roles.cache.has(id));
                }
            },
            'deny_user': {
                regex: /{deny_user:([\d,]+)}/g,
                action: (match) => {
                    const ids = match[1].split(',').map(id => id.trim());
                    return !ids.some(id => user.id === id);
                }
            },
            'deny_perm': {
                regex: /{deny_perm:([A-Za-z_,]+)}/g,
                action: (match) => {
                    const permissions = match[1].split(',').map(perm => perm.trim());
                    return !permissions.some(permission => checkPermission(permission));
                }
            },
            'deny_channel': {
                regex: /{deny_channel:([\d,]+)}/g,
                action: (match) => {
                    const ids = match[1].split(',').map(id => id.trim());
                    return !ids.some(id => channel.id === id);
                }
            },
            'deny_role': {
                regex: /{deny_role:([\d,]+)}/g,
                action: (match) => {
                    const ids = match[1].split(',').map(id => id.trim());
                    return !ids.some(id => guildMember.roles.cache.has(id));
                }
            },
            'dm': {
                regex: /{dm}/g,
                action: async (match) => {
                    if (user) {
                        const modifiedContent = content.replace(match[0], '');
                        await user.send(modifiedContent);
                        return false;
                    }
                    return false;
                }
            },
            'send_to': {
                regex: /{send_to:(\d+)}/g,
                action: async (match) => {
                    const targetChannelId = match[1];
                    const targetChannel = guild.channels.cache.get(targetChannelId);
                    if (targetChannel) {
                        const modifiedContent = content.replace(match[0], '');
                        await targetChannel.send(modifiedContent);
                        return false;
                    }
                    return true;
                }
            },
            'delete_trigger': {
                regex: /{delete_trigger:(\d+)}/g,
                action: async (match) => {
                    const deleteAfter = parseInt(match[1]) * 1000;
                    setTimeout(() => {
                        if (message) message.delete().catch(() => null);
                    }, deleteAfter);
                    return true;
                }
            },
            'delete_reply': {
                regex: /{delete_reply:(\d+)}/g,
                action: async (match) => {
                    const deleteAfter = parseInt(match[1]) * 1000;

                    const modifiedContent = content.replace(match[0], '');

                    const sentMessage = await channel.send(modifiedContent);
                    setTimeout(() => sentMessage.delete().catch(() => null), deleteAfter);

                    return false;
                }
            },
            'cooldown': {
                regex: /{cooldown:(\d+)}/g,
                action: (match) => {
                    const cooldownTime = parseInt(match[1]);
                    const now = Date.now();
                    const trigger = entry.trigger;
                    let timestamps = client.cooldowns.get(trigger);
                    if (!timestamps) {
                        timestamps = new Map();
                        client.cooldowns.set(trigger, timestamps);
                    }

                    const expirationTime = timestamps.get(user.id) + cooldownTime * 1000;
                    if (now < expirationTime) {
                        return false;
                    } else {
                        timestamps.set(user.id, now);
                        setTimeout(() => timestamps.delete(user.id), cooldownTime * 1000);
                        return true;
                    }
                }
            },
            'ignore_errors': {
                regex: /{ignore_errors}/g,
                action: () => {
                    ignoreErrors = true;
                    return true;
                }
            },
            'add_role': {
                regex: /{add_role:(\d+)}/g,
                action: async (match) => {
                    const roleId = match[1];
                    const role = guild.roles.cache.get(roleId);
                    if (role) {
                        await guildMember.roles.add(role);
                        return true;
                    }
                    return false;
                }
            },
            'remove_role': {
                regex: /{remove_role:(\d+)}/g,
                action: async (match) => {
                    const roleId = match[1];
                    const role = guild.roles.cache.get(roleId);
                    if (role) {
                        await guildMember.roles.remove(role);
                        return true;
                    }
                    return false;
                }
            },
            'set_nick': {
                regex: /{set_nick:(.+)}/g,
                action: async (match) => {
                    const nickname = match[1];
                    await guildMember.setNickname(nickname);
                    return true;
                }
            },
            'react_trigger': {
                regex: /{react_trigger:([^}.,]+(?:,[^}.,]+)*)}/g,
                action: async (match) => {
                    const emojis = match[1].split(',').map(e => e.trim()).slice(0, 3);
                    for (const emoji of emojis) {
                        await message.react(emoji).catch(console.error);
                    }
                    return true;
                }
            },
            'react_reply': {
                regex: /{react_reply:([^}.,]+(?:,[^}.,]+)*)}/g,
                action: async (match) => {
                    const emojis = match[1].split(',').map(e => e.trim()).slice(0, 3);
                    const modifiedContent = content.replace(match[0], '');
                    const sentMessage = await channel.send(modifiedContent);
                    for (const emoji of emojis) {
                        await sentMessage.react(emoji).catch(console.error);
                    }
                    return false;
                }
            },
            'reply': {
                regex: /{reply}/g,
                action: async () => {
                    if (message) {
                        const modifiedContent = content.replace('{reply}', '');
                        await message.reply(modifiedContent);
                        return false;
                    }
                    return true;
                }
            },
            'reply_no_mention': {
                regex: /{reply_no_mention}/g,
                action: async () => {
                    if (message) {
                        const modifiedContent = content.replace('{reply_no_mention}', '');
                        await message.reply({
                            content: modifiedContent,
                            allowedMentions: { repliedUser: false }
                        });
                        return false;
                    }
                    return true;
                }
            },
            'message_no_mention': {
                regex: /{message_no_mention}/g,
                action: async () => {
                    const modifiedContent = content.replace('{message_no_mention}', '');
                    await channel.send({
                        content: modifiedContent,
                        allowedMentions: { parse: [] }
                    });
                    return false;
                }
            }
        };

        for (const [, { regex, action }] of Object.entries(replace)) {
            const matches = [...content.matchAll(regex)];
            for (const match of matches) {
                try {
                    const actionResult = await action(match);
                    if (!ignoreErrors && !actionResult) return null;
                    content = content.replace(match[0], '');
                } catch (error) {
                    if (!ignoreErrors) return null;
                }
            }
        }
        for (const [, { regex }] of Object.entries(replace)) {
            content = content.replace(regex, '');
        }

        return content
            .replace(/{user}/g, user ? `<@${user.id}>` : '')
            .replace(/{user_tag}/g, user ? user.tag : '')
            .replace(/{user_name}/g, user ? user.username : '')
            .replace(/{user_avatar}/g, user ? user.displayAvatarURL({}) : '')
            .replace(/{user_discrim}/g, user ? user.discriminator : '')
            .replace(/{user_id}/g, user ? user.id : '')
            .replace(/{user_nick}/g, guildMember ? guildMember.displayName : user ? user.username : '')
            .replace(/{user_joindate}/g, guildMember ? new Date(guildMember.joinedTimestamp).toLocaleDateString('vi-VN') : '')
            .replace(/{user_createdate}/g, user ? new Date(user.createdTimestamp).toLocaleDateString('vi-VN') : '')
            .replace(/{user_displaycolor}/g, guildMember ? guildMember.displayHexColor : '')
            .replace(/{user_boostsince}/g, guildMember && guildMember.premiumSince ? new Date(guildMember.premiumSince).toLocaleDateString('vi-VN') : 'N/A')
            .replace(/{server_prefix}/g, client.prefix || '')
            .replace(/{server_name}/g, guild ? guild.name : '')
            .replace(/{server_id}/g, guild ? guild.id : '')
            .replace(/{server_membercount}/g, guild ? guild.memberCount.toLocaleString() : '')
            .replace(/{server_membercount_nobots}/g, guild ? guild.members.cache.filter(member => !member.user.bot).size.toString() : '')
            .replace(/{server_botcount}/g, guild ? guild.members.cache.filter(member => member.user.bot).size.toString() : '')
            .replace(/{server_icon}/g, guild ? guild.iconURL({}) : '')
            .replace(/{server_rolecount}/g, guild ? guild.roles.cache.size.toString() : '')
            .replace(/{server_channelcount}/g, guild ? guild.channels.cache.size.toString() : '')
            .replace(/{server_randommember}/g, guild ? guild.members.cache.random().user.username : '')
            .replace(/{server_randommember_tag}/g, guild ? guild.members.cache.random().user.tag : '')
            .replace(/{server_randommember_nobots}/g, guild ? guild.members.cache.filter(member => !member.user.bot).random().user.username : '')
            .replace(/{server_owner}/g, guild ? '<#' + guild.ownerId + '>' : '')
            .replace(/{server_owner_id}/g, guild ? guild.ownerId : '')
            .replace(/{server_createdate}/g, guild ? new Date(guild.createdTimestamp).toLocaleDateString('vi-VN') : '')
            .replace(/{server_boostlevel}/g, curBoostLvl !== null ? curBoostLvl.toString() : 'N/A')
            .replace(/{server_boostcount}/g, curBoostcount !== null ? curBoostcount.toString() : 'N/A')
            .replace(/{server_nextboostlevel}/g, nextBoostLvl !== null ? nextBoostLvl.toString() : 'Tối đa')
            .replace(/{server_nextboostlevel_required}/g, nextBoostLvlReq !== null ? nextBoostLvlReq.toString() : 'Tối đa')
            .replace(/{server_nextboostlevel_until_required}/g, endBoost !== null ? endBoost.toString() : '0')
            .replace(/{channel}/g, channel ? `<@${channel.id}>` : '')
            .replace(/{channel_name}/g, channel ? channel.name : '')
            .replace(/{channel_createdate}/g, channel ? new Date(channel.createdTimestamp).toLocaleDateString('vi-VN') : '')
            .replace(/{message_link}/g, message && guild && channel ? `https://discordapp.com/channels/${guild.id}/${channel.id}/${message.id}` : '')
            .replace(/{message_id}/g, message ? message.id : '')
            .replace(/{message_content}/g, message ? message.content : '')
            .replace(/{date}/g, new Date().toLocaleDateString('vi-VN'))
            .replace(/{newline}/g, '\n');
    };
};
