const {
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits,
} = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
const { cropImage } = require("cropify");
const sharp = require("sharp");
const fetch = require("node-fetch");

registerFont("./assets/fonts/YubabePlusSans-Bold.ttf", { family: "bold" });
registerFont("./assets/fonts/YubabePlusSans-ExtraBold.ttf", { family: "extrabold" });
registerFont("./assets/fonts/YubabePlusSans-ExtraLight.ttf", { family: "extralight" });
registerFont("./assets/fonts/YubabePlusSans-Light.ttf", { family: "light" });
registerFont("./assets/fonts/YubabePlusSans-Medium.ttf", { family: "medium" });
registerFont("./assets/fonts/YubabePlusSans-Regular.ttf", { family: "regular" });
registerFont("./assets/fonts/YubabePlusSans-SemiBold.ttf", { family: "semibold" });

module.exports = {
    event: "trackStart",
    run: async (client, player, track, dispatcher) => {
        const duration = (ms) => {
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            const seconds = Math.round((ms % 60000) / 1000);
            let result = hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
            result += `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            return result;
        };

        const musicCard = async (track, dispatcher, guild_name) => {
            const canvasWidth = 2458; //2458
            const canvasHeight = 1440; //1440
            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext("2d");
            let artworkUri = "";
            let icon = "";
            if (track.info.sourceName.includes("spotify")) {
                artworkUri = track.info.artworkUrl;
                icon =
                    "https://cdn.discordapp.com/emojis/1142315148455972925.png";
            } else if (track.info.sourceName.includes("youtube")) {
                const img = `https://img.youtube.com/vi/${track.info.identifier}/maxresdefault.jpg`;
                icon =
                    "https://cdn.discordapp.com/emojis/1023119562830520363.png";
                const respone = await fetch(img);
                const image = await respone.arrayBuffer();
                const convert = await sharp(image)
                    .resize(1000, 1000)
                    .png()
                    .toBuffer();
                const baseimg = convert.toString("base64");
                artworkUri = `data:image/png;base64,${baseimg}`;
            } else if (track.info.sourceName.includes("soundcloud")) {
                artworkUri = track.info.artworkUrl;
                icon = `https://cdn.discordapp.com/emojis/1023118307500503060.png`;
            } else if (track.info.sourceName.includes("applemusic")) {
                artworkUri = track.info.artworkUrl;
                icon =
                    "https://cdn.discordapp.com/emojis/1142316859950116924.png";
            } else if (track.info.sourceName.includes("deezer")) {
                artworkUri = track.info.artworkUrl;
                icon = "https://cdn.discordapp.com/attachments/1223864512147624039/1282402793482620928/emoji.png"
            }

            let thumbnail;
            thumbnail = await loadImage(
                await cropImage({
                    imagePath: artworkUri,
                    borderRadius: 50,
                    width: 837,
                    height: 837,
                    cropCenter: true,
                }),
            );

            let dynamic;
            dynamic = await loadImage(
                await cropImage({
                    imagePath: track.info.requester.displayAvatarURL({
                        extension: "png",
                    }),
                    borderRadius: 210,
                    width: 400,
                    height: 400,
                    cropCenter: true,
                }),
            );

            await cropImage({
                imagePath: artworkUri,
                x: 0,
                y: -845,
                width: 1568,
                height: 512,
                borderRadius: 50,
            }).then(async (x) => {
                ctx.globalAlpha = 0.4;
                ctx.drawImage(await loadImage(x), 0, 565);
                ctx.globalAlpha = 1.0;
            });

            await cropImage({
                imagePath: artworkUri,
                x: 0,
                y: -1480,
                width: 1568,
                height: 272,
                borderRadius: 50,
            }).then(async (x) => {
                ctx.globalAlpha = 0.4;
                ctx.drawImage(await loadImage(x), 0, 1135);
                ctx.globalAlpha = 1.0;
            });

            progressBar(ctx, {
                progress: 20,
                progressBarColor: "#b6b5b5",
                progressColor: "#E87E97",
                backgroundColor: "#ffffff",
            });

            ctx.drawImage(thumbnail, 1621, 565);
            ctx.fillStyle = "#070707";
            roundedRect(ctx, 0, 0, 2458, 520, 270);
            ctx.drawImage(dynamic, 100, 60);
            //
            ctx.beginPath();
            ctx.arc(1740, 260, 155, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.lineWidth = 35;
            ctx.strokeStyle = "#b6b5b5";
            ctx.stroke();

            const angle_queue = (dispatcher.queue.length / 500) * Math.PI * 2;

            ctx.beginPath();
            ctx.arc(
                1740,
                260,
                155,
                -Math.PI / 2,
                -Math.PI / 2 + angle_queue,
                false,
            );
            ctx.lineWidth = 35;
            ctx.strokeStyle = "#E87E97";
            ctx.stroke();

            //
            ctx.beginPath();
            ctx.arc(2100, 260, 155, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.lineWidth = 35;
            ctx.strokeStyle = "#b6b5b5";
            ctx.stroke();

            const angle_volume = (dispatcher.volume / 150) * Math.PI * 2;

            ctx.beginPath();
            ctx.arc(
                2100,
                260,
                155,
                -Math.PI / 2,
                -Math.PI / 2 + angle_volume,
                false,
            );
            ctx.lineWidth = 35;
            ctx.strokeStyle = "#E87E97";
            ctx.stroke();

            let name = track.info.title;
            if (name.length > 18) {
                name = name.substring(0, 18) + "...";
            }
            let author = track.info.author;
            if (author.length > 18) {
                author = author.substring(0, 18) + "...";
            }
            if (guild_name.length > 18) {
                guild_name = guild_name.substring(0, 12) + "...";
            }
            let requester = track.info.requester.displayName;
            if (requester.length > 16) {
                requester = requester.substring(0, 10) + "...";
            }

            ctx.fillStyle = "#E87E97";
            ctx.font = "124px extrabold";
            ctx.fillText(`${track.info.requester.displayName}`, 540, 260);
            ctx.fillText(`${name}`, 113, 795);

            ctx.fillStyle = "#E87E97";
            ctx.font = "87px regular";
            ctx.fillText(`${guild_name.substring(0, 18) + "..."}`, 540, 380);
            ctx.fillText(`${author.substring(0, 10) + "..."}`, 113, 935);

            ctx.fillStyle = "#E87E97";
            ctx.font = "50px semibold";
            ctx.fillText("00:00", 113, 1343);

            ctx.fillStyle = "#E87E97";
            ctx.font = "50px semibold";
            ctx.fillText(`${duration(track.info.length)}`, 1300, 1343);

            ctx.fillStyle = "#E87E97";
            ctx.font = "124px extrabold";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${dispatcher.queue.length}`, 1740, 260);
            ctx.fillText(`${dispatcher.volume}`, 2100, 260);

            const attachment = new AttachmentBuilder(canvas.toBuffer(), {
                name: "now-playing.png",
            });
            return attachment;
        };

        const guild = client.guilds.cache.get(player.guildId);
        if (!guild) return;
        const channel = guild.channels.cache.get(dispatcher.channelId);
        if (!channel) return;

        let platform = "", platform2 = "";
        if (track.info.sourceName.includes("spotify")) {
            platform = "<:bot_spotify:1142315148455972925>";
            platform2 = "Spotify";
        } else if (track.info.sourceName.includes("youtu")) {
            platform = "<:be_youtubemusic:1023119562830520363>";
            platform2 = "Youtube Music"
        } else if (track.info.sourceName.includes("soundcloud")) {
            platform = "<:be_soundcloud:1023118307500503060>";
            platform2 = "Soundcloud";
        } else if (track.info.sourceName.includes("applemusic")) {
            platform = "<:bot_applemusic:1142316859950116924>";
            platform2 = "Apple Music";
        } else if (track.info.sourceName.includes("deezer")) {
            platform = "<:bot_deezer:1142318551978475580>";
            platform2 = "Deezer"
        }

        function buttonBuilder() {
            const previousButton = new ButtonBuilder()
                .setCustomId("previous")
                .setEmoji("<:be_rprevious:1037550352150568980>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(dispatcher.previous ? false : true);
            const resumeButton = new ButtonBuilder()
                .setCustomId("resume")
                .setEmoji(player.paused ? "<:be_rresume:1033583067828338688>" : "<:be_rpause:1033582932884983899>")
                .setStyle(player.paused ? ButtonStyle.Success : ButtonStyle.Secondary);
            const stopButton = new ButtonBuilder()
                .setCustomId("stop")
                .setEmoji("<:be_rstop:1033581774082682931>")
                .setStyle(ButtonStyle.Secondary);
            const skipButton = new ButtonBuilder()
                .setCustomId("skip")
                .setEmoji("<:be_rskip:1033583199202332832>")
                .setStyle(ButtonStyle.Secondary);
            const loopButton = new ButtonBuilder()
                .setCustomId("loop")
                .setEmoji(dispatcher.loop === "repeat" ? "<:be_rrepeat:1033584188739289138>" : "<:be_rqueuerepeat:1033584071877591161>")
                .setStyle(
                    dispatcher.loop !== "off"
                        ? ButtonStyle.Success
                        : ButtonStyle.Secondary
                );
            return new ActionRowBuilder().addComponents(
                stopButton,
                previousButton,
                resumeButton,
                skipButton,
                loopButton
            );
        }

        function buttonBuilder2() {
            const volumeButton = new ButtonBuilder()
                .setCustomId('volume')
                .setEmoji("<:be_rvolumeup:1037551775147888680>")
                .setStyle(ButtonStyle.Secondary)
            const queueButton = new ButtonBuilder()
                .setCustomId('queuelist')
                .setEmoji("<:be_rqueuelist:1037553667521396778>")
                .setStyle(ButtonStyle.Secondary)
            const replayButton = new ButtonBuilder()
                .setCustomId('replay')
                .setEmoji("<:be_rreplay:1037554128139866154>")
                .setStyle(ButtonStyle.Secondary)
            const sourceButton = new ButtonBuilder()
                .setCustomId('trackinfo')
                .setEmoji(`${platform}`)
                .setStyle(ButtonStyle.Secondary)
            const playlistButton = new ButtonBuilder()
                .setCustomId('playlist')
                .setEmoji("<:be_rfavorite:1033582839540744192>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);
            return new ActionRowBuilder().addComponents(
                volumeButton,
                queueButton,
                replayButton,
                sourceButton,
                playlistButton
            );
        }

        const attachment = await musicCard(track, dispatcher, guild.name);

        const embed = client
            .embed()
            .setColor(client.color.y)
            .setImage('attachment://now-playing.png')
        const message = await channel.send({
            embeds: [embed],
            files: [attachment],
            components: [buttonBuilder(), buttonBuilder2()]
        });
        dispatcher.nowPlayingMessage = message;
        const collector = message.createMessageComponentCollector({
            filter: async (b) => {
                if (
                    b.guild.members.me.voice.channel &&
                    b.guild.members.me.voice.channelId === b.member.voice.channelId
                )
                    return true;
                else {
                    b.reply({
                        content: `<:be_rjoin:1037551467940302918> | Bạn không kết nối vào kênh <#${b.guild.members.me.voice?.channelId ?? "Không tồn tại"
                            }> để sử dụng các phím điều khiển!`,
                        ephemeral: true,
                    });
                    return false;
                }
            }
        });

        collector.on('collect', async (i) => {
            switch (i.customId) {
                case 'previous':
                    if (!dispatcher.previous) {
                        await i.reply({
                            content: `${client.e.fail} | Không có bài nhạc trước để tua`,
                            ephemeral: true,
                        });
                        return;
                    } else dispatcher.previousTrack();
                    if (message)
                        await message.edit({
                            embeds: [
                                embed.setFooter({
                                    text: `Tua lại bởi ${i.user.displayName}`,
                                    iconURL: i.user.avatarURL({}),
                                }),
                            ],
                            components: [buttonBuilder(), buttonBuilder2()],
                        });
                    await i.deferUpdate();
                    break;
                case 'resume':
                    dispatcher.pause();
                    if (message)
                        await message.edit({
                            embeds: [
                                embed.setFooter({
                                    text: `${player.paused ? "Tạm dừng" : "Tiếp tục"} phát bởi ${i.user.displayName
                                        }`,
                                    iconURL: i.user.avatarURL({}),
                                }),
                            ],
                            components: [buttonBuilder(), buttonBuilder2()],
                        });
                    await i.deferUpdate();
                    break;
                case "stop":
                    dispatcher.stop();
                    if (message)
                        await message.edit({
                            embeds: [
                                embed.setFooter({
                                    text: `Dừng phát nhạc bởi ${i.user.displayName}`,
                                    iconURL: i.user.avatarURL({}),
                                }),
                            ],
                            components: [],
                        });
                    await i.deferUpdate();
                    break;
                case "skip":
                    if (!dispatcher.queue.length) {
                        await i.reply({
                            content: `${client.e.fail} | Không còn bài nào trong danh sách để phát cả, hãy thêm nhạc và sử dụng lại!`,
                            ephemeral: true,
                        });
                        return;
                    }
                    dispatcher.skip();
                    if (message)
                        await message.edit({
                            embeds: [
                                embed.setFooter({
                                    text: `Tua đi bởi ${i.user.displayName}`,
                                    iconURL: i.user.avatarURL({}),
                                }),
                            ],
                            components: [],
                        });
                    await i.deferUpdate();
                    break;
                case "loop":
                    switch (dispatcher.loop) {
                        case "off":
                            dispatcher.loop = "repeat";
                            await message.edit({
                                embeds: [
                                    embed.setFooter({
                                        text: `Chế độ lặp được chỉnh bởi ${i.user.displayName}`,
                                        iconURL: i.user.avatarURL({}),
                                    }),
                                ],
                                components: [buttonBuilder(), buttonBuilder2()],
                            });
                            await i.deferUpdate();
                            break;
                        case "repeat":
                            dispatcher.loop = "queue";
                            if (message)
                                await message.edit({
                                    embeds: [
                                        embed.setFooter({
                                            text: `Lặp danh sách được chỉnh bởi ${i.user.displayName}`,
                                            iconURL: i.user.avatarURL({}),
                                        }),
                                    ],
                                    components: [buttonBuilder(), buttonBuilder2()],
                                });
                            await i.deferUpdate();
                            break;
                        case "queue":
                            dispatcher.loop = "off";
                            if (message)
                                await message.edit({
                                    embeds: [
                                        embed.setFooter({
                                            text: `Tắt chế độ lặp bởi ${i.user.displayName}`,
                                            iconURL: i.user.avatarURL({}),
                                        }),
                                    ],
                                    components: [buttonBuilder(), buttonBuilder2()],
                                });
                            await i.deferUpdate();
                            break;
                    }
                case 'volume': {
                    const volumeInput = new TextInputBuilder()
                        .setCustomId('volumeInput')
                        .setLabel('Nhập âm lượng mới (1-150%)')
                        .setStyle(TextInputStyle.Short)
                        .setMinLength(1)
                        .setMaxLength(3)
                        .setValue(`${dispatcher.volume}`)
                        .setRequired(true);
                    const volumeModal = new ModalBuilder()
                        .setCustomId('volumeModal')
                        .setTitle('Chỉnh sửa âm lượng')
                        .addComponents(
                            new ActionRowBuilder().addComponents(volumeInput)
                        );
                    await i.showModal(volumeModal);
                    try {
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: i => i.user.id === i.user.id,
                        });
                        const newVolume = parseInt(collected.fields.getTextInputValue('volumeInput'), 10);
                        if (isNaN(newVolume) || newVolume < 1 || newVolume > 150) {
                            await collected.reply({ content: '<:be_rvolumeup:1037551775147888680> | Mức âm lượng để đặt tối thiểu phải từ 1 ~ 150%', ephemeral: true });
                            return;
                        }
                        dispatcher.player.setGlobalVolume(newVolume);

                        if (message) {
                            await message.edit({
                                embeds: [
                                    embed.setFooter({
                                        text: `Chỉnh âm lượng ${newVolume} bởi ${i.user.displayName}`,
                                        iconURL: i.user.avatarURL({}),
                                    }),
                                ],
                                components: [buttonBuilder(), buttonBuilder2()],
                            });
                        }
                        await collected.deferUpdate();
                    } catch (error) {
                        console.error(error);
                    }
                    break;
                }
                case 'queuelist': {
                    const embed = client.embed()
                        .setColor(client.color.y)
                        .setAuthor({ name: `Danh Sách Phát`, iconURL: client.user.displayAvatarURL({}) })
                        .setDescription(`${formatQueue(dispatcher, track.info.length, 0)}`)
                        .setFooter({ text: `${dispatcher.queue.length} bài`, iconURL: i.user.displayAvatarURL({}) })
                    await i.reply({ embeds: [embed], ephemeral: true })
                    break;
                }
                case 'trackinfo': {
                    const embed = client.embed()
                        .setColor(client.color.y)
                        .setAuthor({ name: "Thông Tin Player", iconURL: i.user.displayAvatarURL({}) })
                        .setThumbnail(track.info.artworkUrl)
                        .addFields([
                            { name: "Đang Phát", value: `[${track.info.title}](<${track.info.uri}>)`, inline: true },
                            { name: "Nghệ Sĩ", value: track.info.author, inline: true },
                            { name: "Thời Gian", value: duration(track.info.length), inline: true },
                            { name: "Người Nghe", value: track.info.requester.displayName, inline: true },
                            { name: "Âm Lượng", value: `${dispatcher.volume}%`, inline: true },
                            { name: "Chế Độ Lặp", value: dispatcher.loop === "repeat" ? "1 Bài" : dispatcher.loop === "queue" ? "Danh Sách" : "Tắt", inline: true },
                        ])
                    await i.reply({ embeds: [embed], ephemeral: true })
                    break;
                };
                case 'replay': {
                    dispatcher.seek(0);
                    if (message) {
                        await message.edit({
                            embeds: [
                                embed.setFooter({
                                    text: `Thao tác lặp lại bởi ${i.user.displayName}`,
                                    iconURL: i.user.displayAvatarURL({}),
                                }),
                            ],
                            components: [buttonBuilder(), buttonBuilder2()],
                        });
                    }
                    break;
                }
            }
        });
    },
};

function formatQueue(dispatcher, durationLeft, pageIndex) {
    const trackPage = 20;
    let queueString = `**Đang Phát**\n [${dispatcher.current.info.title.substring(0, 25)}](${dispatcher.current.info.uri}) - Thời Gian: ${dispatcher.current.info.isStream ? 'LIVE' : timestamp(dispatcher.current.info.length)} - ${dispatcher.current?.info.requester}\n\n`;
    let totalDuration = durationLeft;
    let platform = "";
    const start = pageIndex * trackPage;
    const end = start + trackPage;
    const paginatedItems = dispatcher.queue.slice(start, end);
    paginatedItems.forEach((track, index) => {
        if (track.info.sourceName.includes("spotify")) {
            platform = "<:bot_spotify:1142315148455972925>";
        } else if (track.info.sourceName.includes("youtu")) {
            platform = "<:be_youtubemusic:1023119562830520363>";
        } else if (track.info.sourceName.includes("soundcloud")) {
            platform = "<:be_soundcloud:1023118307500503060>";
        } else if (track.info.sourceName.includes("applemusic")) {
            platform = "<:bot_applemusic:1142316859950116924>";
        }
        totalDuration += track.info.length;
        queueString += `${start + index + 1}. ${platform} [${track.info.title}](<${track.info.uri}>) - ${timestamp(totalDuration)} - ${track.info.requester.displayName}\n`;
    });
    if (dispatcher.queue.length === 0) {
        queueString = `**Đang Phát**\n ${platform} [${dispatcher.current.info.title.substring(0, 25)}](${dispatcher.current.info.uri}) - ${dispatcher.current.info.isStream ? 'LIVE' : timestamp(dispatcher.current.info.length)} - ${dispatcher.current?.info.requester}\n\n`;
    }
    return queueString;
}

function timestamp(ms) {
    const startSeconds = Math.floor(Date.now() / 1000) + Math.floor(ms / 1000);
    return `<t:${startSeconds}:R>`;
};

function roundRect(ctx, x, y, width, height, radius, fill = true, onlyBorders = false) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    if (!onlyBorders) {
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    };
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    };
};

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
};

function progressBar(ctx, option) {
    const canvasWidth = 1342;
    const complete = (canvasWidth * option.progress) / 100;
    const radius = 20;
    ctx.fillStyle = option.progressBarColor;
    roundRect(ctx, 113, 1215, canvasWidth, 57, radius);
    ctx.fillStyle = option.progressColor;
    roundRect(ctx, 113, 1215, complete, 57, radius, true, complete < radius);
    if (complete > 0) {
        const circleX = 113 + complete;
        const circleY = 1215 + 57 / 2;
        ctx.beginPath();
        ctx.arc(circleX, circleY, 34.7211 / 2, 0, 2 * Math.PI);
        ctx.fillStyle = option.progressColor;
        ctx.fill();
        ctx.strokeStyle = option.backgroundColor;
        ctx.lineWidth = 8;
        ctx.stroke();
    };
}
function roundRect(ctx, x, y, width, height, radius, fill = true, single = false) {
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    if (!single) {
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    } else {
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    }
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
}
