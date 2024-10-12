const { readdirSync, lstatSync } = require('fs');
const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } = require('discord.js');
const path = require('path');

module.exports = (client) => {
    try {
        let totalCmds = 0;
        const cmdBase = path.join(__dirname, "../apps");

        readdirSync(cmdBase).forEach((file) => {
            const fullBase = path.join(cmdBase, file);
            if (!lstatSync(fullBase).isDirectory() && file.endsWith(".js")) {
                const res = loadCmd(client, fullBase);
                if (res) totalCmds += 1;
            }
        });

        readdirSync(cmdBase).forEach((dir) => {
            const dirBase = path.join(cmdBase, dir);
            if (lstatSync(dirBase).isDirectory()) {
                const cmd = new SlashCommandBuilder()
                    .setName(dir.toLowerCase())
                    .setDescription(`Các lệnh ${dir}!`);

                const res = loadCmdGroup(client, dirBase, cmd, dir.toLowerCase());
                totalCmds += res.count;

                if (res.count > 0) {
                    client.slashCommands.set(dir.toLowerCase(), cmd);
                    client.allCommands.push(cmd.toJSON());
                }
            }
        });

        client.logger.info(`Đã load ${totalCmds} lệnh slash command`);
    } catch (e) {
        client.logger.error(String(e.stack));
    }
};

function loadCmd(client, fullBase) {
    try {
        const cmdModule = require(fullBase);
        if (cmdModule.name && cmdModule.description) {
            const cmd = new SlashCommandBuilder()
                .setName(cmdModule.name.toLowerCase())
                .setDescription(cmdModule.description);

            if (cmdModule.options && cmdModule.options.length > 0) {
                cmdModule.options.forEach((option) => addOption(cmd, option, cmdModule.autocomplete));
            }

            const cmdName = cmdModule.name.toLowerCase();
            client.slashCommands.set(cmdName, cmdModule);
            client.allCommands.push(cmd.toJSON());
            return true;
        } else {
            client.logger.error(`${fullBase} thiếu tên hoặc mô tả trong lệnh.`);
            return false;
        }
    } catch (error) {
        client.logger.error(`Lỗi khi load lệnh từ file ${fullBase}:`, error.stack);
        return false;
    }
}

function loadCmdGroup(client, folderPath, parentCommand, parentName = '') {
    let count = 0;

    readdirSync(folderPath).forEach((fileOrFolder) => {
        const fullBase = path.join(folderPath, fileOrFolder);

        if (lstatSync(fullBase).isDirectory()) {
            const subCommandGroup = new SlashCommandSubcommandGroupBuilder()
                .setName(fileOrFolder.toLowerCase())
                .setDescription(`${fileOrFolder.toLowerCase()} commands`);

            const res = loadCmdGroup(client, fullBase, subCommandGroup, `${parentName}_${fileOrFolder.toLowerCase()}`);
            if (res.count > 0) {
                parentCommand.addSubcommandGroup(subCommandGroup);
                count += res.count;
            }
        } else if (fileOrFolder.endsWith('.js')) {
            const cmdModule = require(fullBase);

            if (cmdModule.name && cmdModule.description) {
                parentCommand.addSubcommand((subcommand) => {
                    subcommand
                        .setName(cmdModule.name.toLowerCase())
                        .setDescription(cmdModule.description.substring(0, 50));
                    if (cmdModule.options && cmdModule.options.length > 0) {
                        cmdModule.options.forEach((option) => addOption(subcommand, option, cmdModule.autocomplete));
                    }
                    return subcommand;
                });

                const commandKey = `${parentName}_${cmdModule.name.toLowerCase()}`;
                client.slashCommands.set(commandKey, cmdModule);
                count += 1;
            } else {
                client.logger.error(fileOrFolder, `Thiếu tên hoặc mô tả trong lệnh.`);
            }
        }
    });

    return { command: parentCommand, count };
}

function addOption(command, option) {
    switch (option.type) {
        case 'String':
            command.addStringOption((op) => {
                op.setName(option.name).setDescription(option.description).setRequired(option.required);
                if (option.autocomplete) {
                    op.setAutocomplete(true);
                } else if (option.choices && option.choices.length > 0) {
                    op.addChoices(option.choices.map((choice) => ({ name: choice.name, value: choice.value })));
                }
                return op;
            });
            break;
        case 'Channel':
            command.addChannelOption((op) => {
                let channelOption = op.setName(option.name).setDescription(option.description).setRequired(option.required);
                if (option.channelTypes) {
                    channelOption.addChannelTypes(option.channelTypes);
                }
                return channelOption;
            });
            break;
        case 'Integer':
            command.addIntegerOption((op) => op.setName(option.name).setDescription(option.description).setRequired(option.required));
            break;
        case 'Boolean':
            command.addBooleanOption((op) => op.setName(option.name).setDescription(option.description).setRequired(option.required));
            break;
        case 'User':
            command.addUserOption((op) => op.setName(option.name).setDescription(option.description).setRequired(option.required));
            break;
        case 'Role':
            command.addRoleOption((op) => op.setName(option.name).setDescription(option.description).setRequired(option.required));
            break;
        case 'Mentionable':
            command.addMentionableOption((op) => op.setName(option.name).setDescription(option.description).setRequired(option.required));
            break;
        case 'Number':
            command.addNumberOption((op) => op.setName(option.name).setDescription(option.description).setRequired(option.required));
            break;
        case 'Attachment':
            command.addAttachmentOption((op) => op.setName(option.name).setDescription(option.description).setRequired(option.required));
            break;
        default:
            break;
    }
}