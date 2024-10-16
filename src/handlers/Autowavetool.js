/**
 * 
 * @param {import("discord.js").Client} client 
 */
module.exports = async (client) => {

    client.on('messageCreate', async (message) => {
        return
        if (message.author.bot) return;

        const keywords = ['tools', 'tool', 'yubabe', 'phankha', "bot yu", "mimi", "tiền y"];
        if (keywords.some(keyword => message.content.toLowerCase().includes(keyword))) {
            try {

                const userId = '696893548863422494'
                const logChannel = client.users.cache.get(userId);

                // Lấy thông tin về guild
                const guild = message.guild;

                // Lấy vanity link nếu có
                let inviteLink = guild?.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : null;

                // Nếu không có vanity link, lấy invite link có sẵn hoặc yêu cầu từ shard khác
                if (!inviteLink && guild) {
                    const invites = await guild.invites.fetch();
                    inviteLink = invites.size > 0 ? invites.first().url : null;
                    if (!inviteLink) {
                        const shardId = client.cluster.id;
                        const guildId = guild.id;
                        await client.cluster.send({
                            _fetchGuildData: true,
                            guildId,
                            clusterId: shardId
                        });

                        client.cluster.on('message', async (message) => {
                            if (client._guildData && client._guildData.id === guildId) {
                                inviteLink = client._guildData.invite;
                            }
                        });

                        // Đợi cho đến khi nhận được dữ liệu từ shard khác
                        while (!inviteLink) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }
                }

                // Tạo đường dẫn đến tin nhắn
                const messageLink = `https://discord.com/channels/${guild?.id}/${message.channel.id}/${message.id}`;

                // Tạo thông điệp log
                const logMessage = `
**Guild ID:** ${guild?.id}
**Guild Name:** ${guild?.name}
**User ID:** ${message.author.id}
**Username:** ${message.author.tag}
**Message:** ${message.content}
**Message Link:** ${messageLink}
**Channel Name:** ${message.channel.name}
**Invite Link:** ${inviteLink}
**Member Count:** ${guild?.memberCount}
`;

                // Gửi thông điệp log vào kênh đích
                await logChannel.send(logMessage);
            } catch (error) {
                console.error('Error logging message:', error);
            }
        }
    });
};
