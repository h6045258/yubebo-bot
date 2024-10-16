module.exports = {
    name: 'shutdown',
    aliases: ['kill', 'off'],
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

        const ctx = await message.channel.send({ content: `${client.e.load} | Đang xử lý yêu cầu shutdown vui lòng đợi...` });
        await client.sleep(2000);

        if (!args[0] || args[0] == 'all') {
            await ctx.edit({ content: 'Đã kill thành công tất cả các shard' });
            client.cluster.send({ type: 'shutdown', shard: 'all' });
        }
        else if (!isNaN(args[0])) {
            await ctx.edit({ content: `Đã kill thành công shard ${args[0]}` });
            client.cluster.send({ type: 'shutdown', shard: Number(args[0]) });
        }
        else {
            await ctx.edit({ content: 'Nhập sai rồi 3. Nhập id shard hoặc "all" shard thôi.' });
        }
    },
};
