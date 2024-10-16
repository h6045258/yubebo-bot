const { Collection } = require("discord.js");
const prefix_data = require("../../models/prefixSchema");
const Autoresponder = require("../../models/autoresponderSchema");
const Embed = require('../../models/embedSchema');
const wordConnectionBotModel = require("../../models/wordConnectionBot");
const wordConnectionGameModel = require("../../models/wordConnectionGame");

module.exports = {
    event: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isAutocomplete()) {
            const cmdName = interaction.commandName;
            const subCmd = interaction.options.getSubcommand(false);
            const subCmdGroup = interaction.options.getSubcommandGroup(false);
            if (cmdName === 'embed') {
                const subCmdGroupAutocomplete = ['all', 'author', 'color', 'description', 'footer', 'image', 'thumbnail', 'timestamp', 'title'];
                const subCmdAutoComplete = ['delete', 'show'];
                if (subCmdAutoComplete.includes(subCmd)) {
                    try {
                        const embeds = await Embed.find({ guildId: interaction.guild.id });
                        if (embeds.length === 0) {
                            return interaction.respond([]);
                        }
                        const focusOption = interaction.options.getFocused();
                        const filter = embeds.filter(embed => embed.name.toLowerCase().includes(focusOption.toLowerCase())).slice(0, 25);
                        await interaction.respond(filter.map(embed => ({ name: embed.name, value: embed.name })));
                    } catch (error) {
                        client.logger.error(String(error.stack));
                        await interaction.respond([]);
                    }
                } else if (subCmdGroup === 'edit' && subCmdGroupAutocomplete.includes(subCmd)) {
                    try {
                        const embeds = await Embed.find({ guildId: interaction.guild.id });
                        if (embeds.length === 0) {
                            return interaction.respond([]);
                        }
                        const focusOption = interaction.options.getFocused();
                        const filter = embeds.filter(embed => embed.name.toLowerCase().includes(focusOption.toLowerCase())).slice(0, 25);
                        await interaction.respond(filter.map(embed => ({ name: embed.name, value: embed.name })));
                    } catch (error) {
                        client.logger.error(String(error.stack));
                        await interaction.respond([]);
                    }
                }
            } else if (cmdName === 'autoresponder') {
                const subCmdAutoComplete = ['remove', 'showraw', 'view'];
                const subCmd = interaction.options.getSubcommand(false);
                const subCmdGroup = interaction.options.getSubcommandGroup(false);

                if (subCmdAutoComplete.includes(subCmd)) {
                    try {
                        const triggers = await Autoresponder.find({ guildId: interaction.guild.id });
                        if (triggers.length === 0) {
                            return interaction.respond([]);
                        }
                        const focusOption = interaction.options.getFocused();
                        const filter = triggers.filter(trigger => trigger.trigger.toLowerCase().includes(focusOption.toLowerCase())).slice(0, 25);
                        await interaction.respond(filter.map(trigger => ({ name: trigger.trigger, value: trigger.trigger })));
                    } catch (error) {
                        client.logger.error(String(error.stack));
                        await interaction.respond([]);
                    }
                } else if (subCmd === 'add') {
                    try {
                        const embed = await Embed.find({ guildId: interaction.guild.id });
                        if (embed.length === 0) {
                            return interaction.respond([]);
                        }
                        const focusOption = interaction.options.getFocused();
                        const filter = embed.filter(embed => embed.name.toLowerCase().includes(focusOption.toLowerCase())).slice(0, 25);
                        await interaction.respond(filter.map(embed => ({ name: embed.name, value: embed.name })));
                    } catch (error) {
                        client.logger.error(String(error.stack));
                        await interaction.respond([]);
                    }
                } else if (subCmdGroup === 'edit') {
                    if (subCmdGroup === 'edit') {
                        const triggers = await Autoresponder.find({ guildId: interaction.guild.id });
                        const embeds = await Embed.find({ guildId: interaction.guild.id });

                        if ((subCmd === 'option' || subCmd === 'reply' || subCmd === 'matchmode') && triggers.length === 0) {
                            return interaction.respond([]);
                        }

                        const focusOption = interaction.options.getFocused();
                        const subCmdOption = interaction.options.getFocused(true).name;

                        let filter = [];
                        if (subCmdOption === 'trigger') {
                            filter = triggers.filter(trigger => trigger.trigger.toLowerCase().includes(focusOption.toLowerCase())).slice(0, 25);
                            await interaction.respond(filter.map(trigger => ({ name: trigger.trigger, value: trigger.trigger })));
                        } else if (subCmdOption === 'embed' && embeds.length > 0) {
                            filter = embeds.filter(embed => embed.name.toLowerCase().includes(focusOption.toLowerCase())).slice(0, 25);
                            await interaction.respond(filter.map(embed => ({ name: embed.name, value: embed.name })));
                        } else {
                            await interaction.respond([]);
                        }
                    }
                }
            } else if (cmdName === 'setup') {
                const subCmdAutoComplete = ['boost', 'leave', 'welcome'];
                if (subCmdAutoComplete.includes(subCmd)) {
                    try {
                        const embeds = await Embed.find({ guildId: interaction.guild.id });
                        if (embeds.length === 0) {
                            return interaction.respond([]);
                        }
                        const focusOption = interaction.options.getFocused();
                        const filter = embeds.filter(embed => embed.name.toLowerCase().includes(focusOption.toLowerCase())).slice(0, 25);
                        await interaction.respond(filter.map(embed => ({ name: embed.name, value: embed.name })));
                    } catch (error) {
                        client.logger.error(String(error.stack));
                        await interaction.respond([]);
                    }
                }
            } else if (cmdName === 'word') {


                const subCmdGroupAutocomplete = ['remove', "clear"];
                const subCmdAutocomplete = ['bot', 'free'];
                if (subCmdGroupAutocomplete.includes(subCmdGroup) && subCmdAutocomplete.includes(subCmd)) {
                    try {
                        const focusOption = interaction.options.getFocused(true);
                        let result;

                        if (subCmd === "bot") {
                            const botWordSetup = await wordConnectionBotModel.find();
                            if (botWordSetup.length < 1) {
                                result = [];
                            } else {
                                const guildChannels = interaction.guild.channels.cache;
                                result = botWordSetup
                                    .filter(v => guildChannels.has(v.channelId) && (guildChannels.get(v.channelId).name.toLowerCase().includes(focusOption.value.toLowerCase())))
                                    .map(v => ({ name: `${guildChannels.get(v.channelId).name} ${guildChannels.get(v.channelId).isThread() ? "(Thread)" : "(Channel)"}`, value: v.channelId }))
                                    .slice(0, 25);
                            }
                        } else if (subCmd === "free") {
                            const gameWordSetup = await wordConnectionGameModel.find();
                            if (gameWordSetup.length < 1) {
                                result = [];
                            } else {
                                const guildChannels = interaction.guild.channels.cache;
                                result = gameWordSetup
                                    .filter(v => guildChannels.has(v.channelId) && guildChannels.get(v.channelId).name.toLowerCase().includes(focusOption.value.toLowerCase()))
                                    .map(v => ({ name: `${guildChannels.get(v.channelId).name} ${guildChannels.get(v.channelId).isThread() ? "(Thread)" : "(Channel)"}`, value: v.channelId }))
                                    .slice(0, 25);
                            }
                        }

                        await interaction.respond(result);
                    } catch (error) {
                        client.logger.error(String(error.stack));
                        await interaction.respond([]);
                    }
                }
            }
        } else if (interaction.isChatInputCommand()) {
            const { member, commandName } = interaction;
            const { guild } = member;

            if (!guild) {
                return interaction.reply({
                    content: `${client.e.fail} | Slash commands chỉ sử dụng tại 1 server thôi bạn nhé!`,
                    ephemeral: true,
                }).catch(() => { });
            }

            let prefixData;
            try {
                prefixData = await prefix_data.findOne({ GuildId: guild.id });
            } catch (error) {
                client.logger.error('Lỗi khi lấy dữ liệu prefix:', error);
            }
            const defaultPrefix = "y";
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const prefix = prefixData ? escapeRegex(prefixData.prefix) : escapeRegex(defaultPrefix);

            let command = false;
            const cmdName = commandName.toLowerCase();
            const CategoryName = cmdName + "_";
            let fullCmd = `/${cmdName}`;
            const subCmd = interaction.options.getSubcommand(false)?.toLowerCase();
            const subCmdGroup = interaction.options.getSubcommandGroup(false)?.toLowerCase();
            if (subCmdGroup) fullCmd += ` ${subCmdGroup}`;
            if (subCmd) fullCmd += ` ${subCmd}`;
            try {
                if (subCmdGroup && subCmd) {
                    const slashCmd = `${cmdName}_${subCmdGroup}_${subCmd}`;
                    if (client.slashCommands.has(slashCmd)) {
                        command = client.slashCommands.get(slashCmd);
                    }
                } else if (subCmd) {
                    const slashCmd = `${cmdName}_${subCmd}`;
                    if (client.slashCommands.has(slashCmd)) {
                        command = client.slashCommands.get(slashCmd);
                    }
                } else if (client.slashCommands.has(cmdName)) {
                    command = client.slashCommands.get(cmdName);
                }
            } catch (error) {
                if (client.slashCommands.has(`normal${CategoryName}`)) {
                    command = client.slashCommands.get(`normal${CategoryName}`);
                }
            }
            if (!command) {
                return interaction.reply({
                    content: `${client.e.fail} | Lệnh ${cmdName} không thể chạy được!`,
                    ephemeral: true,
                });
            }

            client.logger.info(`[${interaction.user.tag.toUpperCase()} | ĐÃ DÙNG LỆNH ${fullCmd} TẠI ${interaction.guild.name.toUpperCase()}]`);

            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 1) * 1000;

            if (timestamps.has(member.id)) {
                const expirationTime = timestamps.get(member.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timestamp = Math.floor(expirationTime / 1000);

                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            client.embed()
                                .setColor(client.color.x)
                                .setDescription(`${client.e.load} | Bạn cần đợi đến <t:${timestamp}:R> nữa mới có thể sử dụng được!`),
                        ],
                    });
                }
            }

            timestamps.set(member.id, now);
            setTimeout(() => timestamps.delete(member.id), cooldownAmount);

            if (interaction.guild.members.cache.some(member =>
                [
                    '1207923287519268875',
                    "1271101244089434254"
                ].includes(member.user.id))) return;

            if (
                command.permissions?.dev &&
                !client.config.dev.includes(interaction.user.id)
            ) {
                return interaction.reply({
                    content: `${client.e.fail} | Lệnh này chỉ dành cho nhà phát triển của bot!`,
                    ephemeral: true,
                });
            }

            if (command.permissions?.bot) {
                const botPerms = command.permissions.bot;
                if (!interaction.guild.members.me.permissions.has(botPerms)) {
                    return interaction.reply({
                        content: `${client.e.fail} | Bot cần có quyền sau: \`${botPerms.join(", ")}\` để sử dụng lệnh \`${command.name}\``,
                        ephemeral: true,
                    });
                }
            }

            if (command.permissions?.user) {
                const userPerms = command.permissions.user;
                if (!interaction.member.permissions.has(userPerms)) {
                    return interaction.reply({
                        content: `${client.e.fail} | Bạn cần có quyền sau: \`${userPerms.join(", ")}\` để sử dụng lệnh \`${command.name}\``,
                        ephemeral: true,
                    });
                }
            }

            const lang = await client.la(interaction.guild.id);

            const message = {
                applicationId: interaction?.applicationId,
                attachments: [],
                author: member.user,
                channel: guild.channels.cache.get(interaction.channelId),
                channelId: interaction.channelId,
                member: member,
                client: interaction?.client,
                components: [],
                content: null,
                createdAt: new Date(interaction.createdTimestamp),
                createdTimestamp: interaction.createdTimestamp,
                embeds: [],
                id: interaction.id,
                guild: guild,
                guildId: guild.id,
            };

            try {
                await command.run(client, interaction, member.user, prefix, message, lang);
            } catch (error) {
                client.logger.error(error.stack);
                await interaction.reply({ content: 'Có lỗi xảy ra khi dùng lệnh này!', ephemeral: true });
            }
        }
    },
};
