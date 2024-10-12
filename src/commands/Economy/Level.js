const { AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const Canvas = require('canvas');
const User = require('../../models/userSchema');
const Status = require('../../models/statusSchema')
module.exports = {
    name: "level",
    category: "Economy",
    aliases: ['lv', 'capdo'],
    cooldown: 3,
    description: {
        content: "Xem cấp độ người chơi",
        example: "level",
        usage: "level"
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
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
        const userId = message.author.id;
        const user = await User.findOne({ userId });
        const userDataTop = await User.find().sort({ level: -1 });
        if (!user) {
            return message.channel.send('User not found in the database.');
        }
        const UserStatus = await Status.findOne({ userId: message.author.id })
        if (!UserStatus) {
            const newdb = await Status.create({ userId: message.author.id, status: "Một Yu con chính hiệu !"})
            await newdb.save()
        }
        const statusdf = UserStatus.status
        const userRank = userDataTop.reduce((rank, value, index) => {
            if (value.userId === message.author.id) rank = index;
            return rank;
        }, -1) + 1;
        await message.channel.sendTyping();
        const baseImage = await Canvas.loadImage('https://i.ibb.co/RCY8vNc/levelfinal.png');
        const canvas = Canvas.createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');
        roundRect(ctx, 0, 0, canvas.width, canvas.height, 30);
        ctx.clip();
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const avatarUrl = message.author.displayAvatarURL({ extension: 'png', dynamic: true })?.replace('.webp', '.png');
        const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const avatar = await Canvas.loadImage(Buffer.from(avatarResponse.data, 'binary'));
        const avatarSize = 115;
        const avatarX = 35;
        const avatarY = 25;

        ctx.save();
        roundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, avatarSize * 0.25);
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        //


        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(message.member.displayName, 170, 55);

        ctx.font = 'bold 16px Arial';
        ctx.fillText(message.author.username, 170, 75);

        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Status: Một Yu con chính hiệu`, 170, 105);
        ctx.fillText(`Level: ${user.level}`, 170, 135);

        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Exp:`, 45, 200);
        ctx.fillText(`Top:`, 355, 200);
        ctx.fillText(userRank, 385, 200);
        ctx.fillText(`${user.xp.toLocaleString()}/${user.nextLevelXp.toLocaleString()}`, 75, 200);


        const expPercentage = user.xp / user.nextLevelXp;
        const expBarWidth = 380;
        const expBarHeight = 14;
        const expBarX = 45;
        const expBarY = 210;
        ctx.fillStyle = '#ceddc8';
        roundRect(ctx, expBarX, expBarY, expBarWidth, expBarHeight, 10);

        const gradient = ctx.createLinearGradient(expBarX, expBarY, expBarX + expBarWidth, expBarY);
        gradient.addColorStop(0, '#8CBED6');
        gradient.addColorStop(1, '#fcb0d1');

        ctx.fillStyle = gradient;
        roundRect(ctx, expBarX, expBarY, expBarWidth * expPercentage, expBarHeight, 10);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'level.png' });
        await message.channel.send({ files: [attachment] });
    },
};


function roundRect(ctx, x, y, width, height, radius, fill = true, single = false) {
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (const side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    if (!single) {
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    } else {
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    }
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
}