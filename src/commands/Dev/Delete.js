const db = require('../../models/bankSchema');
const db2 = require('../../models/animalSchema');
const db3 = require('../../models/invSchema');
const db4 = require('../../models/moneySchema');
const db5 = require('../../models/praySchema');
const db6 = require('../../models/zoopointSchema');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "delete",
  description: ["Xóa người bị ban!", "Delete banned user!"],
  aliases: ['deldb', 'dlb'],
  usage: ["{prefix}delban @user", "{prefix}deleteban @user"],
  cooldown: 3,
  category: "Dev",
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
    const targetID = message.mentions.members.first() || client.users.cache.find(u => u.id == args[0])
    if (!targetID) return message.channel.send("Vui lòng ping ai đó để xóa!")

    let bans = await db4.find({ id: targetID.id })
    if (!bans) {
      console.log("Không tìm thấy người dùng trong schema `moneySchema`")
      bans = await db.find({ id: targetID.id })
      if (!bans) {
        console.log("Không tìm thấy người dùng trong schema `bankSchema`")
        bans = await db2.find({ id: targetID.id })
        if (!bans) {
          console.log("Không tìm thấy người dùng trong schema `animalSchema`")
          bans = await db3.find({ memberid: targetID.id })
          if (!bans) {
            console.log("Không tìm thấy người dùng trong schema `invSchema`")
            bans = await db5.find({ id: targetID.id })
            if (!bans) {
              console.log("Không tìm thấy người dùng trong schema `praySchema`")
              bans = await db6.find({ zooid: targetID.id })
              if (!bans) {
                console.log("Không tìm thấy người dùng trong schema `zoopointSchema`")
                return message.channel.send("Không tìm thấy người dùng này trong cơ sở dữ liệu!")
              }
            }
          }
        }
      }
    }

    // Sử dụng id người dùng tìm thấy để xóa dữ liệu khỏi tất cả các schema.
    const isDeleted = await db.deleteMany({ id: targetID.id })
    const isDeleted2 = await db2.deleteMany({ id: targetID.id })
    const isDeleted3 = await db3.deleteMany({ memberid: targetID.id })
    const isDeleted4 = await db4.deleteMany({ id: targetID.id })
    const isDeleted5 = await db5.deleteMany({ id: targetID.id })
    const isDeleted6 = await db6.deleteMany({ zooid: targetID.id })

    if (isDeleted && isDeleted2 && isDeleted3 && isDeleted4 && isDeleted5 && isDeleted6) {
      const embed = new EmbedBuilder()
        .setDescription(`Người dùng ${targetID} đã bị xóa:
        - Bank
        - Money
        - Item Inventory
        - Pray
        - Animal
        - Zoo Point`)
        .setColor("Red");

      return message.channel.send({ embeds: [embed] });
    } else {
      return message.channel.send(`${client.e.fail} | Không thể xóa dữ liệu!`)
    }
  },
};