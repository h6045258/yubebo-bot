const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require('discord.js');

const res = require('../../models/autoresponderSchema');

module.exports = {
    name: "autoresponder",
    aliases: ["ar"],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Tự động phản hồi nội dung chỉ định',
        example: 'autoresponder [create,add/update,edit/viewraw,raw/show,list] [embed/content] | Nhập lệnh autoresponder để được xem hướng dẫn chi tiết',
        usage: 'autoresponder [create,add/update,edit/viewraw,raw/show,list] [embed/content]'
    },
    permissions: {
        bot: [],
        user: ['ManageMessages']
    },
    run: async (client, message, args, prefix) => {
        const guildId = message.guild.id;

        if (!args[0]) {
            const eb = client
                .embed()
                .setAuthor({ name: "Cách Sử Dụng Autoresponder", iconURL: message.member.displayAvatarURL() })
                .setColor(client.color.y)
                .setDescription("- \`add\`: Thêm 1 từ mới | \`ví dụ:\` _ar add hi | hello $tag\n- \`show\`: Hiển thị các từ đã lưu | \`ví dụ:\` _ar show\n- \`delete\`: Xóa 1 từ đã tạo | \`ví dụ:\` _ar delete hi")
                .setTimestamp()
                .setThumbnail(message.guild.iconURL({ dynamic: true }));
            await message.channel.send({ embeds: [eb] });
            return;
        }

        if (args[0] === "add" || args[0] === "create") {
            const key = args[1];
            const type = args[2];

            if (!key) {
                return message.reply("Bạn cần cung cấp một key cho action này.");
            }

            if (!type || (type !== 'embed' && type !== 'content')) {
                return message.reply(`${client.emoji.fail} | Type autores bạn muốn là \`embed\` hay \`content\`? hãy cho tôi biết!`)
            }

            let data = await res.findOne({ guildId, key });
            if (data) {
                return message.reply("Key này đã tồn tại, sử dụng lệnh edit để chỉnh sửa.");
            }

            if (!data) {
                let newdata = new res({
                    guildId,
                    key,
                    type: type,
                    options: {
                        color: null,
                        content: 'Chưa có nội dung',
                        description: null,
                        timestamp: false,
                        image: null,
                        thumbnail: null,
                        author: { name: null, icon_url: null },
                        footer: { text: null, icon_url: null },
                        fields: { name: null, value: null }
                    }
                });

                await newdata.save();
                await message.react(client.emoji.done);
                message.channel.send(`Đã tạo autores mới với type là ${type}\n\n${prefix}autoresponder edit ${key} để bắt đầu setup nhé!`);
            } else {
                client.logger.error(`${client.emoji.fail} | Tag bạn vừa nhập là ${key} và nó đã có trong hệ thống, vui lòng chọn với 1 tag khác!`)
            }

        } else if (args[0] === "edit" || args[0] === "update") {
            const key = args[1];

            if (!key) {
                return message.reply(`${client.emoji.fail} | Bạn muốn chọn tag nào để edit?\n\n${prefix}autoresponder list để xem các danh sách autoresponder đã tạo!`);
            }

            let data = await res.findOne({ guildId, key });
            if (!data) {
                return message.reply(`${client.emoji.fail} | Tag bạn vừa nhập là ${key} và nó không nằm trong hệ thống\n\n${prefix}autoresponder add để tạo mới 1 tag!`);
            }

            if (data.type === "embed") {
                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('color')
                            .setLabel('Color')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('author')
                            .setLabel('Author')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('description')
                            .setLabel('Description')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('footer')
                            .setLabel('Footer')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('timestamp')
                            .setLabel('Timestamp')
                            .setStyle(ButtonStyle.Secondary)
                    );

                const button2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('image')
                            .setLabel('Image')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('thumbnail')
                            .setLabel('Thumbnail')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('fields')
                            .setLabel('Add Fields')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('edit_fields')
                            .setLabel('Edit Fields')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('variables')
                            .setLabel('Variables')
                            .setStyle(ButtonStyle.Secondary)
                    );

                const button3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('settings1')
                            .setLabel('Settings 1')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('settings2')
                            .setLabel('Settings 2')
                            .setStyle(ButtonStyle.Secondary)
                    )

                const embedMenu = client
                    .embed()
                    .setColor(data.options.color ? data.options.color : client.color.y)
                    .setDescription(`Đang setup tag ${key}`)

                const ctx = await message.channel.send({
                    embeds: [embedMenu],
                    components: [buttons, button2, button3]
                });

                const filter = i => i.user.id === message.author.id;
                const collector = ctx.createMessageComponentCollector({ filter, time: 180e3 });

                collector.on('collect', async (i) => {
                    if (i.user.id !== message.author.id) {
                        return i.reply({ content: `${client.emoji.fail} | Bạn không có quyền để sử dụng phím điều khiển!`, ephemeral: true });
                    }

                    if (i.customId === 'color') {
                        const hex = new TextInputBuilder()
                            .setCustomId("hex")
                            .setLabel(`Mã màu cho embed`)
                            .setPlaceholder("Ví dụ: #ffffff")
                            .setStyle(TextInputStyle.Short);
                        const modal_hex = new ModalBuilder()
                            .setCustomId('modal_hex')
                            .setTitle('Mã Màu');
                        const color_modal = new ActionRowBuilder().addComponents(hex);

                        modal_hex.addComponents(color_modal);
                        await i.showModal(modal_hex);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_hex"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const color = collected.fields.getTextInputValue("hex");
                            const isValidColor = /^#[0-9A-F]{6}$/i.test(color);
                            if (!isValidColor) {
                                return collected.reply({ content: `${client.emoji.fail} | Mã màu không hợp lệ. Vui lòng nhập mã màu hợp lệ (Ví dụ: #ffffff)!`, ephemeral: true });
                            }
                            embedMenu.setColor(color);
                            await res.updateOne({ guildId, key }, { "options.color": color });
                            await ctx.edit({ embeds: [embedMenu] });
                            await collected.deferUpdate();
                        }
                    } else if (i.customId === 'author') {
                        const authorModal = new ModalBuilder()
                            .setCustomId('modal_author')
                            .setTitle('Tác Giả');

                        const authorName = new TextInputBuilder()
                            .setCustomId('authorName')
                            .setLabel('Tên Tác Giả')
                            .setPlaceholder('Nhập tên tác giả')
                            .setStyle(TextInputStyle.Short);
                        const authorIcon = new TextInputBuilder()
                            .setCustomId('authorIcon')
                            .setLabel('URL Icon')
                            .setPlaceholder('Nhập URL Icon cho tác giả')
                            .setStyle(TextInputStyle.Short);

                        authorModal.addComponents(
                            new ActionRowBuilder().addComponents(authorName),
                            new ActionRowBuilder().addComponents(authorIcon)
                        );

                        await i.showModal(authorModal);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_author"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const name = collected.fields.getTextInputValue("authorName");
                            const icon = collected.fields.getTextInputValue("authorIcon");
                            if (!isValidImageURL(icon)) {
                                return collected.reply({ content: `${client.emoji.fail} | URL icon ảnh không hợp lệ. Vui lòng nhập URL ảnh hợp lệ (Ví dụ: https://example.com/image.png)!`, ephemeral: true });
                            }
                            embedMenu.setAuthor({ name, iconURL: icon });
                            await res.updateOne({ guildId, key }, { "options.author.name": name, "options.author.icon_url": icon });
                            await ctx.edit({ embeds: [embedMenu] });
                            await collected.deferUpdate();
                        }
                    } else if (i.customId === 'description') {
                        const descriptionModal = new ModalBuilder()
                            .setCustomId('modal_description')
                            .setTitle('Mô Tả');

                        const description = new TextInputBuilder()
                            .setCustomId('description')
                            .setLabel('Nội Dung Mô Tả')
                            .setPlaceholder('Nhập nội dung mô tả')
                            .setStyle(TextInputStyle.Paragraph);

                        descriptionModal.addComponents(
                            new ActionRowBuilder().addComponents(description)
                        );

                        await i.showModal(descriptionModal);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_description"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const descriptionText = collected.fields.getTextInputValue("description");
                            embedMenu.setDescription(descriptionText);
                            await res.updateOne({ guildId, key }, { "options.description": descriptionText });
                            await ctx.edit({ embeds: [embedMenu] });
                            await collected.deferUpdate();
                        }
                    } else if (i.customId === 'timestamp') {
                        const timestampModal = new ModalBuilder()
                            .setCustomId('modal_timestamp')
                            .setTitle('Timestamp');

                        const timestampValue = new TextInputBuilder()
                            .setCustomId('timestampValue')
                            .setLabel('Thời Gian Embed')
                            .setPlaceholder('true hay false (true là có false là không) hiển thị')
                            .setStyle(TextInputStyle.Short);

                        timestampModal.addComponents(
                            new ActionRowBuilder().addComponents(timestampValue)
                        );

                        await i.showModal(timestampModal);

                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_timestamp"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const timestamp = collected.fields.getTextInputValue("timestampValue");
                            const isValidTimestamp = timestamp.toLowerCase() === 'true' || timestamp.toLowerCase() === 'false';
                            if (!isValidTimestamp) {
                                return collected.reply({ content: `${client.emoji.fail} | Giá trị timestamp không hợp lệ. Vui lòng nhập true hoặc false!`, ephemeral: true });
                            }
                            const timestamps = timestamp.toLowerCase() === 'true';
                            embedMenu.setTimestamp(timestamps ? new Date() : null);
                            await res.updateOne({ guildId, key }, { "options.timestamp": timestamps });
                            await ctx.edit({ embeds: [embedMenu] });
                            await collected.deferUpdate();
                        }
                    } else if (i.customId === 'footer') {
                        const footerModal = new ModalBuilder()
                            .setCustomId('modal_footer')
                            .setTitle('Footer');

                        const footerText = new TextInputBuilder()
                            .setCustomId('footerText')
                            .setLabel('Nội Dung Footer')
                            .setPlaceholder('Nhập nội dung footer')
                            .setStyle(TextInputStyle.Paragraph);

                        const footerIcon = new TextInputBuilder()
                            .setCustomId('footerIcon')
                            .setLabel('URL Icon')
                            .setPlaceholder('Nhập URL Icon cho footer')
                            .setStyle(TextInputStyle.Short);

                        footerModal.addComponents(
                            new ActionRowBuilder().addComponents(footerText),
                            new ActionRowBuilder().addComponents(footerIcon)
                        );

                        await i.showModal(footerModal);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_footer"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const text = collected.fields.getTextInputValue("footerText");
                            const icon = collected.fields.getTextInputValue("footerIcon");
                            if (!isValidImageURL(icon)) {
                                return collected.reply({ content: `${client.emoji.fail} | URL icon ảnh không hợp lệ. Vui lòng nhập URL ảnh hợp lệ (Ví dụ: https://example.com/image.png)!`, ephemeral: true });
                            }
                            embedMenu.setFooter({ text, iconURL: icon });
                            await res.updateOne({ guildId, key }, { "options.footer.text": text, "options.footer.icon_url": icon });
                            await ctx.edit({ embeds: [embedMenu] });
                            await collected.deferUpdate();
                        }
                    } else if (i.customId === 'fields') {
                        let fields = data.options.fields || [];

                        if (fields.length >= 24) {
                            return i.reply({ content: "Bạn không thể thêm nhiều hơn 25 fields!", ephemeral: true });
                        }

                        const fieldsModal = new ModalBuilder()
                            .setCustomId('modal_fields')
                            .setTitle('Fields');

                        const fieldName = new TextInputBuilder()
                            .setCustomId('field_name')
                            .setLabel('Field Name')
                            .setPlaceholder('Nhập tên field')
                            .setStyle(TextInputStyle.Short);

                        const fieldValue = new TextInputBuilder()
                            .setCustomId('field_value')
                            .setLabel('Field Value')
                            .setPlaceholder('Nhập giá trị field')
                            .setStyle(TextInputStyle.Paragraph);

                        const inlineField = new TextInputBuilder()
                            .setCustomId('field_inline')
                            .setLabel('Inline')
                            .setPlaceholder('true hoặc false')
                            .setStyle(TextInputStyle.Short)
                            .setValue('false');

                        fieldsModal.addComponents(
                            new ActionRowBuilder().addComponents(fieldName),
                            new ActionRowBuilder().addComponents(fieldValue),
                            new ActionRowBuilder().addComponents(inlineField)
                        );

                        await i.showModal(fieldsModal);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_fields"
                        }).catch((e) => {
                            return null;
                        });

                        if (collected) {
                            const name = collected.fields.getTextInputValue('field_name');
                            const value = collected.fields.getTextInputValue('field_value');
                            const inline = collected.fields.getTextInputValue('field_inline').toLowerCase() === 'true';

                            fields.push({ name, value, inline });

                            await res.updateOne({ guildId, key }, { "options.fields": fields });
                            collected.reply({ content: `${client.emoji.done} | Đã cập nhật fields!`, ephemeral: true });
                        }
                    } else if (i.customId === 'edit_fields') {
                        let fields = data.options.fields || [];

                        const fieldOptions = fields.map((field, index) => ({
                            label: field.name.substring(0, 25),
                            value: index.toString()
                        }));

                        const selectMenu = new StringSelectMenuBuilder()
                            .setCustomId('select_field')
                            .setPlaceholder('Chọn 1 field để chỉnh sửa')
                            .addOptions(fieldOptions);

                        const selectRow = new ActionRowBuilder().addComponents(selectMenu);

                        await i.reply({ content: 'Chọn 1 field để chỉnh sửa:', components: [selectRow], ephemeral: true });

                        const filter = i => i.user.id === message.author.id;
                        const fieldCollector = i.channel.createMessageComponentCollector({ filter, time: 60000 });

                        fieldCollector.on('collect', async (selectInteraction) => {
                            if (selectInteraction.customId === 'select_field') {
                                const fieldIndex = parseInt(selectInteraction.values[0], 10);
                                const field = fields[fieldIndex];

                                const fieldEditModal = new ModalBuilder()
                                    .setCustomId('modal_edit_field')
                                    .setTitle(`Edit Field - ${field.name.substring(0, 256)}`);

                                const fieldNameInput = new TextInputBuilder()
                                    .setCustomId('field_name')
                                    .setLabel('Field Name')
                                    .setPlaceholder('Nội dung cho fields name')
                                    .setValue(field.name.substring(0, 256))
                                    .setStyle(TextInputStyle.Short);

                                const fieldValueInput = new TextInputBuilder()
                                    .setCustomId('field_value')
                                    .setLabel('Field Value')
                                    .setPlaceholder('Nội dung cho fields value')
                                    .setValue(field.value.substring(0, 1024))
                                    .setStyle(TextInputStyle.Paragraph);

                                const fieldInlineInput = new TextInputBuilder()
                                    .setCustomId('field_inline')
                                    .setLabel('Inline của Fields')
                                    .setPlaceholder('true hay false?')
                                    .setValue(field.inline.toString())
                                    .setStyle(TextInputStyle.Short);

                                fieldEditModal.addComponents(
                                    new ActionRowBuilder().addComponents(fieldNameInput),
                                    new ActionRowBuilder().addComponents(fieldValueInput),
                                    new ActionRowBuilder().addComponents(fieldInlineInput)
                                );

                                await selectInteraction.showModal(fieldEditModal);

                                const collected = await selectInteraction.awaitModalSubmit({
                                    time: 60000,
                                    filter: m => m.customId === 'modal_edit_field'
                                }).catch((e) => {
                                    return null;
                                });

                                if (collected) {
                                    const name = collected.fields.getTextInputValue('field_name').substring(0, 256);
                                    const value = collected.fields.getTextInputValue('field_value').substring(0, 1024);
                                    const inline = collected.fields.getTextInputValue('field_inline').toLowerCase() === 'true';

                                    fields[fieldIndex] = { name, value, inline };

                                    await res.updateOne({ guildId, key }, { "options.fields": fields });
                                    embedMenu.fields = [];
                                    fields.forEach(field => {
                                        embedMenu.addFields({ name: field.name.substring(0, 256), value: field.value.substring(0, 1024), inline: field.inline });
                                    });
                                    await ctx.edit({ embeds: [embedMenu] });
                                    collected.reply({ content: `${client.emoji.done} | Cập nhật fields thành công!`, ephemeral: true });
                                }
                            }
                        });

                        fieldCollector.on('end', async (collected, reason) => {
                            if (reason !== 'time') {
                                await ctx.edit({ components: [] });
                            }
                        });
                    } else if (i.customId === 'image') {
                        const imageModal = new ModalBuilder()
                            .setCustomId('modal_image')
                            .setTitle('Ảnh');

                        const imageURL = new TextInputBuilder()
                            .setCustomId('imageURL')
                            .setLabel('URL Ảnh')
                            .setPlaceholder('Nhập URL ảnh')
                            .setStyle(TextInputStyle.Short);

                        imageModal.addComponents(
                            new ActionRowBuilder().addComponents(imageURL)
                        );

                        await i.showModal(imageModal);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_image"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const url = collected.fields.getTextInputValue("imageURL");
                            if (!isValidImageURL(url)) {
                                return collected.reply({ content: `${client.emoji.fail} | URL ảnh không hợp lệ. Vui lòng nhập URL ảnh hợp lệ (Ví dụ: https://example.com/image.png)!`, ephemeral: true });
                            }
                            embedMenu.setImage(url);
                            await res.updateOne({ guildId, key }, { "options.image": url });
                            await ctx.edit({ embeds: [embedMenu] });
                            await collected.deferUpdate();
                        }
                    } else if (i.customId === 'thumbnail') {
                        const thumbnailModal = new ModalBuilder()
                            .setCustomId('modal_thumbnail')
                            .setTitle('Thumbnail');

                        const thumbnailURL = new TextInputBuilder()
                            .setCustomId('thumbnailURL')
                            .setLabel('URL Thumbnail')
                            .setPlaceholder('Nhập URL thumbnail')
                            .setStyle(TextInputStyle.Short);

                        thumbnailModal.addComponents(
                            new ActionRowBuilder().addComponents(thumbnailURL)
                        );

                        await i.showModal(thumbnailModal);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_thumbnail"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const url = collected.fields.getTextInputValue("thumbnailURL");
                            if (!isValidImageURL(url)) {
                                return collected.reply({ content: `${client.emoji.fail} | URL ảnh không hợp lệ. Vui lòng nhập URL ảnh hợp lệ (Ví dụ: https://example.com/image.png)!`, ephemeral: true });
                            }
                            embedMenu.setThumbnail(url);
                            await res.updateOne({ guildId, key }, { "options.thumbnail": url });
                            await ctx.edit({ embeds: [embedMenu] });
                            await collected.deferUpdate();
                        }
                    } else if (i.customId === 'settings1') {
                        const modal1 = new ModalBuilder()
                            .setCustomId('modal_settings_1')
                            .setTitle('Tùy chỉnh 1');
                        const matchModeInput = new TextInputBuilder()
                            .setCustomId('match_mode')
                            .setLabel('Match Mode')
                            .setPlaceholder('Nhập match mode')
                            .setStyle(TextInputStyle.Short);
                        const cooldownInput = new TextInputBuilder()
                            .setCustomId('cooldown')
                            .setLabel('Cooldown (số giây)')
                            .setPlaceholder('Nhập thời gian cooldown')
                            .setStyle(TextInputStyle.Short);
                        const requiredPermissionsInput = new TextInputBuilder()
                            .setCustomId('required_permissions')
                            .setLabel('Yêu cầu quyền')
                            .setPlaceholder('Nhập yêu cầu quyền')
                            .setStyle(TextInputStyle.Paragraph);
                        modal1.addComponents(
                            new ActionRowBuilder().addComponents(matchModeInput),
                            new ActionRowBuilder().addComponents(cooldownInput),
                            new ActionRowBuilder().addComponents(requiredPermissionsInput)
                        );
                        await i.showModal(modal1);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_settings_1"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const matchMode = collected.fields.getTextInputValue('match_mode').trim();
                            const cooldown = parseInt(collected.fields.getTextInputValue('cooldown'), 10) || 0;
                            const requiredPermissions = collected.fields.getTextInputValue('required_permissions').split(',').map(perm => perm.trim());
                            await res.updateOne({ guildId, key }, {
                                matchMode,
                                cooldown,
                                requiredPermissions
                            });
                            collected.reply({ content: `${client.emoji.done} | Tùy chỉnh 1 đã được cập nhật!`, ephemeral: true });
                        }
                    } else if (i.customId === 'settings2') {
                        const modal2 = new ModalBuilder()
                            .setCustomId('modal_settings_2')
                            .setTitle('Tùy chỉnh 2');
                        const deniedPermissionsInput = new TextInputBuilder()
                            .setCustomId('denied_permissions')
                            .setLabel('Chặn quyền')
                            .setPlaceholder('Chặn dùng nếu có quyền')
                            .setStyle(TextInputStyle.Paragraph);
                        const requiredRolesInput = new TextInputBuilder()
                            .setCustomId('required_roles')
                            .setLabel('Yêu cầu role')
                            .setPlaceholder('Nhập yêu cầu role')
                            .setStyle(TextInputStyle.Paragraph);
                        const deniedRolesInput = new TextInputBuilder()
                            .setCustomId('denied_roles')
                            .setLabel('Chặn role')
                            .setPlaceholder('Chặn role nếu có')
                            .setStyle(TextInputStyle.Paragraph);
                        modal2.addComponents(
                            new ActionRowBuilder().addComponents(deniedPermissionsInput),
                            new ActionRowBuilder().addComponents(requiredRolesInput),
                            new ActionRowBuilder().addComponents(deniedRolesInput)
                        );
                        await i.showModal(modal2);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_settings_2"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const deniedPermissions = collected.fields.getTextInputValue('denied_permissions').split(',').map(perm => perm.trim());
                            const requiredRoles = collected.fields.getTextInputValue('required_roles').split(',').map(role => role.trim());
                            const deniedRoles = collected.fields.getTextInputValue('denied_roles').split(',').map(role => role.trim());
                            await res.updateOne({ guildId, key }, {
                                deniedPermissions,
                                requiredRoles,
                                deniedRoles
                            });
                            collected.reply({ content: `${client.emoji.done} | Tùy chỉnh 2 đã được cập nhật!`, ephemeral: true });
                        }
                    } else if (i.customId === 'variables') {
                        const variablesEmbed = client
                            .embed()
                            .setColor(client.color.y)
                            .setTitle('Các Biến Có Sẵn')
                            .setDescription(`
**User / Author Information**
{user}, {user_tag}, {user_name}, {user_avatar}, {user_discrim},
{user_id}, {user_nick}, {user_joindate}, {user_createdate},
{user_displaycolor}, {user_boostsince}, {user_balance}, {user_balance_locale},
{user_item}, {user_item_count}, {user_inventory}
**Server Settings**
{server_prefix}, {server_currency}
**Server General Information**
{server_name}, {server_id}, {server_membercount},
{server_membercount_nobots}, {server_botcount}, {server_icon},
{server_rolecount}, {server_channelcount}, {server_randommember},
{server_randommember_tag}, {server_randommember_nobots},
{server_owner}, {server_owner_id}, {server_createdate}
**Server Boost Information**
{server_boostlevel}, {server_boostcount}
**Channel Information**
{channel}, {channel_name}, {channel_createdate}
**Message Information**
{message_link}, {message_id}, {message_content}
**Others**
{date}, {newline}, [choice], [lockedchoice], [$N], {dm}, {sendto:}, {embed:}, {delete}, {delete_reply:},
{requireuser:}, {requireperm:}, {requirechannel:}, {requirerole:}, {requirebal:}, {requireitem:},
{denyperm:}, {denychannel:}, {denyrole:}, {denyitem:}, {modifybal:}, {modifyinv:},
{cooldown:}, {addrole:}, {removerole:}, {setnick:}, {react:}, {reactreply:}, {addbutton:},
{range:}, {choose:}, {lockedchoose:}, {requirearg:}`.replace(/,/g, '').trim());
                        await i.reply({ embeds: [variablesEmbed], ephemeral: true });
                    }
                });

                collector.on('end', async (collected, reason) => {
                    ctx.edit({ embeds: [embedMenu], components: [] })
                });
            } else if (data.type === "content") {
                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('content')
                            .setLabel('Content')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('variables')
                            .setLabel('Variables')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('setting1')
                            .setLabel('Setting 1')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('setting2')
                            .setLabel('Setting 2')
                            .setStyle(ButtonStyle.Secondary)
                    );

                const ctx = await message.channel.send({
                    content: `Chỉnh sửa autores cho tag ${key}\n\n${data.options ? data.options.content : ''}`,
                    components: [button]
                });

                const filter = i => i.user.id === message.author.id;
                const collector = ctx.createMessageComponentCollector({ filter, time: 180e3 });

                collector.on('collect', async (i) => {
                    if (i.user.id !== message.author.id) {
                        return i.reply({ content: `${client.emoji.fail} | Bạn không có quyền để sử dụng phím điều khiển!`, ephemeral: true });
                    }

                    if (i.customId === 'content') {
                        const contentModal = new ModalBuilder()
                            .setCustomId('modal_content')
                            .setTitle('Nội Dung');

                        const content = new TextInputBuilder()
                            .setCustomId('content')
                            .setLabel('Nội Dung')
                            .setPlaceholder('Nhập nội dung của content')
                            .setStyle(TextInputStyle.Paragraph);

                        contentModal.addComponents(
                            new ActionRowBuilder().addComponents(content)
                        );

                        await i.showModal(contentModal);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_content"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const contentText = collected.fields.getTextInputValue("content");
                            await res.updateOne({ guildId, key }, { "options.content": contentText });
                            await ctx.edit({ content: `Đang chỉnh sửa autores cho key ${key}\n\n${contentText}` })
                            collected.deferUpdate();
                        }
                    } else if (i.customId === 'setting1') {
                        const modal1 = new ModalBuilder()
                            .setCustomId('modal_settings_1')
                            .setTitle('Tùy chỉnh 1');
                        const matchModeInput = new TextInputBuilder()
                            .setCustomId('match_mode')
                            .setLabel('Match Mode')
                            .setPlaceholder('Nhập match mode')
                            .setStyle(TextInputStyle.Short);
                        const cooldownInput = new TextInputBuilder()
                            .setCustomId('cooldown')
                            .setLabel('Cooldown (số giây)')
                            .setPlaceholder('Nhập thời gian cooldown')
                            .setStyle(TextInputStyle.Short);
                        const requiredPermissionsInput = new TextInputBuilder()
                            .setCustomId('required_permissions')
                            .setLabel('Yêu cầu quyền')
                            .setPlaceholder('Nhập yêu cầu quyền')
                            .setStyle(TextInputStyle.Paragraph);
                        modal1.addComponents(
                            new ActionRowBuilder().addComponents(matchModeInput),
                            new ActionRowBuilder().addComponents(cooldownInput),
                            new ActionRowBuilder().addComponents(requiredPermissionsInput)
                        );
                        await i.showModal(modal1);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_settings_1"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const matchMode = collected.fields.getTextInputValue('match_mode').trim();
                            const cooldown = parseInt(collected.fields.getTextInputValue('cooldown'), 10) || 0;
                            const requiredPermissions = collected.fields.getTextInputValue('required_permissions').split(',').map(perm => perm.trim());
                            await res.updateOne({ guildId, key }, {
                                matchMode,
                                cooldown,
                                requiredPermissions
                            });
                            collected.reply({ content: `${client.emoji.done} | Tùy chỉnh 1 đã được cập nhật!`, ephemeral: true });
                        }
                    } else if (i.customId === 'setting2') {
                        const modal2 = new ModalBuilder()
                            .setCustomId('modal_settings_2')
                            .setTitle('Tùy chỉnh 2');
                        const deniedPermissionsInput = new TextInputBuilder()
                            .setCustomId('denied_permissions')
                            .setLabel('Chặn quyền')
                            .setPlaceholder('Chặn dùng nếu có quyền')
                            .setStyle(TextInputStyle.Paragraph);
                        const requiredRolesInput = new TextInputBuilder()
                            .setCustomId('required_roles')
                            .setLabel('Yêu cầu role')
                            .setPlaceholder('Nhập yêu cầu role')
                            .setStyle(TextInputStyle.Paragraph);
                        const deniedRolesInput = new TextInputBuilder()
                            .setCustomId('denied_roles')
                            .setLabel('Chặn role')
                            .setPlaceholder('Chặn role nếu có')
                            .setStyle(TextInputStyle.Paragraph);
                        modal2.addComponents(
                            new ActionRowBuilder().addComponents(deniedPermissionsInput),
                            new ActionRowBuilder().addComponents(requiredRolesInput),
                            new ActionRowBuilder().addComponents(deniedRolesInput)
                        );
                        await i.showModal(modal2);
                        const collected = await i.awaitModalSubmit({
                            time: 60000,
                            filter: m => m.customId === "modal_settings_2"
                        }).catch((e) => {
                            return null;
                        });
                        if (collected) {
                            const deniedPermissions = collected.fields.getTextInputValue('denied_permissions').split(',').map(perm => perm.trim());
                            const requiredRoles = collected.fields.getTextInputValue('required_roles').split(',').map(role => role.trim());
                            const deniedRoles = collected.fields.getTextInputValue('denied_roles').split(',').map(role => role.trim());
                            await res.updateOne({ guildId, key }, {
                                deniedPermissions,
                                requiredRoles,
                                deniedRoles
                            });
                            collected.reply({ content: `${client.emoji.done} | Tùy chỉnh 2 đã được cập nhật!`, ephemeral: true });
                        }
                    } else if (i.customId === 'variables') {
                        const variablesEmbed = client
                            .embed()
                            .setColor(client.color.y)
                            .setTitle('Các Biến Có Sẵn')
                            .setDescription(`
**User / Author Information**
{user}, {user_tag}, {user_name}, {user_avatar}, {user_discrim},
{user_id}, {user_nick}, {user_joindate}, {user_createdate},
{user_displaycolor}, {user_boostsince}, {user_balance}, {user_balance_locale},
{user_item}, {user_item_count}, {user_inventory}
**Server Settings**
{server_prefix}, {server_currency}
**Server General Information**
{server_name}, {server_id}, {server_membercount},
{server_membercount_nobots}, {server_botcount}, {server_icon},
{server_rolecount}, {server_channelcount}, {server_randommember},
{server_randommember_tag}, {server_randommember_nobots},
{server_owner}, {server_owner_id}, {server_createdate}
**Server Boost Information**
{server_boostlevel}, {server_boostcount}
**Channel Information**
{channel}, {channel_name}, {channel_createdate}
**Message Information**
{message_link}, {message_id}, {message_content}
**Others**
{date}, {newline}, [choice], [lockedchoice], [$N], {dm}, {sendto:}, {embed:}, {delete}, {delete_reply:},
{requireuser:}, {requireperm:}, {requirechannel:}, {requirerole:}, {requirebal:}, {requireitem:},
{denyperm:}, {denychannel:}, {denyrole:}, {denyitem:}, {modifybal:}, {modifyinv:},
{cooldown:}, {addrole:}, {removerole:}, {setnick:}, {react:}, {reactreply:}, {addbutton:},
{range:}, {choose:}, {lockedchoose:}, {requirearg:}`.replace(/,/g, '').trim());
                        await i.reply({ embeds: [variablesEmbed], ephemeral: true });
                    }
                });

                collector.on('end', async (collected, reason) => {
                    ctx.edit({ components: [] })
                });
            }
        }

        if (args[0] === 'delete' || args[0] === 'del') {
            const key = args[1];
            if (!key) {
                return message.reply("Bạn cần cung cấp một key để xóa.");
            }

            const data = await res.findOneAndDelete({ guildId, key });
            message.channel.send(data ? `Đã xóa tag ${key}` : "Tag này không tồn tại.");
        }

        if (args[0] === 'show' || args[0] === 'list') {
            const data = await res.find({ guildId });

            const embedTags = data.filter(e => e.type === 'embed').map(e => e.key);
            const contentTags = data.filter(e => e.type === 'content').map(e => e.key);

            const initialEmbed = client
                .embed()
                .setAuthor({ name: `Các Tag Đang Có Tại ${message.guild.name}`, iconURL: message.guild.iconURL({}) })
                .setDescription(contentTags.length > 0 ? contentTags.join("\n") : `Server chưa có tag kiểu content nào được lưu!`)
                .setTimestamp();

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('content')
                        .setLabel('Tag Content')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('embed')
                        .setLabel('Tag Embed')
                        .setStyle(ButtonStyle.Secondary),
                );

            const messageSent = await message.channel.send({
                embeds: [initialEmbed],
                components: [buttons]
            });

            const filter = i => i.user.id === message.author.id;
            const collector = messageSent.createMessageComponentCollector({ filter, time: 180e3 });

            collector.on('collect', async (i) => {
                if (i.customId === 'embed') {
                    const updatedButtons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('embed')
                                .setLabel('Tag Embed')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('content')
                                .setLabel('Tag Content')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(false)
                        );

                    const updatedEmbed = client
                        .embed()
                        .setAuthor({ name: `Các Tag Đang Có Tại ${message.guild.name}`, iconURL: message.guild.iconURL({}) })
                        .setDescription(embedTags.length > 0 ? embedTags.join("\n") : `Server chưa có tag kiểu embed nào được lưu!`)
                        .setTimestamp();

                    await i.update({
                        embeds: [updatedEmbed],
                        components: [updatedButtons]
                    });
                }

                if (i.customId === 'content') {
                    const updatedButtons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('embed')
                                .setLabel('Tag Embed')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId('content')
                                .setLabel('Tag Content')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        );

                    const updatedEmbed = client
                        .embed()
                        .setAuthor({ name: `Các Tag Đang Có Tại ${message.guild.name}`, iconURL: message.guild.iconURL({}) })
                        .setDescription(contentTags.length > 0 ? contentTags.join("\n") : `Server chưa có tag kiểu content nào được lưu!`)
                        .setTimestamp();

                    await i.update({
                        embeds: [updatedEmbed],
                        components: [updatedButtons]
                    });
                }
            });

            collector.on('end', collected => {
                messageSent.edit({ components: [] });
            });
        }

        if (args[0] === 'raw' || args[0] === 'showraw') {
            const findKey = args[1];

            if (!findKey) {
                return message.channel.send({ content: `${client.emoji.fail} | Bạn cần cung cấp một key để xem raw config.` });
            }

            const data = await res.find({ guildId });
            const item = data.find(e => e.key === findKey);

            if (!item) {
                return message.channel.send({ content: `${client.emoji.fail} | Không tìm thấy thông tin với tag: ${findKey}` });
            }

            if (item.type === 'embed') {
                return message.channel.send({ content: `${client.emoji.fail} | Không thể xem raw config cho loại embed!` });
            }

            if (item.options.content) {
                const rawContent = `* **Tag \`${item.key}\`**\n\n\`\`\`json\n${JSON.stringify(item.options.content, null, 2)}\n\`\`\`\n`;

                if (rawContent.length > 2000) {
                    const buffer = Buffer.from(rawContent);
                    return message.channel.send({ files: [{ attachment: buffer, name: 'tagConfig.txt' }] });
                } else {
                    return message.channel.send({
                        embeds: [
                            client.embed()
                                .setColor(client.color.y)
                                .setAuthor({ name: 'Nội Dung Raw', iconURL: message.guild.iconURL({}) })
                                .setDescription(rawContent)
                        ]
                    });
                }
            } else {
                return message.channel.send({ content: `${client.emoji.fail} | Không có nội dung để hiển thị cho key: ${findKey}` });
            }
        }
    }
};

function isValidImageURL(url) {
    return /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i.test(url);
}
