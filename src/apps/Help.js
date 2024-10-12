const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Hiển thị tất cả các lệnh của bot',
    cooldown: 3,
    run: async (client, interaction, args, prefix, message) => {

        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const commandsData = await client.application.commands.fetch();

        const loadCommand = (filePath, commandPath) => {
            try {
                const command = require(filePath);
                if (!command.name || !command.description) {
                    client.logger.warn(`Lệnh tại file ${filePath} thiếu tên hoặc mô tả.`);
                    return null;
                }

                let cmdPart = commandPath.split('/');
                let commandSlash = commandsData.find(cmd => cmd.name === cmdPart[0].toLowerCase());

                if (commandSlash && cmdPart.length > 1) {
                    cmdPart = cmdPart.slice(1);
                    let cmdOption = commandSlash;

                    while (cmdPart.length > 0) {
                        cmdOption = cmdOption.options.find(opt => opt.name === cmdPart[0].toLowerCase());
                        if (cmdOption) {
                            if (cmdPart.length === 1) {
                                command.id = cmdOption.id || commandSlash.id;
                            }
                            cmdPart = cmdPart.slice(1);
                        } else {
                            break;
                        }
                    }
                } else {
                    command.id = commandSlash ? commandSlash.id : null;
                }

                return { command, commandPath };
            } catch (e) {
                client.logger.error(`Lỗi đọc lệnh tại file ${filePath}:`, e.stack);
                return null;
            }
        };

        const getCommands = (dir, baseDir, commandPath = '') => {
            const results = [];
            const list = fs.readdirSync(dir);

            list.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    const newCommandPath = path.join(commandPath, file);
                    results.push(...getCommands(filePath, baseDir, newCommandPath));
                } else if (file.endsWith('.js')) {
                    const fileCommandPath = path.relative(baseDir, filePath).replace(/\\/g, '/').replace(/\.js$/, '');
                    const result = loadCommand(filePath, fileCommandPath);
                    if (result) results.push(result);
                }
            });

            return results;
        };

        const baseDir = path.resolve('./src/apps');
        const commands = getCommands(baseDir, baseDir);

        const UpperCase = string => string.charAt(0).toUpperCase() + string.slice(1);
        const categories = {};

        commands.forEach(({ command, commandPath }) => {
            const parts = commandPath.split('/');
            const category = parts[0].toLowerCase();

            if (!categories[category]) categories[category] = [];
            categories[category].push({
                name: command.name,
                description: command.description,
                options: command.options,
                fullPath: commandPath.toLowerCase(),
                id: command.id
            });
        });

        const buildDescription = command => {
            const cmdPart = command.fullPath.replace(/\//g, ' ').split(' ');
            const commandDisplay = `</${cmdPart.join(' ')}:${command.id}>`;
            let description = `${commandDisplay} ${command.description}\n`;
            if (command.options) {
                command.options.forEach(option => {
                    if (option.type === 1 || option.type === 2) {
                        description += `\t• </${cmdPart.slice(0, -1).join(' ')} ${option.name}:${command.id}>\n`;
                        if (option.options) {
                            option.options.forEach(subOption => {
                                description += `\t\t◦ </${cmdPart.slice(0, -2).join(' ')} ${option.name} ${subOption.name}:${command.id}>\n`;
                            });
                        }
                    }
                });
            }
            return description;
        };

        const buildEmbeds = categories => {
            const embeds = [];
            Object.keys(categories).forEach(category => {
                const embed = client.embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `${UpperCase(category)} Commands`, iconURL: client.user.displayAvatarURL({}) })
                    .setFooter({ text: 'Ấn vào lệnh để sử dụng nhanh', iconURL: interaction.user.displayAvatarURL({}) })
                if (categories[category].length > 0) {
                    const description = categories[category].map(buildDescription).join('\n');
                    embed.setDescription(description);
                }
                embeds.push(embed);
            });
            return embeds;
        };

        const embeds = buildEmbeds(categories);

        client.swap(interaction, embeds);
    }
};