const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { ButtonStyle } = require('discord.js');

module.exports = {
    name: 'reload',
    aliases: ['rl'],
    category: 'Dev',
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
        const { commands } = client;
        if (args[0] === 'all') {
            client.cluster.broadcastEval(c => c.reloadAll());
            return message.channel.send(`Đã reload lại tất cả **${commands.size}** lệnh, tất cả event và handler`);
        } else if (args[0] === 'command' && args[1]) {
            const commandName = args[1].toLowerCase();
            if (!commands.has(commandName)) return message.channel.send('Lệnh không hợp lệ!');
            client.cluster.broadcastEval(reloadCommand, { context: { cmdName: commandName } });
            return message.channel.send(`Đã reload lại lệnh **${commandName}**.`);
        } else if (args[0] === 'event' && args[1]) {
            const eventName = args[1].toLowerCase();
            client.cluster.broadcastEval(reloadEvent, { context: { evtName: eventName } });
            return message.channel.send(`Đã reload lại event **${eventName}**.`);
        } else if (args[0] === 'handler' && args[1]) {
            const handlerName = args[1];
            client.cluster.broadcastEval(reloadHandler, { context: { hdlrName: handlerName } });
            return message.channel.send(`Đã reload lại handler **${handlerName}**.`);
        } else if (!args[0] || args[0] === 'file') {
            let hasReceivedIndexes = false;

            let currentDir = './src';
            let dir = currentDir.split('/').slice(currentDir.split('/').length - 1);
            const files = fs.readdirSync(currentDir).filter((file) => {
                return fs.statSync(currentDir + '/' + file).isFile();
            });
            const folders = fs.readdirSync(currentDir).filter((file) => {
                return fs.statSync(currentDir + '/' + file).isDirectory();
            });
            let dirs = [...folders, ...files];

            let selectMenuArray = [];
            for (let i = 0; i < dirs.length; i++) {
                const dir = dirs[i];
                selectMenuArray.push({
                    label: dir,
                    value: i.toString(),
                });
            }

            let selectMenuRow = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(`${message.id}:SELECT_MENU`)
                        .setPlaceholder('Không có gì được chọn')
                        .addOptions(selectMenuArray),
                );

            let buttonRow = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${message.id}:CANCEL_BUTTON`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Hủy bỏ')
                        .setEmoji('🗑️'),
                );

            const embed = client.embed()
                .setAuthor({ name: 'Yubabe Reloader Info', iconURL: client.user.displayAvatarURL() })
                .setColor(client.color.y)
                .setDescription(`📂 **${dir}**` + folders.map(dir => `\n- 📁 ${dir} `).join('') + files.map(dir => `\n- 📄 ${dir} `).join(''));
            const msg = await message.channel.send({ embeds: [embed], components: [selectMenuRow, buttonRow] });

            const buttonCollector = msg.createMessageComponentCollector({ time: 120000 });
            buttonCollector.on('collect', async interaction => {
                if (interaction.user.id != message.author.id) return;
                if (interaction.customId === `${message.id}:CANCEL_BUTTON`) {
                    hasReceivedIndexes = true;
                    return interaction.message.delete();
                } else if (interaction.customId === `${message.id}:BACK_BUTTON`) {
                    currentDir = currentDir.split('/').slice(0, -1).join('/');
                    dir = currentDir.split('/').slice(currentDir.split('/').length - 1);
                    await updateMessage();
                    await interaction.update({ embeds: [embed], components: [selectMenuRow, buttonRow] });
                }
            });

            const selectMenuCollector = msg.createMessageComponentCollector({ time: 120000 });
            selectMenuCollector.on('collect', async interaction => {
                if (interaction.user.id != message.author.id) return;
                if (interaction.customId != `${message.id}:SELECT_MENU`) return;
                hasReceivedIndexes = true;

                dir = dirs[interaction.values.map(s => parseInt(s))];
                currentDir += `/${dir}`;

                if (fs.statSync(currentDir).isFile()) {
                    if (currentDir.endsWith('.js')) {
                        const command = client.commands.get(dir.replace('.js', '').toLowerCase());
                        if (command && currentDir.includes('commands/')) {
                            client.cluster.broadcastEval((c, { cmd }) => c.reloadCommand(cmd.name), { context: { cmd: command } });
                        } else {
                            client.cluster.broadcastEval((c, { filePath }) => c.reloadFile(filePath), { context: { filePath: `${process.cwd()}/${currentDir.replace('./', '')}` } });
                        }
                        await interaction.update({ components: [] });
                        return message.channel.send(`Đã reload thành công file: \`${dir}\``);
                    } else if (currentDir.endsWith('.json')) {
                        client.loadLanguages();
                        client.cluster.broadcastEval((c, { filePath }) => c.reloadFile(filePath), { context: { filePath: `${process.cwd()}/${currentDir.replace('./', '')}` } });
                        await interaction.update({ components: [] });
                        return message.channel.send(`Đã reload thành công file: \`${dir}\``);
                    }
                }

                await updateMessage();
                await interaction.update({ embeds: [embed], components: [selectMenuRow, buttonRow] });
            });

            selectMenuCollector.on('end', async () => {
                msg.edit({ components: [] });
            });

            async function updateMessage() {
                const files = fs.readdirSync(currentDir).filter((file) => {
                    return fs.statSync(currentDir + '/' + file).isFile();
                });
                const folders = fs.readdirSync(currentDir).filter((file) => {
                    return fs.statSync(currentDir + '/' + file).isDirectory();
                });
                dirs = [...folders, ...files];

                embed.setDescription(`📂 **${dir}**` + folders.map(dir => `\n- 📁 ${dir} `).join('') + files.map(dir => `\n- 📄 ${dir} `).join(''));
                selectMenuArray = [];
                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    selectMenuArray.push({
                        label: dir,
                        value: i.toString(),
                    });
                }

                selectMenuRow = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId(`${message.id}:SELECT_MENU`)
                            .setPlaceholder('Không có gì được chọn')
                            .addOptions(selectMenuArray),
                    );

                buttonRow = new Discord.ActionRowBuilder();

                if (currentDir != './src') buttonRow.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${message.id}:BACK_BUTTON`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setLabel('Quay lại')
                        .setEmoji('⬅️'),
                );

                buttonRow.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${message.id}:CANCEL_BUTTON`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Hủy bỏ')
                        .setEmoji('🗑️'),
                );
            }

            setTimeout(() => {
                if (!hasReceivedIndexes) return message.reply('Hết hạn lựa chọn.');
            }, 120000);
        } else {
            return message.channel.send(`Sử dụng đúng: ${prefix}reload [all/command <tên_lệnh>/event <tên_event>/handler <tên_handler>/file]`);
        }

        function reloadCommand(c, { cmdName }) {
            c.reloadCommands(cmdName);
        }

        function reloadEvent(c, { evtName }) {
            c.reloadEvent(evtName);
        }

        function reloadHandler(c, { hdlrName }) {
            c.reloadHandler(hdlrName);
        }
    }
};
