const banSchema = require('../../models/BanSchema');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "banall",
  description: ["Ban all members in a specified guild from using the bot!"],
  usage: ["{prefix}banall <guild_id> [reason]"],
  cooldown: 60,
  category: "Dev",
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
    let success = [];
    let failed = [];
    let g = await client.guilds.cache.get(args[0]);
    let reason = args.slice(1).join(' ') || '';
    if (!g) return message.channel.send(`**${client.e.fail} |** Guild id không hợp lệ!`);

    let totalMembers = g.members.cache.size;
    message.channel.send(`**☠ |** Đang cấm tất cả người dùng trong guild ${g.name}...`);
    const processMember = async (user) => {
      try {
        if (user.user.bot) {
          failed.push(user);
        } else {
          const banned = new banSchema({
            admins: message.author.username,
            memberid: user.id,
            guildid: g.id,
            username: user.user.username,
            guildname: g.name,
            reason: reason
          });
          await banned.save();
          success.push(user);
          setTimeout(async () => {
            await user.send(`**☠ |** Bạn đã bị cấm sử dụng bot vĩnh viễn!\n**      | Lý do:** ${reason}`);
          }, 10000);
        }
      } catch (e) {
        failed.push(user);
      }
    };

    const batchProcess = async (users, batchSize) => {
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        await Promise.all(batch.map(user => processMember(user)));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to respect rate limits
      }
    };

    await batchProcess([...g.members.cache.values()], 50);

    let text = `**${client.e.done} |** Tớ đã cấm thành công ${success.length}/${totalMembers} người dùng tại guild ${g.name}:\n`;
    success.forEach((user) => {
      text += `[${user.id}] ${user.user.username}\n`;
    });
    if (failed.length) {
      text += `\n**${client.e.fail} |** Tớ không thể DM những người dùng sau:\n`;
      failed.forEach((user) => {
        text += `[${user.id}] ${user.user.username}\n`;
      });
    }
    if (reason) {
      text += `**| Lý do:** ${reason}`;
    }

    const filePath = path.join(__dirname, 'ban_results.txt');
    fs.writeFileSync(filePath, text, 'utf8');

    await message.channel.send({
      files: [{
        attachment: filePath,
        name: 'ban_results.txt'
      }]
    }).then(() => {
      fs.unlinkSync(filePath);
    }).catch(err => {
      console.error(err);
      message.channel.send(`**${client.e.fail} |** Đã xảy ra lỗi khi gửi tệp kết quả.`);
    });

    const YubabeLog = client.guilds.cache.get("1157597853431103559").channels.cache.get("1251580935409766531");
    return YubabeLog.send({
      files: [{
        attachment: filePath,
        name: 'ban_results.txt'
      }]
    }).then(() => {
      fs.unlinkSync(filePath);
    }).catch(err => {
      console.error(err);
      message.channel.send(`**${client.e.fail} |** Đã xảy ra lỗi khi gửi tệp kết quả.`);
    });
  },
};
