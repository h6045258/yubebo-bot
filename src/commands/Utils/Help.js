const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");
const language = require('../../models/languageSchema');
const { allowedNodeEnvironmentFlags } = require("process");

module.exports = {
    name: 'help',
    aliases: ['cuutoivoi', 'cuutuivoi', 'giaicuudiemmy'],
    category: 'Utils',
    cooldown: 5,
    description: {
        content: 'Xem các lệnh trợ giúp của bot!',
        example: 'help animal',
        usage: 'help <command name>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        try {
            let data = await language.findOne({ GuildId: message.guild.id });
            if (!data) {
                data = new language({
                    GuildId: message.guild.id,
                    language: 'vi'
                });
                await data.save();
            };
            if (args[0]) {
                const embed = await client.embed().setColor(client.color.y);
                let cmd = client.commands.get(
                    client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase(),
                );
                const command =
                    client.commands.get(args[0].toLowerCase()) ||
                    client.commands.get(client.aliases.get(args[0].toLowerCase()));
                let cat = false;
                if (!command) {
                    cat = client.categories.find((cat) =>
                        cat.toLowerCase().includes(args[0].toLowerCase()),
                    );
                }
                if (!command && (!cat || cat == null)) {
                    return message
                        .reply({
                            content: lang.utils.help_1.replace("{value}", args[0]),
                            allowedMentions: { repliedUser: false },
                        })
                        .then(async (ctx) => {
                            client.sleep(5000);
                            await ctx.delete();
                        });
                } else if (cat) {
                    let category = cat;
                    const cats = client.commands
                        .filter((cmd) => cmd.category === category)
                        .map((cmd) => `\`${cmd.name}\``);

                    let embeds = getEmbed();

                    if (cat == "Action") {
                        return message.reply({
                            embeds: [embeds[0]],
                            allowedMentions: { repliedUser: false },
                        });
                    }

                    if (cat == "Animal") {
                        return message.reply({
                            embeds: [embeds[1]],
                            allowedMentions: { repliedUser: false },
                        });
                    }

                    if (cat == "Casino") {
                        return message.reply({
                            embeds: [embeds[2]],
                            allowedMentions: { repliedUser: false }
                        });
                    }

                    if (cat == "Config") {
                        return message.reply({
                            embeds: [embeds[3]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Economy") {
                        return message.reply({
                            embeds: [embeds[4]],
                            allowedMentions: { repliedUser: false },
                        });
                    }

                    if (cat == "Emote") {
                        return message.reply({
                            embeds: [embeds[5]],
                            allowedMentions: { repliedUser: false },
                        });
                    }

                    if (cat == "Farm") {
                        return message.reply({
                            embeds: [embeds[6]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Gambling") {
                        return message.reply({
                            embeds: [embeds[7]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Giveaway") {
                        return message.reply({
                            embeds: [embeds[8]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Inventory") {
                        return message.reply({
                            embeds: [embeds[9]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Marry") {
                        return message.reply({
                            embeds: [embeds[10]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Music") {
                        return message.reply({
                            embeds: [embeds[11]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Passport") {
                        return message.reply({
                            embeds: [embeds[12]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    if (cat == "Utils") {
                        return message.reply({
                            embeds: [embeds[13]],
                            allowedMentions: { repliedUser: false },
                        });
                    }
                    return message.reply({
                        content: lang.utils.help_2
                            .replace("{value}", args[0]),
                        allowedMentions: { repliedUser: false },
                    });
                }
                const tr_content = await client.translate(cmd.description.content, 'auto', data.language);
                const tr_example = await client.translate(cmd.description.example, 'auto', data.language);
                const tr_usage = await client.translate(cmd.description.usage, 'auto', data.language);
                if (cmd.name)
                    embed.addFields({
                        name: lang.utils.help_3,
                        value: `\`${cmd.name}\``,
                    });
                if (cmd.category)
                    embed.addFields({
                        name: lang.utils.help_4,
                        value: `\`${cmd.category}\``,
                    });
                if (cmd.description.content)
                    embed.addFields({
                        name: lang.utils.help_5,
                        value: `\`${tr_content}\``,
                    });
                if (cmd.description.example)
                    embed.addFields({
                        name: lang.utils.help_6,
                        value: `\`${tr_example}\``,
                    });
                if (cmd.description.usage)
                    embed.addFields({
                        name: lang.utils.help_7,
                        value: `\`${tr_usage}\``,
                    });
                if (cmd.aliases)
                    try {
                        embed.addFields({
                            name: lang.utils.help_8,
                            value: cmd.aliases.map((a) => `\`${a}\``).join(", "),
                        });
                    } catch { }

                if (cmd.cooldown)
                    embed.addFields({
                        name: lang.utils.help_9,
                        value: `\`${cmd.cooldown}s\``,
                        inline: true,
                    });
                if (cmd.permissions)
                    embed.addFields({
                        name: lang.utils.help_10,
                        value: lang.utils.help_11
                            .replace('{value1}', cmd.permissions.bot ? cmd.permissions.bot.map((a) => `\`${a}\``).join(', ') : `${client.e.fail}`)
                            .replace('{value2}', cmd.permissions.user ? cmd.permissions.user.map((b) => `\`${b}\``).join(', ') : `${client.e.fail}`),
                    });

                return message.reply({
                    embeds: [embed],
                    allowedMentions: { repliedUser: false },
                });
            } else {
                let options = [
                    {
                        label: "Action",
                        value: "action",
                        emoji: "<a:Yl_clap:901921064974680106>",
                        description: "Các lệnh hành động vui nhộn",
                    },
                    {
                        label: "Animal",
                        value: "animal",
                        emoji: "<:G_bachtuoc:974392970931470347>",
                        description: "Các lệnh săn thú và xem zoo",
                    },
                    {
                        label: "Casino",
                        value: "casino",
                        emoji: "<:ycoin:906620168069845033>",
                        description: "Các lệnh casino cờ bạc"
                    },
                    {
                        label: "Config",
                        value: "config",
                        emoji: "<a:yl_loading:1109041890667544678>",
                        description: "Các lệnh cài đặt cho server",
                    },
                    {
                        label: "Economy",
                        value: "economy",
                        emoji: "<a:Yu_cassh:942212732642537502>",
                        description: "Các lệnh liên quan đến Ycoin",
                    },
                    {
                        label: "Emote",
                        value: "emote",
                        emoji: "😄",
                        description: "Các lệnh biểu cảm anime",
                    },
                    {
                        label: "Farm",
                        value: "farm",
                        emoji: "<:Yu_co:953408530474475520>",
                        description: "Các lệnh trồng cây",
                    },
                    {
                        label: "Gambling",
                        value: "gambling",
                        emoji: "🎲",
                        description: "Các lệnh fun, gamble",
                    },
                    {
                        label: "Giveaway",
                        value: "giveaway",
                        emoji: "🎉",
                        description: "Lệnh giveaway của bot",
                    },
                    {
                        label: "Inventory",
                        value: "inventory",
                        emoji: "<:box:974069616093560852>",
                        description: "Các lệnh xem túi đồ",
                    },
                    {
                        label: "Marry",
                        value: "marry",
                        emoji: "<:Yu_nhanvangkc:951586992897024060>",
                        description: "Các lệnh relationship và marry",
                    },
                    {
                        label: "Music",
                        value: 'music',
                        emoji: ":<a:emoji_315:1258303949933510657>",
                        description: "Các lệnh music âm nhạc",
                    },
                    {
                        label: "Passport",
                        value: "passport",
                        emoji: "<:VIPPassport:988093810955411456>",
                        description: "Các lệnh mua bán",
                    },
                    {
                        label: "Utils",
                        value: "utils",
                        emoji: "<a:yb_utils:1258831339084447835>",
                        description: "Lệnh tiện ích của bot",
                    },
                ];

                const back = new ButtonBuilder()
                    .setCustomId("back")
                    .setEmoji(client.e.swap_page.rewind)
                    .setStyle(ButtonStyle.Secondary);
                const home = new ButtonBuilder()
                    .setCustomId("home")
                    .setEmoji(client.e.swap_page.home)
                    .setStyle(ButtonStyle.Secondary);
                const next = new ButtonBuilder()
                    .setCustomId("next")
                    .setEmoji(client.e.swap_page.forward)
                    .setStyle(ButtonStyle.Secondary);
                const search = new ButtonBuilder()
                    .setCustomId("search")
                    .setEmoji("<:yb_magnifier:1257667361637404742>")
                    .setLabel("Tìm Lệnh")
                    .setStyle(ButtonStyle.Secondary);
                const invite = new ButtonBuilder()
                    .setEmoji("🔗")
                    .setLabel("SUPPORT SERVER")
                    .setURL("https://discord.gg/yubabe")
                    .setStyle(ButtonStyle.Link);
                let select = new StringSelectMenuBuilder()
                    .setCustomId("help")
                    .setPlaceholder(lang.utils.help_13)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(options.filter(Boolean));

                let buttonRow = new ActionRowBuilder().addComponents([
                    back,
                    home,
                    next,
                    search,
                    invite,
                ]);
                let selectRow = new ActionRowBuilder().addComponents([select]);
                const allComponent = [buttonRow, selectRow];
                let main_embed = client
                    .embed()
                    .setColor(client.color.y)
                    .setDescription(
                        lang.utils.help_14
                            .replace("{value}", message.author)
                            .replace("{value2}", client.user.username)
                            .replace("{value3}", prefix),
                    )
                    .setFooter({ text: lang.utils.help_15 });

                const msg = await message.reply({
                    embeds: [main_embed],
                    components: allComponent,
                    allowedMentions: { repliedUser: false },
                });
                let editor = false;
                var embeds = [main_embed];
                for (const emyeu of getEmbed(true)) embeds.push(emyeu);
                let currentPage = 0;
                const filter = (i) => (i.isButton() || i.isStringSelectMenu() || i.isModalSubmit()) && i.user && i.message.author.id == client.user.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 180e3,
                });

                async function handleSearch(i) {
                    const modal = new ModalBuilder()
                        .setCustomId("cmdsearch")
                        .setTitle("Tìm Lệnh");

                    const commandInput = new TextInputBuilder()
                        .setCustomId("cmdinput")
                        .setLabel("Nhập tên lệnh")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const firstActionRow = new ActionRowBuilder().addComponents(
                        commandInput,
                    );
                    modal.addComponents(firstActionRow);

                    await i.showModal(modal);

                    const collected = await i.awaitModalSubmit({
                        filter: (m) => m.customId === "cmdsearch",
                        time: 60000,
                    });

                    if (collected) {
                        const commandName = collected.fields.getTextInputValue("cmdinput");
                        const cmd = client.commands.get(
                            client.aliases.get(commandName.toLowerCase()) ||
                            commandName.toLowerCase(),
                        );

                        if (!cmd) {
                            return collected.reply({
                                content: lang.utils.help_1.replace("{value}", commandName),
                                ephemeral: true,
                            });
                        }

                        var embed = client.embed();

                        embed.setColor(client.color.y)
                        embed.addFields(
                            {
                                name: lang.utils.help_3,
                                value: `\`${cmd.name}\``,
                            },
                            {
                                name: lang.utils.help_4,
                                value: `\`${cmd.category}\``,
                            }
                        );

                        if (cmd.description.content) {
                            embed.addFields({
                                name: lang.utils.help_5,
                                value: cmd.description.content
                            });
                        }

                        if (cmd.description.example) {
                            embed.addFields({
                                name: lang.utils.help_6,
                                value: cmd.description.example
                            });
                        }

                        if (cmd.description.usage) {
                            embed.addFields({
                                name: lang.utils.help_7,
                                value: cmd.description.usage
                            });
                        }

                        if (cmd.aliases) {
                            embed.addFields({
                                name: lang.utils.help_8,
                                value: cmd.aliases.map((a) => `\`${a}\``).join(", "),
                                inline: true,
                            });
                        }

                        if (cmd.cooldown) {
                            embed.addFields({
                                name: lang.utils.help_9,
                                value: `\`${cmd.cooldown}s\``,
                                inline: true,
                            });
                        }

                        if (cmd.permissions) {
                            embed.addFields({
                                name: lang.utils.help_10,
                                value: lang.utils.help_11
                                    .replace('{value1}', cmd.permissions.bot ? cmd.permissions.bot.map((a) => `\`${a}\``).join(', ') : `${client.e.fail}`)
                                    .replace('{value2}', cmd.permissions.user ? cmd.permissons.user.map((b) => `\`${b}\``).join(', ') : `${client.e.fail}`),
                                inline: true,
                            });
                        }

                        embed.setFooter({ text: lang.utils.help_12 });
                    }

                    return collected.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                }

                collector.on("collect", async (i) => {
                    try {
                        if (i.isButton()) {
                            if (i.user.id !== message.author.id)
                                return i.reply({
                                    content: lang.utils.help_16,
                                    ephemeral: true,
                                });
                            if (i.customId == "back") {
                                if (currentPage !== 0) {
                                    currentPage -= 1;
                                } else {
                                    currentPage = embeds.length - 1;
                                }
                            } else if (i.customId == "home") {
                                currentPage = 0;
                            } else if (i.customId == "next") {
                                if (currentPage < embeds.length - 1) {
                                    currentPage++;
                                } else {
                                    currentPage = 0;
                                }
                            } else if (i.customId == "search") {
                                await handleSearch(i);
                            }
                            await i
                                .update({
                                    embeds: [embeds[currentPage]],
                                    components: allComponent,
                                })
                                .catch(() => { });
                        } else if (i.isStringSelectMenu()) {
                            let index = 0;
                            let sembeds = [];
                            let getembed = [...getEmbed()];
                            for (const value of i.values) {
                                switch (value.toLowerCase()) {
                                    case "action":
                                        index = 0;
                                        break;
                                    case "animal":
                                        index = 1;
                                        break;
                                    case "casino":
                                        index = 2;
                                        break;
                                    case "config":
                                        index = 3;
                                        break;
                                    case "economy":
                                        index = 4;
                                        break;
                                    case "emote":
                                        index = 5;
                                        break;
                                    case "farm":
                                        index = 6;
                                        break;
                                    case "gambling":
                                        index = 7;
                                        break;
                                    case "giveaway":
                                        index = 8;
                                        break;
                                    case "inventory":
                                        index = 9;
                                        break;
                                    case "marry":
                                        index = 10;
                                        break;
                                    case "music":
                                        index = 11
                                        break;
                                    case "passport":
                                        index = 12;
                                        break;
                                    case "utils":
                                        index = 13;
                                        break;
                                }
                                sembeds.push(getembed[index]);
                            }
                            i.reply({
                                embeds: sembeds,
                                ephemeral: true,
                                allowedMentions: { repliedUser: false },
                            });
                        }
                    } catch (e) {
                        client.logger.error(e.stack);
                    }
                });

                collector.on("end", async () => {
                    let disableRow = new ActionRowBuilder().addComponents([
                        back.setDisabled(true),
                        home.setDisabled(true),
                        next.setDisabled(true),
                    ]);
                    if (!editor) {
                        editor = true;
                        msg.edit({
                            embeds: [main_embed],
                            components: [disableRow],
                        });
                    }
                });
            }

            function getEmbed(editor = false) {
                var embeds = [];

                var embed0 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Action [ ${client.commands.filter((cmd) => cmd.category === "Action").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Action").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed0);

                var embed1 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Animal [ ${client.commands.filter((cmd) => cmd.category === "Animal").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Animal").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed1);

                var embed2 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Casino [ ${client.commands.filter((cmd) => cmd.category === "Casino").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Casino").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed2);

                var embed3 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Config [ ${client.commands.filter((cmd) => cmd.category === "Config").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Config").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed3);

                var embed4 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Economy [ ${client.commands.filter((cmd) => cmd.category === "Economy").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Economy").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed4);


                var embed5 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Emote [ ${client.commands.filter((cmd) => cmd.category === "Emote").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Emote").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed5);


                var embed6 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Farm [ ${client.commands.filter((cmd) => cmd.category === "Farm").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Farm").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed6);

                var embed7 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Gambling [ ${client.commands.filter((cmd) => cmd.category === "Gambling").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({})
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Gambling").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed7);

                var embed8 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Giveaway [ ${client.commands.filter((cmd) => cmd.category === "Giveaway").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Giveaway").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed8);

                var embed9 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Inventory [ ${client.commands.filter((cmd) => cmd.category === "Inventory").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Inventory").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed9);

                var embed10 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Marry [ ${client.commands.filter((cmd) => cmd.category === "Marry").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Marry").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed10);

                var embed11 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Music [ ${client.commands.filter((cmd) => cmd.category === "Music").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Music").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed11);

                var embed12 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Passport [ ${client.commands.filter((cmd) => cmd.category === "Passport").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Passport").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed12);

                var embed13 = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({
                        name: `Utils [ ${client.commands.filter((cmd) => cmd.category === "Utils").size} commands ]`,
                        iconURL: client.user.displayAvatarURL({}),
                    })
                    .setDescription(`${client.commands.filter(cmd => cmd.category === "Utils").map(a => `**\`${a.name.charAt(0).toUpperCase() + a.name.slice(1)}\`** : ${a.description.content}`).join('\n')}`);
                embeds.push(embed13);

                return embeds.map((embed, index) => {
                    return embed.setFooter({
                        text: `Trang ${index + 1}/${embeds.length}`,
                        iconURL: client.user.displayAvatarURL({}),
                    });
                });
            }
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
