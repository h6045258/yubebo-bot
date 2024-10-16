const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'variable',
    description: 'Hiển thị các biến rút gọn các tính năng của bot',
    cooldown: 3,
    run: async (client, interaction, user, prefix, message, lang) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const { guild, channel } = interaction;
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

        const variable = client
            .embed()
            .setColor(client.color.y)
            .setAuthor({ name: `${client.user.username} Biến Và Chức Năng`, iconURL: interaction.guild.iconURL({}) })
            .setDescription(`Dưới đây là các biến dành cho các lệnh:\n- Autoresponder\n- Embed Builder\n- Welcome\n- Leave\n- Boost`)
            .addFields(
                { name: `Chức Năng Người Dùng (User)`, value: `\`{user}\`\n\`{user_id}\`\n\`{user_tag}\`\n\`{user_name}\`\n\`{user_avatar}\`\n\`{user_discrim}\`\n\`{user_nick}\`\n\`{user_joindate}\`\n\`{user_createdate}\`\n\`{user_boostsince}\`\n\`{user_displaycolor}\``, inline: true },
                { name: `Chức Năng Máy Chủ (Server)`, value: `\`{server_prefix}\`\n\`{server_name}\`\n\`{server_id}\`\n\`{server_membercount}\`\n\`{server_membercount_nobots}\`\n\`{server_botcount}\`\n\`{server_icon}\`\n\`{server_rolecount}\`\n\`{server_channelcount}\`\n\`{server_randommember}\`\n\`{server_randommember_tag}\`\n\`{server_randommember_nobots}\`\n\`{server_owner}\`\n\`{server_owner_id}\`\n\`{server_createdate}\``, inline: true },
                { name: `Chức Năng Tăng Cường (Booster)`, value: `\`{server_boostlevel}\`\n\`{server_boostcount}\`\n\`{server_nextboostlevel}\`\n\`{server_nextboostlevel_required}\`\n\`{server_nextboostlevel_until_required}\``, inline: true },
                { name: `Chức Năng Kênh (Channel)`, value: `\`{channel}\`\n\`{channel_name}\`\n\`{channel_createdate}\``, inline: true },
                { name: `Chức Năng Tin Nhắn (Message)`, value: `\`{message_link}\`\n\`{message_id}\`\n\`{message_content}\``, inline: true },
                { name: `Chức Năng Khác (Others)`, value: `\`{date}\`\n\`{newline}\`\n\`[choice]\`\n\`[$N]\`\n\`[$N+]\`\n\`[$N-Z]\``, inline: true },
                { name: `Chức Năng Quyền Sử Dụng (Permissions)`, value: `\`{require_user:id}\`\n\`{require_perm:perm}\`\n\`{require_channel:id}\`\n\`{require_role:id}\`\n\`{deny_user:id}\`\n\`{deny_perm:perm}\`\n\`{deny_channel:id}\`\n\`{deny_role:id}\``, inline: true },
                { name: `Chức Năng Nâng Cao (Advanced)`, value: `\`{dm}\`\n\`{send_to:id}\`\n\`{delete_trigger}\`\n\`{delete_reply}\`\n\`{cooldown:seconds}\`\n\`{add_role:id}\`\n\`{remove_role:id}\`\n\`{set_nick:string}\`\n\`{react_trigger:emoji}\`\n\`{react_reply:emoji}\`\n\`{reply}\`\n\`{reply_no_mention}\`\n\`{message_no_mention}\``, inline: true }
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('huongdan')
                    .setLabel('Hướng Dẫn')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('perm')
                    .setLabel('Permissions')
                    .setStyle(ButtonStyle.Secondary)
            );

        const res = await interaction.editReply({
            embeds: [variable],
            components: [row]
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = res.createMessageComponentCollector({ filter, time: 180e3 });

        collector.on('collect', async i => {
            if (!i.isButton()) return;
            if (i.user.id !== user.id) return;

            if (i.customId === 'huongdan') {
                const huongdan = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `Hướng Dẫn Sử Dụng Biến Và Tính Năng`, iconURL: client.user.displayAvatarURL({}) })
                    .setDescription(`\n\n` +
                        `**__Chức Năng Người Dùng (User)__**\n` +
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
                        `\`[$N-Z]\`: Thay thế các đối số từ vị trí N đến Z`);

                const huongdan2 = client
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
                        `\`{message_no_mention}\`: Gửi tin nhắn mà không mention người dùng`);

                i.reply({
                    embeds: [huongdan, huongdan2],
                    ephemeral: true
                });
            } else if (i.customId === 'perm') {
                const perm = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `Permissions Biến Và Tính Năng`, iconURL: client.user.displayAvatarURL({}) })
                    .setDescription(`\n\n\`Administrator\`: Người quản lý\n\`ViewAuditLog\`: Xem nhật ký audit log\n\`ViewGuildInsights\`: Xem thông số của máy chủ\n\`ManageGuild\`: Quản lý máy chủ\n\`ManageRoles\`: Quản lý roles\n\`ManageChannels\`: Quản lý kênh\n\`KickMembers\`: Kick thành viên\n\`BanMembers\`: Ban thành viên\n\`CreateInstantInvite\`: Tạo invite ngay lập tức\n\`ChangeNickname\`: Đổi nickname\n\`ManageNicknames\`: Quản lý nicknames\n\`ManageEmojisAndStickers\`: Quản lý emojis và stickers\n\`ManageWebhooks\`: Quản lý webhooks\n\`ViewChannel\`: Xem kênh\n\`SendMessages\`: Gửi tin nhắn\n\`SendTTSMessages\`: Gửi tin nhắn TTS\n\`ManageMessages\`: Quản lý tin nhắn\n\`EmbedLinks\`: Embed liên kết\n\`AttachFiles\`: Đính kèm files\n\`ReadMessageHistory\`: Đọc lịch sử tin nhắn\n\`MentionEveryone\`: Mention everyone\n\`UseExternalEmojis\`: Sử dụng emojis bên ngoài\n\`AddReactions\`: Thêm phản ứng\n\`Connect\`: Kết nối voice\n\`Speak\`: Nói trong voice\n\`Stream\`: Phát trực tiếp\n\`UseExternalStickers\`: Sử dụng stickers bên ngoài\n\`ManageEmojis\`: Quản lý emojis\n\`ManageThreads\`: Quản lý các threads\n\`StartEmbeddedActivities\`: Bắt đầu các hoạt động nhúng\n\`CreatePublicThreads\`: Tạo các threads công khai\n\`CreatePrivateThreads\`: Tạo các threads riêng tư\n\`UseApplicationCommands\`: Sử dụng các lệnh ứng dụng\n\`ModerateMembers\`: Điều hành thành viên`);

                i.reply({
                    embeds: [perm],
                    ephemeral: true
                });
            }
        });

        collector.on('end', async () => {
            res.edit({ components: [] }).catch(console.error);
        });
    }
};
