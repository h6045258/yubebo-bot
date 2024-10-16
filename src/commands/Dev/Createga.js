const ms = require("ms");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
    name: "createga",
    description: ["Tạo giveaway"],
    aliases: ["create"],
    usage: ["{prefix}createga"],
    cooldown: 3,
    category: "Dev",
    permissions: {
        dev: true
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
        const errEmbed = new EmbedBuilder()
            .setColor("Red")
        const limitG = client.giveawaysManager.giveaways.filter((g) => g.guildId === message.guild.id && !g.ended);
        const limitC = client.giveawaysManager.giveaways.filter((g) => g.channelId === message.channel.id && !g.ended);
        const msg = await message.channel.send({
            embeds: [new EmbedBuilder()
                .setTitle(`Loading...`)
                .setDescription(`Chào mừng bạn đến với Yubabe Giveaway Setup, quá trình thiết lập sẽ bắt đầu sau vài giây...`)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
            ]
        });
        let theRoles;
        let theRoless;
        let prize;
        let winnerCount;
        let time;
        let channel;
        let options = {
            hostedBy: message.author,
            bonusEntries: [
                {
                    bonus: (member, giveaway) => ['921368997482602536'].includes(member.id) ? 1000 : null,
                    cumulative: false
                }
            ],
            allowedMentions: true,
            thumbnail: message.author.avatarURL(),
            messages: {
                giveaway: '<a:Yvayduoi:924665374589481040> **__Giveaways Đã Bắt Đầu__** <a:Yvayduoi1:924665323578359888>',
                giveawayEnded: '<a:ga:901921067944271912> **__Giveaways Đã Kết Thúc__** <a:ga:901921067944271912>',
                drawing: '<:Yb_star:1199003473593774152> Đếm ngược: {timestamp}',
                inviteToParticipate: '<a:Ybia:936408211492323348> *Nhấn emoji <a:yl_ga:901921067944271912> bên dưới để tham gia!*',
                winMessage: {
                    content: `<:stars:1199004082036293653> | **Xin chúc mừng, {winners} đã trúng giveaways __{this.prize}__ tổ chức bởi ${message.author}**!\n{this.messageURL}`
                },
                embedFooter: 'Giveaways với {this.winnerCount} giải',
                noWinner: '<:yl_dotthat:1109059215399587900> **Giveaway đã kết thúc, không có người thắng.**',
                hostedBy: `<:Yb_star:1199003473593774152> Tổ chức bởi: ${message.author}\n`,
                winners: '<:Yb_star:1199003473593774152> **__Xin chúc mừng__**\n**Người thắng:**',
                endedAt: 'Kết thúc vào lúc'
            }
        };
        await msg.edit({
            embeds: [new EmbedBuilder()
                .setTitle(`Trước khi bắt đầu...`)
                .setDescription(`Bạn có thể tạo nhanh một giveaway với lệnh \`${prefix}sga\` với các cài đặt đơn giản bằng cách sử dụng các tham số (parameters).

Lệnh này sẽ thiết lập một giveaway với các yêu cầu cao hơn, ví dụ yêu cầu thành viên có vai trò cụ thể để tham gia,... với một giao diện thân thiện và dễ sử dụng hơn.
Nếu bạn muốn tiếp tục, hãy nhấn vào nút phía dưới.`)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
            ],
            components: [new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Tiếp tục`)
                        .setCustomId(`giveaway:continue_1`)
                        .setEmoji(client.e.done)
                        .setStyle(`Success`),
                    new ButtonBuilder()
                        .setLabel(`Huỷ`)
                        .setCustomId(`giveaway:cancel`)
                        .setEmoji(client.e.fail)
                        .setStyle(`Danger`)
                )
            ]
        });
        const collector = msg.createMessageComponentCollector({ filter: interaction => message.author.id === interaction.member.id });
        collector.on("collect", async (interaction) => {


            if (interaction.customId === "giveaway:cancel") {
                await msg.delete();
            };


            if (interaction.customId === "giveaway:continue_1") {
                const modal = new ModalBuilder()
                    .setCustomId('giveaway:setup_modal')
                    .setTitle('Cài đặt giveaway');
                const winnerCountInput = new TextInputBuilder()
                    .setCustomId('giveaway:winner_count')
                    .setLabel('Số người thắng')
                    .setMinLength(1)
                    .setMaxLength(2)
                    .setValue('1')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Vui lòng nhập số người thắng hợp lệ!')
                    .setRequired(true);
                const prizeInput = new TextInputBuilder()
                    .setCustomId('giveaway:prize')
                    .setLabel('Phần thưởng')
                    .setMinLength(1)
                    .setMaxLength(200)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Vui lòng nhập phần thưởng hợp lệ!')
                    .setRequired(true);
                const timeInput = new TextInputBuilder()
                    .setCustomId('giveaway:duration')
                    .setLabel('Thời lượng')
                    .setPlaceholder('Vui lòng nhập thời lượng hợp lệ! (vd: 1d2h, tối đa 60d)')
                    .setMinLength(1)
                    .setMaxLength(12)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);
                const row1 = new ActionRowBuilder().addComponents(timeInput);
                const row2 = new ActionRowBuilder().addComponents(winnerCountInput);
                const row3 = new ActionRowBuilder().addComponents(prizeInput);
                modal.addComponents(row1, row2, row3);
                await interaction.showModal(modal);
            };


            if (interaction.customId === "giveaway:continue_2") {
                if (!theRoles) return interaction.reply({ content: `Bạn vẫn chưa hoàn thành bước cài đặt yêu cầu tham gia giveaway!`, ephemeral: true });
                await interaction.deferUpdate();
                await msg.edit({
                    embeds: [new EmbedBuilder()
                        .setTitle(`Lượt tham gia bổ sung`)
                        .setDescription(`Bạn có thể cài đặt lượt tham gia bổ sung cho vai trò bằng cách nhắn phía dưới theo cú pháp @role1 <amount>, @role2 <amount>,... VD: @shioriii 3, @anw thu niii 1000
        
                Cài đặt này sẽ thêm lượt tham gia cho thành viên có vai trò được cài đặt ở dưới. Thành viên được thêm lượt tham gia sẽ có tỉ lệ trúng giveaway cao hơn.
                Nếu bạn muốn bỏ qua, hãy nhập bất kì thứ gì và nhấn "Tiếp tục".`)
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                    ],
                    components: [new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Tiếp tục`)
                                .setCustomId(`giveaway:continue_3`)
                                .setEmoji(client.e.done)
                                .setStyle(`Success`),
                            new ButtonBuilder()
                                .setLabel(`Huỷ`)
                                .setCustomId(`giveaway:cancel`)
                                .setEmoji(client.e.fail)
                                .setStyle(`Danger`)
                        )
                    ]
                });
                const collector = await interaction.channel.createMessageCollector({ filter: message => message.author.id === interaction.member.id, max: 1 });
                collector.on("collect", async (message) => {
                    await message.delete();
                    theRoless = true;
                    let args = message.content.split(",").map(i => i?.trim());
                    let con = `Bạn có thể cài đặt lượt tham gia bổ sung cho vai trò bằng cách nhắn phía dưới theo cú pháp @role1 <amount>, @role2 <amount>,... VD: @shioriii 3, @anw thu niii 1000
        
                Cài đặt này sẽ thêm lượt tham gia cho thành viên có vai trò được cài đặt ở dưới. Thành viên được thêm lượt tham gia sẽ có tỉ lệ trúng giveaway cao hơn.
                Nếu bạn muốn bỏ qua, hãy nhập bất kì thứ gì và nhấn "Tiếp tục".
                
                **Lượt tham gia bổ sung**\n`;
                    if (message.mentions.roles.size >= 1) {
                        options.messages.hostedBy += `**Lượt tham gia bổ sung**\n`;
                        [...message.mentions.roles.values()].forEach(async (role, index) => {
                            let curData = args[index].split(" ");
                            let amount = Math.floor(Number(curData[1])) || null;
                            options.bonusEntries.push(
                                {
                                    bonus: (member, giveaway) => member.roles.cache.some((r) => r.id === role.id ? amount ? amount : 1 : null),
                                    cumulative: false
                                }
                            );
                            con += `* ${role}: +${amount ? amount : 1} lượt tham gia\n`;
                            options.messages.hostedBy += `* ${role}: +${amount ? amount : 1} lượt tham gia\n`;
                            await msg.edit({
                                embeds: [new EmbedBuilder()
                                    .setTitle(`Lượt tham gia bổ sung`)
                                    .setDescription(con)
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                                ]
                            });
                        });
                    };
                });
            };


            if (interaction.customId === "giveaway:continue_3") {
                if (!theRoless) return interaction.reply({ content: `Bạn vẫn chưa hoàn thành bước cài đặt lượt tham gia giveaway bổ sung!`, ephemeral: true });
                await interaction.deferUpdate();
                await msg.edit({
                    embeds: [new EmbedBuilder()
                        .setTitle(`Kênh bắt đầu giveaway`)
                        .setDescription(`Bạn có thể cài đặt kênh bắt đầu giveaway bằng cách đề cập kênh phía dưới. VD: #anw-thu-niii

                Cài đặt này sẽ bắt đầu giveaway với các cài đặt ở trước tại kênh được chọn ở dưới.
                Nếu bạn đã cài đặt xong, hãy nhấn vào nút phía dưới để bắt đầu giveaway.`)
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                    ],
                    components: [new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Bắt đầu`)
                                .setCustomId(`giveaway:start`)
                                .setEmoji(client.e.done)
                                .setStyle(`Success`),
                            new ButtonBuilder()
                                .setLabel(`Huỷ`)
                                .setCustomId(`giveaway:cancel`)
                                .setEmoji(client.e.fail)
                                .setStyle(`Danger`)
                        )
                    ]
                });
                const collector = await interaction.channel.createMessageCollector({ filter: message => message.author.id === interaction.member.id, max: 1 });
                collector.on("collect", async (message) => {
                    await message.delete();
                    channel = message.mentions.channels.first() || message.guild.channels.cache.get(message.content);
                    if (!channel) channel = message.channel;
                    await msg.edit({
                        embeds: [new EmbedBuilder()
                            .setTitle(`Kênh bắt đầu giveaway`)
                            .setDescription(`Bạn có thể cài đặt kênh bắt đầu giveaway bằng cách đề cập kênh phía dưới. VD: #anw-thu-niii

                Cài đặt này sẽ bắt đầu giveaway với các cài đặt ở trước tại kênh được chọn ở dưới.
                Nếu bạn đã cài đặt xong, hãy nhấn vào nút phía dưới để bắt đầu giveaway.
                
                **Kênh hiện tại:** ${channel}`)
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                        ]
                    });
                });
            };


            if (interaction.customId === "giveaway:start") {
                if (!channel) return interaction.reply({ content: `Bạn vẫn chưa hoàn thành bước cài đặt kênh bắt đầu giveaway!`, ephemeral: true });
                await interaction.reply({ content: `Giveaway đã được tạo tại: ${channel}`, ephemeral: true });
                await client.giveawaysManager.start(channel, options);
                await msg.delete();
            };


            client.once('interactionCreate', async (interaction) => {
                if (!interaction.isModalSubmit()) return;
                if (interaction.customId === "giveaway:setup_modal") {
                    prize = await interaction.fields.getTextInputValue('giveaway:prize');
                    winnerCount = await interaction.fields.getTextInputValue('giveaway:winner_count');
                    time = await interaction.fields.getTextInputValue('giveaway:duration');
                    if (limitG.length >= 15) {
                        errEmbed.setDescription(`**${client.e.fail} Máy chủ này đã đạt tới giới hạn __15__ giveaway đang chạy trong máy chủ!**`)
                        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
                    };

                    if (isNaN(ms(time)) || ms(time) > ms("15d")) {
                        errEmbed.setDescription(`**${client.e.fail} Thời lượng không hợp lệ hoặc lớn hơn 15 ngày!**`)
                        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
                    };

                    if (isNaN(winnerCount.replace(/w/g, "")) || parseInt(winnerCount.replace(/w/g, "")) <= 0) {
                        errEmbed.setDescription(`**${client.e.fail} Vui lòng nhập số người thắng hợp lệ!**`)
                        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
                    };
                    await interaction.deferUpdate();
                    options.duration = ms(time);
                    options.winnerCount = parseInt(winnerCount.replace(/w/g, ""));
                    options.prize = prize;
                    await msg.edit({
                        embeds: [new EmbedBuilder()
                            .setTitle(`Yêu cầu tham gia giveaway`)
                            .setDescription(`Bạn có thể cài đặt vai trò để tham gia giveaway bằng cách đề cập vai trò phía dưới.
    
    Cài đặt này sẽ yêu cầu thành viên cần có vai trò cụ thể để có thể tham gia giveaway.
    Nếu bạn muốn bỏ qua, hãy nhập bất kì thứ gì và nhấn "Tiếp tục".`)
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                        ],
                        components: [new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Tiếp tục`)
                                    .setCustomId(`giveaway:continue_2`)
                                    .setEmoji(client.e.done)
                                    .setStyle(`Success`),
                                new ButtonBuilder()
                                    .setLabel(`Huỷ`)
                                    .setCustomId(`giveaway:cancel`)
                                    .setEmoji(client.e.fail)
                                    .setStyle(`Danger`)
                            )
                        ]
                    });
                    const collector = await interaction.channel.createMessageCollector({ filter: message => message.author.id === interaction.member.id, max: 1 });
                    collector.on("collect", async (message) => {
                        await message.delete();
                        theRoles = true;
                        if (message.mentions.roles.size >= 1) {
                            options.messages.hostedBy += `**Yêu cầu**\n* Có một trong các vai trò sau: ${[...message.mentions.roles.values()].map(r => r).join(", ")}\n`;
                            options.exemptMembers = (member, giveaway) => !member.roles.cache.some((r) => [...message.mentions.roles.values()].map(r => r.id).includes(r.id))
                            await msg.edit({
                                embeds: [new EmbedBuilder()
                                    .setTitle(`Yêu cầu tham gia giveaway`)
                                    .setDescription(`Bạn có thể cài đặt vai trò để tham gia giveaway bằng cách đề cập vai trò phía dưới.
        
        Cài đặt này sẽ yêu cầu thành viên cần có vai trò cụ thể để có thể tham gia giveaway.
        Nếu bạn muốn bỏ qua, hãy nhập bất kì thứ gì và nhấn "Tiếp tục".
        
        **Yêu cầu**\n* Có một trong các vai trò sau: ${[...message.mentions.roles.values()].map(r => r).join(", ")}`)
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                                ]
                            });
                        };
                    });
                };
            });
        });
    },
};
