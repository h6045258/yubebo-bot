const os = require('os');
const discord = require('discord.js');

module.exports = {
    name: 'vps',
    aliases: [],
    description: 'Xem thông tin của vps',
    category: 'Dev',
    permissions: {
        dev: true
    },
    /**
     * 
     * @param {import('discord.js').Client} client
     * @param {*} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {

        const ctx = await message.channel.send({ content: `${client.e.load} | Đang tải thông số,...` });
        await client.sleep(2000);

        const totalSeconds = os.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        const statsEmbed = client.embed()
            .setAuthor({ name: 'VPS', iconURL: client.user.displayAvatarURL({}) })
            .setColor(client.color.y)
            .addFields(
                { name: 'Host', value: `${os.type()} ${os.release()} (${os.arch()})` },
                { name: 'CPU', value: `${os.cpus()[0].model} (2 CPU)` },
                { name: 'Uptime', value: `${days} ngày, ${hours} giờ, ${mins} phút, và ${realTotalSecs} giây` },
                { name: 'RAM', value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` },
                { name: 'Bộ Nhớ Sử Dụng', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
                { name: 'CPU Load', value: `${(os.loadavg()[0]).toFixed(2)}%` },
                { name: 'CPU Cores', value: `x${os.cpus().length}` },
            )
            .setFooter({ text: `Node Version: ${process.version} | Discord Version: ${discord.version}` })
            .setTimestamp();
        return ctx.edit({ content: null, embeds: [statsEmbed] });

    }
}
