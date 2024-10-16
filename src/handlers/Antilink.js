const { EmbedBuilder } = require('discord.js');
const antilink = require('../models/antilinkSchema');
const deletedCounts = new Map();
/**
 * 
 * @param {import('discord.js').Client} client 
 */
module.exports = async (client) => {
    client.on('messageCreate', async (message) => {

        if (message.author.bot) return;

        const bannedKeywords = ['Onlyfans', 'Onlyfan', 'discord.gg/', 'Nude', '🔞', ':underage:', 'Porn', 'sex', '🍑', 'leaks', 'steam', 'from', 'gift', '50$'];
        const notifyChannelId = '1261448652782571521';

        const db = await antilink.findOne({ guildId: message.guild?.id });

        // Kiểm tra xem chức năng đã được bật hay không
        if (db && db.enabled === false) return;
        if (!message.guild.members.me.permissions.has(["BanMembers", "ManageMessages"])) return; 


        // Lấy hoặc tạo số lần tin nhắn bị xoá của người dùng
        let userDeletedCount = deletedCounts.get(message.author.id) || 0;

        let bannedKeywordCount = 0;
        bannedKeywords.forEach(keyword => {
            if (message.content.toLowerCase().includes(keyword.toLowerCase())) {
                bannedKeywordCount++;
            }
        });

        if (bannedKeywordCount >= 3) {
            userDeletedCount++;
            deletedCounts.set(message.author.id, userDeletedCount);

            if (userDeletedCount >= 10) {
                try {
                    // Ban người dùng
                    await message.guild.members.ban(message.author.id, { reason: 'Spamming inappropriate content' });

                    // Gửi thông báo cho người dùng
                    const user = client.users.cache.get(message.author.id);
                    if (user) {
                        const embed = new EmbedBuilder()
                            .setDescription(`⚠️ ${message.author} bị ban khỏi server ${message.guild.name} vì spam tin nhắn không phù hợp.`);
                        await user.send({ embeds: [embed] }).catch(error => console.error(`Lỗi khi gửi log: ${error}`));
                    }

                    // Gửi thông báo vào kênh cụ thể
                    const channelsend = message.guild.channels.cache.get(db.channelId);
                    if (channelsend) {
                        const embed = new EmbedBuilder()
                            .setDescription(`⚠️ ${message.author} đã bị ban khỏi server vì spam tin nhắn không phù hợp | Anti Link 18+ Banned`);
                        await channelsend.send({ embeds: [embed] }).catch(error => console.error(`Lỗi khi gửi log: ${error}`));
                        deletedCounts.delete(message.author.id);
                    }
                } catch (error) {
                    console.error(`Failed to ban user: ${error}`);
                }
            }

            try {
                await message.delete().catch(error => console.error(`Lỗi khi xoá xin nhắn: ${error}`));

                const notifyChannel = client.guilds.cache.get("896744428100804688").channels.cache.get(notifyChannelId);
                if (notifyChannel) {
                    const embed = new EmbedBuilder()
                        .setDescription(`⚠️ **1 Tin nhắn 18+ vừa bị loại bỏ tại ${message.channel.name}** ⚠️\n\n**User:** ${message.author}\n**Nội dung:** ${message.content}\n**Guild:** ${message.guild.name}`);
                    await notifyChannel.send({ embeds: [embed] }).catch(error => console.error(`Lỗi khi gửi log: ${error}`));
                }

                if (db && db.channelId) {
                    const channelsend = message.guild.channels.cache.get(db.channelId);
                    if (channelsend) {
                        const eb = new EmbedBuilder()
                            .setDescription(`⚠️ **1 Tin nhắn 18+ vừa bị loại bỏ tại ${message.channel.name}** ⚠️\n\n**User:** ${message.author}\n**Nội dung:** ${message.content}\n**Guild:** ${message.guild.name}`);
                        await channelsend.send({ embeds: [eb] });
                    }
                }
            } catch (error) {
                console.error(`Failed to send notification: ${error}`);
            }
        }
    });
};
