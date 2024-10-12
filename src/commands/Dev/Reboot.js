module.exports = {
    name: 'reboot',
    aliases: ['rb'],
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
    run: async (client, message, args) => {

        const ctx = await message.channel.send({ content: `${client.e.load} | Đang reboot vui lòng đợi...` });
        await client.sleep(3000);

        if (!args[0] || args[0] == 'all') {
            await ctx.edit({ content: 'Đã reboot thành công tất cả các shard' });
            client.cluster.send({ type: 'reboot', shard: 'all' });
        }
        else if (!isNaN(args[0])) {
            await ctx.edit(`Đã reboot thành công shard ${args[0]}`);
            client.cluster.send({ type: 'reboot', shard: Number(args[0]) });
        }
        else {
            await ctx.edit('Nhập id shard hoặc "all".');
        }
    }
};
