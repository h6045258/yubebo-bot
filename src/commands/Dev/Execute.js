const { AttachmentBuilder } = require("discord.js");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = {
    name: "execute",
    aliases: ["run"],
    description: "Chạy lệnh bash",
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
    run: async (client, message, args) => {
        const ctx = await message.channel.send({
            content: `${client.e.load} | Đang chạy lệnh...`,
        });

        const command = args.join(" ");

        try {
            const { stdout } = await exec(command);
            const output = clean(stdout);

            if (output.includes(process.env.TOKEN))
                return ctx.edit(
                    "Không thể chạy đoạn code này, bên trong có chứa token của bot.",
                );

            if (output.length < 1024) {
                const embed = client
                    .embed()
                    .setFields(
                        {
                            name: "Input",
                            value: `\`\`\`bash\n${command}\`\`\``,
                        },
                        {
                            name: "Output",
                            value: `\`\`\`bash\n${output}\`\`\``,
                        },
                    )
                    .setColor(client.color.y);
                ctx.edit({ content: null, embeds: [embed] });
            } else {
                const attachmened = new AttachmentBuilder(Buffer.from(output), {
                    name: "output.txt",
                });
                ctx.edit({ content: null, files: [attachmened] });
            }
        } catch (e) {
            ctx.edit(`Lỗi \`\`\`bash\n${e}\`\`\``);
        }
    },
};

function clean(text) {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
}
