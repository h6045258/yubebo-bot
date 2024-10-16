const { AttachmentBuilder } = require("discord.js");
const util = require("util");

module.exports = {
    name: "eval",
    aliases: [],
    description: "Test code",
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
    run: async (client, message, args, prefix, lang) => {
        const ctx = await message.channel.send({
            content: `${client.e.load} | Đang thử code...`,
        });
        await client.sleep(1000);

        try {
            const code = args.join(" ");

            if (code.startsWith("```js") && code.endsWith("```")) {
                code = code.slice(5, -3).trim(); // Loại bỏ ``` ở đầu và cuối
            }

            if (code.includes('token')) {
                return ctx.edit({ content: 'Tính hack bot hả hay gì?' });
            }
            const sensitivePatterns = [
                process.env.TOKEN,
                message.content,
                /process\.env\.[a-zA-Z_][a-zA-Z0-9_]*\.(replace|replaceAll)\s*\(/gi,
                /replace(All)?\s*\(\s*['"`]TOKEN['"`]/gi,
                /T\+O\+K\+E\+N/gi,
                /['"`]T['"`]\s*\+\s*['"`]O['"`]\s*\+\s*['"`]K['"`]\s*\+\s*['"`]E['"`]\s*\+\s*['"`]N['"`]/gi
            ];

            if (sensitivePatterns.some(pattern => typeof pattern === 'string' ? code.includes(pattern) : pattern.test(message.content))) {
                return ctx.edit({
                    content: "Tính hack bot hả hay gì?",
                });
            }

            let evaled;
            if (args.includes("await")) {
                evaled = await eval(`(async () => { ${code} })()`);
            } else {
                evaled = eval(code);
            }

            const output = util.inspect(evaled, { depth: 0 });

            /*  if (sensitivePatterns.some(pattern => typeof pattern === 'string' ? output.includes(pattern) : pattern.test(output))) {
                   return ctx.edit({
                       content: "Tính hack bot hả hay gì?",
                   });
               } */

            if (output.length < 1024 && code.length < 1024) {
                const embed = client
                    .embed()
                    .setFields(
                        { name: "Input", value: `\`\`\`js\n${code}\`\`\`` },
                        { name: "Output", value: `\`\`\`js\n${output}\`\`\`` },
                    )
                    .setColor(client.color.y);
                ctx.edit({ content: null, embeds: [embed] });
            } else {
                const attached = new AttachmentBuilder(
                    Buffer.from(output),
                    "output.txt",
                );
                ctx.edit({ content: null, files: [attached] });
            }
        } catch (e) {
            ctx.edit(`Có lỗi xảy ra: \n\`\`\`js\n${e.message}\`\`\``).catch(
                (err) => client.logger.error(err),
            );
        }
    },
};
