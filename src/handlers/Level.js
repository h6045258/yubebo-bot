const { AttachmentBuilder } = require('discord.js');
const moment = require('moment-timezone');
const axios = require('axios');
const Canvas = require('canvas');
const User = require('../models/userSchema'); // Giả sử bạn có một User schema để lưu thông tin người dùng

const talkedRecently = new Set();
const cooldown = 45000; // 45 giây
const baseXp = 1000; // XP cơ bản
const growthFactor = 1.3; // Hệ số 
module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild || !message.inGuild()) return;

        const userId = message.author.id;
        const now = moment().tz("Asia/Ho_Chi_Minh");
        const startOfDay = now.clone().startOf('day');

        if (talkedRecently.has(message.author.id)) return;

        const user = await User.findOne({ userId: userId }) || new User({ userId: userId });
        if (!user) return;
        // Reset daily XP nếu ngày hiện tại khác với ngày lưu trữ trong lastXpReset
        if (!moment(user.lastXpReset).isSame(startOfDay, 'day')) {
            user.dailyXp = 0;
            user.lastXpReset = startOfDay.toDate();
        }

        const guildMemberCount = message.guild.memberCount;
        if (guildMemberCount <= 30) return;

        let xpGained = 0;

        if (user.dailyXp === 0) {
            xpGained = 500;
        } else {
            xpGained = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
        }

        if (user.dailyXp + xpGained > 3000) {
            xpGained = 3000 - user.dailyXp;
        }


        user.dailyXp += xpGained;
        user.xp += xpGained;

        let nextLevelXp = baseXp * Math.pow(growthFactor, user.level);
        let currentLevel = user.level;

        const levelUpMessages = [];

        while (user.xp >= nextLevelXp) {
            user.xp = Math.floor(user.xp - nextLevelXp);
            user.level += 1;
            currentLevel = user.level;
            nextLevelXp = baseXp * Math.pow(growthFactor, user.level);
            user.nextLevelXp = nextLevelXp;

            // Thưởng khi lên level
            if (currentLevel % 10 === 0) {
                const rewards = getRewardsForLevel(user.level, client, message.member);
                levelUpMessages.push({ level: user.level, rewards });
            }

            await user.save();
        }
        talkedRecently.add(message.author.id);
        setTimeout(() => talkedRecently.delete(message.author.id), cooldown);
        await user.save();
        
        await Promise.all(levelUpMessages.map(messageInfo => sendLevelUpMessage(client, message, messageInfo.level, messageInfo.rewards.coins, messageInfo.rewards.gembox)));


    });
};

function getRewardsForLevel(level, client, member) {
    const rewards = { coins: 0, gembox: 0 };

    switch (level) {
        case 10:
            client.cong(member.id, 50000);
            client.addgem(member.id, '<:GEMBOX:982028743952441355>', 30, 0);
            rewards.coins = 50000;
            rewards.gembox = 30;
            break;
        case 20:
            client.cong(member.id, 100000);
            client.addgem(member.id, '<:GEMBOX:982028743952441355>', 60, 0);
            rewards.coins = 100000;
            rewards.gembox = 60;
            break;
        case 30:
            client.cong(member.id, 200000);
            client.addgem(member.id, '<:GEMBOX:982028743952441355>', 90, 0);
            rewards.coins = 200000;
            rewards.gembox = 90;
            break;
        case 40:
            client.cong(member.id, 300000);
            client.addgem(member.id, '<:GEMBOX:982028743952441355>', 120, 0);
            rewards.coins = 300000;
            rewards.gembox = 120;
            break;
        case 50:
            client.cong(member.id, 400000);
            client.addgem(member.id, '<:GEMBOX:982028743952441355>', 150, 0);
            rewards.coins = 400000;
            rewards.gembox = 150;
            break;
        case 60:
            client.cong(member.id, 500000);
            client.addgem(member.id, '<:GEMBOX:982028743952441355>', 180, 0);
            rewards.coins = 500000;
            rewards.gembox = 180;
            break;
        case 70:
            client.cong(member.id, 600000);
            client.addgem(member.id, '<:GEMBOX:982028743952441355>', 210, 0);
            rewards.coins = 600000;
            rewards.gembox = 210;
            break;
    }

    return rewards;
}

async function sendLevelUpMessage(client, message, level, coins, gembox) {
    const baseImageUrl = 'https://i.ibb.co/b2v34V1/demo2.png';
    const baseImageResponse = await axios.get(baseImageUrl, { responseType: 'arraybuffer' });
    const baseImage = await Canvas.loadImage(Buffer.from(baseImageResponse.data, 'binary'));

    const canvas = Canvas.createCanvas(390, 150); // Fixed size to match the image dimensions
    const context = canvas.getContext('2d');

    context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Add the level text
    context.font = 'bold 72px Arial';
    context.fillStyle = '#ffffff';
    const text = `${level}`;
    const textWidth = context.measureText(text).width;
    const xPosition = (canvas.width / 2) - (textWidth / 2);
    context.fillText(text, xPosition, 110);

    // Add the rewards text
    context.font = 'bold 14px Arial';
    context.fillStyle = '#ffffff';
    context.fillText(`+${coins.toLocaleString('en-us')}`, 43, 55);
    context.fillText(`+${gembox}`, 43, 88);

    // Load the user's avatar
    let avatarUrl = message.author.displayAvatarURL({ extension: 'png', dynamic: true });
    avatarUrl = avatarUrl.replace('.webp', '.png');
    const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
    const avatar = await Canvas.loadImage(Buffer.from(avatarResponse.data, 'binary'));

    const avatarSize = 125;
    const avatarX = canvas.width - avatarSize - 12.5;
    const avatarY = (canvas.height - avatarSize) / 2;

    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    context.save();
    roundRect(context, avatarX, avatarY, avatarSize, avatarSize, avatarSize * 0.08);
    context.clip();
    context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    context.restore();

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank.png' });
    await message.channel.send({ content: `${message.author} đã lên level ${level}!`, files: [attachment] });
}
