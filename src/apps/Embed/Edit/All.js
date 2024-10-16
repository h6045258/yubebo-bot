const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Embed = require('../../../models/embedSchema');

module.exports = {
    name: 'all',
    description: 'Edit tất cả thông tin của 1 embed',
    cooldown: 3,
    permission: {
        bot: ['ManageGuild', 'AddReactions', 'EmbedLinks', 'SendMessages', 'ManageMessages', 'UseExternalEmojis'],
        user: ['ManageGuild']
    },
    options: [
        {
            name: 'embed',
            description: 'Chọn embed muốn chỉnh',
            type: 'String',
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction, user, prefix, message, lang) => {
        try {
            await interaction.deferReply({ ephemeral: false, fetchReply: true });
            const { options, guild, channel } = interaction;
            const name = options.getString('embed');

            let embed = await Embed.findOne({ guildId: interaction.guild.id, name: name });
            if (!embed) {
                return interaction.editReply({
                    content: `${client.e.fail} | Không tìm thấy embed nào có tên là \`${name}\`!`
                });
            }

            const variable = async (variable, interaction) => {
                if (!variable) return null;
                try {
                    const result = await client.variable(variable, interaction);
                    if (!result && !variable.includes('{ignore_errors}')) {
                        return null;
                    }
                    return result;
                } catch (error) {
                    if (variable.includes('{ignore_errors}')) {
                        return variable;
                    }
                    throw error;
                }
            };

            const isValidUrlOrVariable = (input) => {
                const allowedVariables = ["{user_avatar}", "{server_icon}"];
                if (allowedVariables.includes(input)) return true;
                const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
                const validImageExtensions = /\.(jpg|jpeg|png|gif)/i;
                return urlPattern.test(input) && validImageExtensions.test(input);
            };

            const getEmbedInterface = async () => {
                return client
                    .embed()
                    .setColor(embed.embed.color ? embed.embed.color : client.color.y)
                    .setAuthor({
                        name: await variable(embed.embed.author ? embed.embed.author.text : null, interaction),
                        iconURL: await variable(embed.embed.author ? embed.embed.author.icon : null, interaction)
                    })
                    .setTitle(await variable(embed.embed ? embed.embed.title : null, interaction))
                    .setDescription(await variable(embed.embed?.description ?? '\u200b', interaction))
                    .setFooter({
                        text: await variable(embed.embed.footer ? embed.embed.footer.text : null, interaction),
                        iconURL: await variable(embed.embed.footer ? embed.embed.footer.icon : null, interaction)
                    })
                    .setThumbnail(await variable(embed.embed ? embed.embed.thumbnail : null, interaction))
                    .setImage(await variable(embed.embed ? embed.embed.image : null, interaction))
                    .setTimestamp(embed.embed.timestamp === true ? new Date() : null);
            }

            const embedInterface = await getEmbedInterface();

            const buttonInterface = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('basic')
                        .setLabel('Color / Title / Description')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('author')
                        .setLabel('Author Text / Icon')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('footer')
                        .setLabel('Footer Text / Icon')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('image')
                        .setLabel('Image / Thumbnail')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('variable')
                        .setLabel('Variable')
                        .setStyle(ButtonStyle.Secondary)
                );

            const msg = await interaction.editReply({
                embeds: [embedInterface],
                components: [buttonInterface]
            });

            const filter = (i) => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });

            collector.on('collect', async (i) => {
                if (!i.isButton) return;
                if (i.user.id !== interaction.user.id) return i.reply({ content: `${client.e.fail} | Các phím điều khiển này không dành cho bạn!`, ephemeral: true });
                if (i.customId === 'basic') {
                    const basicModal = new ModalBuilder()
                        .setCustomId('modal_basic')
                        .setTitle('Basic Embed Setup');
                    const color = new TextInputBuilder()
                        .setCustomId('hex')
                        .setLabel('Embed Color')
                        .setPlaceholder('Mã màu: ví dụ #ffffff / 000000')
                        .setValue(embed.embed.color || '')
                        .setMinLength(6)
                        .setMaxLength(8)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short);
                    const description = new TextInputBuilder()
                        .setCustomId('desc')
                        .setLabel('Embed Description')
                        .setPlaceholder('Nhập nội dung mô tả của embed')
                        .setValue(embed.embed.description || '\u200b')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Paragraph);
                    const title = new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel('Embed Title')
                        .setPlaceholder('Nhập nội dung tiêu đề của embed')
                        .setValue(embed.embed.title || '')
                        .setMaxLength(256)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short);

                    basicModal.addComponents(
                        new ActionRowBuilder().addComponents(color),
                        new ActionRowBuilder().addComponents(description),
                        new ActionRowBuilder().addComponents(title)
                    );

                    await i.showModal(basicModal);
                    const collected = await i.awaitModalSubmit({
                        time: 180e3,
                        filter: m => m.customId === 'modal_basic'
                    });

                    if (collected) {
                        const hex = collected.fields.getTextInputValue('hex');
                        const desc = collected.fields.getTextInputValue('desc') || '\u200b';
                        const tit = collected.fields.getTextInputValue('title');
                        
                        const esHex = hex?.startsWith('#') ? hex : `#${hex}`;
                        const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(esHex);
                        if (hex && isValidColor) {
                            embed.embed.color = esHex;
                            embedInterface.setColor(esHex);
                        } else {
                            embed.embed.color = client.color.y;
                            embedInterface.setColor(client.color.y);
                        }
                       
                        embed.embed.description = desc;
                        embedInterface.setDescription(desc);
                        
                        if (tit) {
                            embed.embed.title = tit;
                            embedInterface.setTitle(tit);
                        } else {
                            embed.embed.title = null;
                        }
                        await embed.save();
                        await collected.update({
                            embeds: [embedInterface],
                            components: [buttonInterface]
                        });
                    }
                } else if (i.customId === 'author') {
                    const authorModal = new ModalBuilder()
                        .setCustomId('modal_author')
                        .setTitle('Author Embed Setup');
                    const text = new TextInputBuilder()
                        .setCustomId('text')
                        .setLabel('Author Text')
                        .setPlaceholder('Nhập nội dung của author')
                        .setValue(embed.embed.author ? embed.embed.author.text || '' : '')
                        .setMaxLength(256)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Paragraph)
                    const icon = new TextInputBuilder()
                        .setCustomId('icon')
                        .setLabel('Author Icon URL')
                        .setPlaceholder('Nhập đường dẫn của icon của author')
                        .setValue(embed.embed.author ? embed.embed.author.icon || '' : '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short);

                    authorModal.addComponents(
                        new ActionRowBuilder().addComponents(text),
                        new ActionRowBuilder().addComponents(icon)
                    );

                    await i.showModal(authorModal);
                    const collected = await i.awaitModalSubmit({ time: 180e3, filter: m => m.user.id === user.id });

                    if (collected) {
                        const authorText = collected.fields.getTextInputValue('text');
                        let authorIcon = collected.fields.getTextInputValue('icon');

                        if (!isValidUrlOrVariable(authorIcon)) authorIcon = null;

                        embed.embed.author.text = authorText;
                        embed.embed.author.icon = authorIcon;

                        embedInterface.setAuthor({
                            name: await variable(authorText, interaction),
                            iconURL: authorIcon ? await variable(authorIcon, interaction) : null
                        });

                        await embed.save();
                        await collected.update({
                            embeds: [embedInterface],
                            components: [buttonInterface]
                        });
                    }
                } else if (i.customId === 'footer') {
                    const footerModal = new ModalBuilder()
                        .setCustomId('modal_footer')
                        .setTitle('Footer Embed Setup');
                    const footerText = new TextInputBuilder()
                        .setCustomId('text')
                        .setLabel('Footer Text')
                        .setPlaceholder('Nhập nội dung footer')
                        .setMaxLength(2048)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Paragraph)
                        .setValue(embed.embed.footer ? embed.embed.footer.text || '' : '');
                    const footerIcon = new TextInputBuilder()
                        .setCustomId('icon')
                        .setLabel('Footer Icon URL')
                        .setPlaceholder('Nhập đường dẫn icon của footer')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                        .setValue(embed.embed.footer ? embed.embed.footer.icon || '' : '');

                    footerModal.addComponents(
                        new ActionRowBuilder().addComponents(footerText),
                        new ActionRowBuilder().addComponents(footerIcon)
                    );

                    await i.showModal(footerModal);
                    const collected = await i.awaitModalSubmit({ time: 180e3, filter: m => m.user.id === user.id });

                    if (collected) {
                        const text = collected.fields.getTextInputValue('text');
                        let icon = collected.fields.getTextInputValue('icon');

                        if (!isValidUrlOrVariable(icon)) icon = null;

                        embed.embed.footer.text = text;
                        embed.embed.footer.icon = icon;

                        embedInterface.setFooter({
                            text: await variable(text, interaction),
                            iconURL: icon ? await variable(icon, interaction) : null
                        });

                        await embed.save();
                        await collected.update({
                            embeds: [embedInterface],
                            components: [buttonInterface]
                        });
                    }
                } else if (i.customId === 'image') {
                    const imageModal = new ModalBuilder()
                        .setCustomId('modal_image')
                        .setTitle('Image Embed Setup');
                    const image = new TextInputBuilder()
                        .setCustomId('image')
                        .setLabel('URL Hình Ảnh')
                        .setPlaceholder('Nhập URL hình ảnh của embed')
                        .setValue(embed.embed.image || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short);
                    const thumbnail = new TextInputBuilder()
                        .setCustomId('thumbnail')
                        .setLabel('URL Thumbnail')
                        .setPlaceholder('Nhập URL thumbnail của embed')
                        .setValue(embed.embed.thumbnail || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short);
                    imageModal.addComponents(
                        new ActionRowBuilder().addComponents(image),
                        new ActionRowBuilder().addComponents(thumbnail)
                    );

                    await i.showModal(imageModal);
                    const collected = await i.awaitModalSubmit({ time: 180e3, filter: m => m.user.id === user.id });

                    if (collected) {
                        let imageURL = collected.fields.getTextInputValue('image');
                        let thumbnailURL = collected.fields.getTextInputValue('thumbnail');

                        if (!isValidUrlOrVariable(imageURL)) imageURL = null;
                        if (!isValidUrlOrVariable(thumbnailURL)) thumbnailURL = null;

                        embed.embed.image = imageURL;
                        embed.embed.thumbnail = thumbnailURL;

                        embedInterface.setImage(await variable(imageURL, interaction));
                        embedInterface.setThumbnail(await variable(thumbnailURL, interaction));

                        await embed.save();
                        await collected.update({
                            embeds: [embedInterface],
                            components: [buttonInterface]
                        });
                    }
                } else if (i.customId === 'variable') {
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
                    const variable1 = client
                        .embed()
                        .setColor(client.color.y)
                        .setAuthor({ name: 'Danh Sách Biến Và Tính Năng', iconURL: client.user.displayAvatarURL({}) })
                        .setDescription(`\n\n` +
                            `** __Chức Năng Người Dùng(User)__ **\n` +
                            `\`{user}\`: e.g <@${client.user.id}>, Hiển thị người dùng\n` +
                            `\`{user_id}\`: e.g ${client.user.id}, ID của người dùng\n` +
                            `\`{user_tag}\`: e.g ${client.user.tag}, Tag của người dùng\n` +
                            `\`{user_name}\`: e.g ${client.user.username}, Tên người dùng\n` +
                            `\`{user_avatar}\`: e.g [Link avatar](<https://cdn.discordapp.com/avatars/429926615242244096/447cc59e54f02b6df64208cc43722a65.png?size=4096>), URL avatar của người dùng\n` +
                            `\`{user_discrim}\`: e.g #${client.user.discriminator}, Mã phân biệt của người dùng\n` +
                            `\`{user_nick}\`: e.g ${client.user.displayName}, Biệt danh của người dùng tại server\n` +
                            `\`{user_joindate}\`: ${new Date(i.member.joinedTimestamp).toLocaleDateString('vi-VN')}, Ngày tham gia server của người dùng\n` +
                            `\`{user_createdate}\`: ${new Date(i.user.createdTimestamp).toLocaleDateString('vi-VN')}, Ngày tạo tài khoản của người dùng\n` +
                            `\`{user_displaycolor}\`: ${i.member.displayHexColor}, Màu nổi bật của người dùng\n` +
                            `\`{user_boostsince}\`: ${new Date(i.member.premiumSince).toLocaleDateString('vi-VN')}, Ngày bắt đầu boost của người dùng\n\n` +

                            `**__Chức Năng Máy Chủ (Server)__**\n` +
                            `\`{server_prefix}\`: e.g \`${prefix}\`, Prefix của bot tại máy chủ\n` +
                            `\`{server_name}\`: e.g ${i.guild.name}, Tên máy chủ\n` +
                            `\`{server_id}\`: e.g ${i.guild.id}, ID của máy chủ\n` +
                            `\`{server_membercount}\`: e.g ${i.guild.memberCount.toLocaleString()}, Số lượng thành viên trong máy chủ\n` +
                            `\`{server_membercount_nobots}\`: e.g ${i.guild.members.cache.filter(member => !member.user.bot).size.toLocaleString()} Số lượng thành viên bỏ qua bot\n` +
                            `\`{server_botcount}\`: e.g ${i.guild.members.cache.filter(member => member.user.bot).size.toString()}, Số lượng bot trong máy chủ\n` +
                            `\`{server_icon}\`: e.g [Icon Server](<${i.guild.iconURL({})}>), URL icon của máy chủ\n` +
                            `\`{server_rolecount}\`: e.g ${i.guild.roles.cache.size.toString()}, Số lượng roles trong máy chủ\n` +
                            `\`{server_channelcount}\`: e.g ${i.guild.channels.cache.size.toString()}, Số lượng kênh trong máy chủ\n` +
                            `\`{server_randommember}\`: e.g ${i.guild.members.cache.random().user.username}, Ngẫu nhiên một thành viên\n` +
                            `\`{server_randommember_tag}\`: e.g ${i.guild.members.cache.random().user.tag}, Tag của thành viên ngẫu nhiên\n` +
                            `\`{server_randommember_nobots}\`: e.g ${i.guild.members.cache.filter(member => !member.user.bot).random().user.username}, Tên thành viên ngẫu nhiên bỏ qua bot\n` +
                            `\`{server_owner}\`: e.g <@${i.guild.ownerId}>, Hiển thị chủ sỡ hữu máy chủ\n` +
                            `\`{server_owner_id}\`: e.g ${i.guild.ownerId}, ID chủ sở hữu máy chủ\n` +
                            `\`{server_createdate}\`: e.g ${new Date(i.guild.createdTimestamp).toLocaleDateString('vi-VN')}, Ngày tạo máy chủ\n\n` +

                            `**__Chức Năng Tăng Cường (Booster)__**\n` +
                            `\`{server_boostlevel}\`: e.g ${curBoostLvl !== null ? curBoostLvl.toString() : 'N/A'}, Cấp độ boost của máy chủ\n` +
                            `\`{server_boostcount}\`: e.g ${curBoostcount !== null ? curBoostcount.toString() : 'N/A'}, Số lượng boost của máy chủ\n` +
                            `\`{server_nextboostlevel}\`: e.g ${nextBoostLvl !== null ? nextBoostLvl.toString() : 'Tối đa'}, Cấp độ boost tiếp theo\n` +
                            `\`{server_nextboostlevel_required}\`: e.g ${nextBoostLvlReq !== null ? nextBoostLvlReq.toString() : 'Tối đa'}, Số lượng boost cần cho cấp độ tiếp theo\n` +
                            `\`{server_nextboostlevel_until_required}\`: e.g ${endBoost !== null ? endBoost.toString() : '0'}, Số lượng boost còn thiếu để đạt cấp độ tiếp theo\n\n` +

                            `**__Chức Năng Kênh (Channel)__**\n` +
                            `\`{channel}\`: e.g <#${i.channel.id}>, Đề cập tới kênh\n` +
                            `\`{channel_name}\`: e.g ${i.channel.name}, Tên kênh\n` +
                            `\`{channel_createdate}\`: e.g ${new Date(i.channel.createdTimestamp).toLocaleDateString('vi-VN')}, Ngày tạo kênh\n\n` +

                            `**__Chức Năng Tin Nhắn (Message)__**\n` +
                            `\`{message_link}\`: e.g [Message Link](<https://discordapp.com/channels/${guild.id}/${channel.id}/${message.id}}>), Liên kết của tin nhắn\n` +
                            `\`{message_id}\`: e.g ${message.id}, ID của tin nhắn\n` +
                            `\`{message_content}\`: e.g ${message.content}, Nội dung của tin nhắn (null = Không có nội dung)\n\n` +

                            `**__Chức Năng Khác (Others)__**\n` +
                            `\`{date}\`: e.g ${new Date().toLocaleDateString('vi-VN')}, Ngày hiện tại\n` +
                            `\`{newline}\`: Xuống dòng\n` +
                            `\`[choice]\`: Đưa ra các lựa chọn\n` +
                            `\`[lockedchoice}\`: Khóa chọn\n` +
                            `\`[$N]\`: Thay thế các đối số tương ứng\n` +
                            `\`[$N+]\`: Thay thế các đối số bắt đầu từ vị trí N đến hết\n` +
                            `\`[$N-Z]\`: Thay thế các đối số từ vị trí N đến Z`)
                    const variable2 = client
                        .embed()
                        .setColor(client.color.y)
                        .setDescription(`** __Chức Năng Nâng Cao(Advanced)__ **\n` +
                            `\`{dm}\`: e.g Gửi tin nhắn qua DMs\n` +
                            `\`{send_to:id}\`: e.g (1157597854634872865) Gửi tin nhắn đến kênh được chỉ định\n` +
                            `\`{delete_trigger:integer}\`: e.g (5), Xóa tin nhắn kích hoạt sau số giây được chỉ định\n` +
                            `\`{delete_reply:integer}\`: e.g (5), Xóa tin nhắn trả lời sau số giây được chỉ định\n` +
                            `\`{cooldown:integer}\`: e.g (5), Thời gian hồi chặn spam\n` +
                            `\`{add_role:id}\`: e.g (1157607999964205077), Thêm role vào người dùng sau khi thực thi\n` +
                            `\`{remove_role:id}\`: e.g (1157607999964205077), Xóa role khỏi người dùng sau khi thực thi\n` +
                            `\`{set_nick:string}\`: e.g (BiX), Đổi biệt danh của người dùng\n` +
                            `\`{react_trigger:emoji}\`: e.g (<a:emoji_212:1258230156129206282>, <a:yl_ga:901921067944271912>, max 3), Phản ứng với biểu tượng cảm xúc cho tin nhắn kích hoạt\n` +
                            `\`{react_reply:emoji}\`: e.g (<a:emoji_212:1258230156129206282>, <a:yl_ga:901921067944271912>, max 3), Phản ứng với biểu tượng cảm xúc cho tin nhắn trả lời\n` +
                            `\`{reply}\`: Trả lời tin nhắn kích hoạt với mention\n` +
                            `\`{reply_no_mention}\`: Trả lời tin nhắn kích hoạt mà không mention\n` +
                            `\`{message_no_mention}\`: Gửi tin nhắn mà không mention người dùng`)
                    i.reply({ embeds: [variable1, variable2], ephemeral: true });
                }
            });
        } catch (error) {
            client.logger.error(String(error.stack));
        }
    }
};
