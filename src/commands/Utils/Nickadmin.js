const { PermissionsBitField } = require("discord.js");
module.exports = {
  name: 'nickadmin',
    aliases: ['nn', 'nickname'],
    category: 'Utils',
    cooldown: 3,
    description: {
        content: 'Đổi tên của bạn hoặc người khác !',
        example: 'nn phankha',
        usage: 'nn <name>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: 'ManageNicknames'
    },
  run: async (client, message, args, prefix, lang) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return

    let name = args.join(" ");
    let member = message.mentions.members.first() || message.member;

    if (!member) return message.channel.send("❌ | Lỗi! (Không Tìm Thấy Người Dùng Đề Cập)");

    if (!message.mentions.members.first()) {
      if (name.length > 32) return message.channel.send("**Tên bạn muốn chọn quá dài, xin vui lòng nhập tên ít hơn 32 ký tự!**");

      await member
        .setNickname(name)
        .catch(() => message.channel.send("Đã có lỗi xảy ra"));
    } else {
      name = args.slice(1).join(" ");
      if (name.length > 32) return message.channel.send("**Tên bạn muốn chọn quá dài, xin vui lòng nhập tên ít hơn 32 ký tự!**");

      await member
        .setNickname(name)
        .catch(() => message.channel.send("Đã có lỗi xảy ra"));
    }

    await message.react("1163479511636123668").catch(() => {});
  }
};