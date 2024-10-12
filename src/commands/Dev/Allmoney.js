const bankSchema = require('../../models/bankSchema');
const moneySchema = require('../../models/moneySchema');

module.exports = {
  name: "allmoney",
  description: ["Hiển thị tất cả tiền đang có trên thị trường"],
  aliases: ["allm"],
  usage: ["{prefix}thanhtrung", "{prefix}banbot"],
  cooldown: 3,
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
    try {
      let totalCoins = 0;
      let totalYucoins = 0;
      let totalBankUsers = 0;
      let totalMoneyUsers = 0;
      const bankData = await bankSchema.find({});
      totalBankUsers = bankData.length;
      message.channel.send(`Đang đếm qua ${totalBankUsers} dữ liệu từ schema ngân hàng...`);

      bankData.forEach(user => {
        if (user.coins > 0) totalCoins += user.coins;
        if (user.yucoins > 0) totalYucoins += user.yucoins;
      });

      message.channel.send(`Đã quét xong ${totalBankUsers} dữ liệu từ schema ngân hàng.`);
      const moneyData = await moneySchema.find({});
      totalMoneyUsers = moneyData.length;
      message.channel.send(`Đang đếm qua ${totalMoneyUsers} dữ liệu từ schema tiền...`);

      moneyData.forEach(user => {
        if (user.coins > 0) totalCoins += user.coins;
      });
      message.channel.send(`Đã quét xong ${totalMoneyUsers} dữ liệu từ schema tiền.`);
      message.channel.send(`Tổng số tiền trên thị trường là: **${totalCoins.toLocaleString()}** Ycoin và **${totalYucoins.toLocaleString()}** yucoins.`);
    } catch (error) {
      console.error(error);
      message.channel.send('Đã xảy ra lỗi trong quá trình tính toán.');
    }
  }
};
