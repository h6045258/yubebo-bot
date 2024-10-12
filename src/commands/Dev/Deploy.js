module.exports = {
    name: "deploy",
    aliases: [""],
    description:
        "Triển khai và kích hoạt hoặc xoá các lệnh Slash của bot, Bao gồm tất cả SERVER hoặc chỉ cho MỘT SERVER",
    category: "Dev",
    permissions: {
        dev: true,
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
    run: async (client, message, args, prefix) => {
        try {
            let action = args[0];
            let guildId = args[1];

            if (action === "add") {
                await loadSlashs(client, message, guildId);
            } else if (action === "remove") {
                await deleteSlashs(client, message, guildId);
            } else {
                return message.channel.send({
                    content: `Hãy chỉ định hành động hợp lệ: \`add\` hoặc \`remove\`.`,
                });
            }
        } catch (e) {
            client.logger.error(String(e.stack));
            return message.channel.send({
                content: `Lỗi khi deploy!\n${e.message}`,
            });
        }
    },
};

async function loadSlashs(client, message, guildId) {
    let loadSlashsGlobal = true;
    if (guildId) {
        let guild = client.guilds.cache.get(guildId);
        if (guild) {
            loadSlashsGlobal = false;
            guildId = guild.id;
        }
    }

    if (loadSlashsGlobal) {
        let themsg = await message.reply(
            `${client.e.load} | Đang load tất cả lệnh slash tại \`${client.guilds.cache.size} server\``,
        );
        client.application.commands
            .set(client.allCommands)
            .then((slashCommandsData) => {
                themsg.edit(
                    `${client.e.done} | \`${slashCommandsData.size} lệnh slash\` (\`${slashCommandsData.map((d) => d.options).flat().length} lệnh con\`) đã được load cho tất cả server, mất khoảng vài phút để cập nhật toàn bộ.`,
                );
            })
            .catch(() => {});
    } else {
        let guild = client.guilds.cache.get(guildId);
        let themsg = await message.reply(
            `Đang load các lệnh slash cho server \`${guild.name}\`...`,
        );
        await guild.commands
            .set(client.allCommands)
            .then((slashCommandsData) => {
                themsg.edit(
                    `**\`${slashCommandsData.size} lệnh Slash\`** (\`${slashCommandsData.map((d) => d.options).flat().length} lệnh con\`) đã được load cho **${guild.name}**`,
                );
            })
            .catch((e) => {
                client.logger.error(String(e.stack));
                themsg.edit(
                    `**Không thể load các lệnh Slash cho ${guild.name}**\n\n**Bạn đã mời tôi bằng link này trong server đó chưa?**\n> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`,
                );
            });
    }
}

async function deleteSlashs(client, message, guildId) {
    if (guildId) {
        let guild = client.guilds.cache.get(guildId);
        if (guild) {
            await guild.commands
                .set([])
                .then(() => {
                    message.reply(
                        `Đã xoá tất cả lệnh Slash cho server **${guild.name}**`,
                    );
                })
                .catch((e) => {
                    client.logger.error(String(e.stack));
                    message.reply(
                        `Không thể xoá các lệnh Slash cho **${guild.name}**`,
                    );
                });
        } else {
            message.reply(`Không tìm thấy server với ID: **${guildId}**`);
        }
    } else {
        await client.application.commands
            .set([])
            .then(() => {
                message.reply(`Đã xoá tất cả lệnh Slash cho tất cả server`);
            })
            .catch((e) => {
                client.logger.error(String(e.stack));
                message.reply(`Không thể xoá các lệnh Slash global.`);
            });
    }
}
