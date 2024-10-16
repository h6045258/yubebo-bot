const plantingSchema = require('../../models/plantingSchema');
const invSchema = require('../../models/invSchema');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const questModel = require("../../models/questSchema");
const emojis = require('../../configs/emojis.json');

module.exports = {
  name: "plant",
  category: "Farm",
  aliases: ['tc', 'trongcay'],
  cooldown: 20,
  description: {
    content: "Trồng cây và thu hoạch gia tăng thu nhập",
    example: "plant",
    usage: "plant"
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    let planting = await plantingSchema.findOne({ memberid: message.author.id });
    if (!planting) {
      planting = new plantingSchema({
        memberid: message.author.id,
        ot: 0,
        lua: 0,
        carot: 0,
        cachua: 0,
        ngo: 0,
        khoaimi: 0,
        khoaitay: 0,
        caingot: 0,
        mia: 0,
        dao: 0,
        dautay: 0,
        duagang: 0,
        mit: 0,
      });
      await planting.save()
      const loading = await message.reply(`# ${client.i("loadbar")} | Đang tải dữ liệu khu vườn của bạn!`);
      const time = Math.floor(Math.random() * (5000 - 2000)) + 2000
      await client.sleep(time)
      await loading.edit(`Đã hoàn tất! Xin hãy gõ lại để trồng cây !`);
      return;
    }
    const ID = message.author.id
    const buttons = {
      ot: new ButtonBuilder()
        .setEmoji(client.seed.ot.seedEmoji)
        .setLabel(client.seed.ot.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.ot.code),
      lua: new ButtonBuilder()
        .setEmoji(client.seed.lua.seedEmoji)
        .setLabel(client.seed.lua.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.lua.code),
      carot: new ButtonBuilder()
        .setEmoji(client.seed.carot.seedEmoji)
        .setLabel(client.seed.carot.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.carot.code),
      cachua: new ButtonBuilder()
        .setEmoji(client.seed.cachua.seedEmoji)
        .setLabel(client.seed.cachua.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.cachua.code),
      ngo: new ButtonBuilder()
        .setEmoji(client.seed.ngo.seedEmoji)
        .setLabel(client.seed.ngo.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.ngo.code),
      khoaimi: new ButtonBuilder()
        .setEmoji(client.seed.khoaimi.seedEmoji)
        .setLabel(client.seed.khoaimi.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.khoaimi.code),
      khoaitay: new ButtonBuilder()
        .setEmoji(client.seed.khoaitay.seedEmoji)
        .setLabel(client.seed.khoaitay.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.khoaitay.code),
      caingot: new ButtonBuilder()
        .setEmoji(client.seed.caingot.seedEmoji)
        .setLabel(client.seed.caingot.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.caingot.code),
      mia: new ButtonBuilder()
        .setEmoji(client.seed.mia.seedEmoji)
        .setLabel(client.seed.mia.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.mia.code),
      dao: new ButtonBuilder()
        .setEmoji(client.seed.dao.seedEmoji)
        .setLabel(client.seed.dao.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.dao.code),
      dautay: new ButtonBuilder()
        .setEmoji(client.seed.dautay.seedEmoji)
        .setLabel(client.seed.dautay.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.dautay.code),
      duagang: new ButtonBuilder()
        .setEmoji(client.seed.duagang.seedEmoji)
        .setLabel(client.seed.duagang.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.duagang.code),
      mit: new ButtonBuilder()
        .setEmoji(client.seed.mit.seedEmoji)
        .setLabel(client.seed.mit.name)
        .setStyle(ButtonStyle.Primary).setCustomId(client.seed.mit.code),
    }
    const allIds = ["ot", "lua", "carot", "cachua", "ngo", "khoaimi", "khoaitay", "caingot", "mia", "dao", "dautay", "duagang", "mit"];
    let otChin = false;
    let luaChin = false;
    let carotChin = false;
    let cachuaChin = false;
    let ngoChin = false;
    let khoaimiChin = false;
    let khoaitayChin = false;
    let caingotChin = false;
    let miaChin = false;
    let daoChin = false;
    let dautayChin = false;
    let duagangChin = false;
    let mitChin = false;
    for (let id in allIds) {
      let plants = allIds[id];
      const seedAmount = await invSchema.findOne({ memberid: message.author.id, name: client.seed[plants].seedEmoji });
      if (planting[plants] !== 0 && Date.now() - planting[plants] >= 0) {
        buttons[plants].setStyle(ButtonStyle.Success)
        if (plants == "ot") otChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "lua") luaChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "carot") carotChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "cachua") cachuaChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "ngo") ngoChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "khoaimi") khoaimiChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "khoaitay") khoaitayChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "caingot") caingotChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "mia") miaChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "dao") daoChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "dautay") dautayChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "duagang") duagangChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
        if (plants == "mit") mitChin = true, buttons[plants].setEmoji(client.seed[plants].emoji);
      } else if (planting[plants] !== 0 && Date.now() - planting[plants] < 0) {
        buttons[plants].setDisabled(true).setEmoji(client.seed[plants].emoji).setStyle(ButtonStyle.Secondary);
      } else {
        if (!seedAmount || seedAmount.quanlity < 1) buttons[plants].setDisabled(true).setStyle(ButtonStyle.Secondary)
      }
    }
    const row1 = new ActionRowBuilder().addComponents([
      buttons.ot,
      buttons.lua,
      buttons.carot,
      buttons.cachua,
      buttons.ngo
    ])
    const row2 = new ActionRowBuilder().addComponents([
      buttons.khoaimi,
      buttons.khoaitay,
      buttons.caingot,
      buttons.mia,
      buttons.dao
    ])
    const row3 = new ActionRowBuilder().addComponents([
      buttons.dautay,
      buttons.duagang,
      buttons.mit
    ])
    const otString = `${client.seed.ot.emoji} | ${planting.ot !== 0
      ? otChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.ot).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const luaString = `${client.seed.lua.emoji} | ${planting.lua !== 0
      ? luaChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.lua).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const carotString = `${client.seed.carot.emoji} | ${planting.carot !== 0
      ? carotChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.carot).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const cachuaString = `${client.seed.cachua.emoji} | ${planting.cachua !== 0
      ? cachuaChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.cachua).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const ngoString = `${client.seed.ngo.emoji} | ${planting.ngo !== 0
      ? ngoChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.ngo).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const khoaimiString = `${client.seed.khoaimi.emoji} | ${planting.khoaimi !== 0
      ? khoaimiChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.khoaimi).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const khoaitayString = `${client.seed.khoaitay.emoji} | ${planting.khoaitay !== 0
      ? khoaitayChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.khoaitay).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const caingotString = `${client.seed.caingot.emoji} | ${planting.caingot !== 0
      ? caingotChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.caingot).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const miaString = `${client.seed.mia.emoji} | ${planting.mia !== 0
      ? miaChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.mia).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const daoString = `${client.seed.dao.emoji} | ${planting.dao !== 0
      ? daoChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.dao).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const dautayString = `${client.seed.dautay.emoji} | ${planting.dautay !== 0
      ? dautayChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.dautay).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const duagangString = `${client.seed.duagang.emoji} | ${planting.duagang !== 0
      ? duagangChin
        ? `${client.i("done")} | Đã Chín !` : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.duagang).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;
    const mitString = `${client.seed.mit.emoji} | ${planting.mit !== 0
      ? mitChin
        ? `${client.i("done")} | Đã Chín !` 
        : `${client.i("loadbar")} | \`${client.timeStamp(Date.now() - planting.mit).string.long}\``
      : `${client.i("fail")} | Chưa Trồng !`}`;

    const embedPlanting = new EmbedBuilder()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setTitle("Xin hãy nhấp vào các nút bên dưới để trồng cây!")
      .setDescription(`VƯỜN CÂY CỦA ${(message.author.username).toUpperCase()}
${otString}
${luaString}
${carotString}
${cachuaString}
${ngoString}
${khoaimiString}
${khoaitayString}
${caingotString}
${miaString}
${daoString}
${dautayString}
${duagangString}
${mitString}`)
      .setTimestamp()
      .setColor("#FFCC00")
      .setThumbnail(client.user.displayAvatarURL())

    const plantMessage = await message.channel.send({
      embeds: [embedPlanting],
      components: [row1, row2, row3]
    })
    const filter = (i) => i.message.id === plantMessage.id && i.user.id === message.author.id;
    const collector = await plantMessage.createMessageComponentCollector({ filter, time: 30_000 });
    collector.on("collect", async i => {
      if (i.customId == client.seed[i.customId].code) {
        let codeName = client.seed[i.customId].code
        if (!planting[codeName] || planting && planting[codeName] == 0) {
          const seed = await invSchema.findOne({ memberid: i.user.id, name: client.seed[codeName].seedEmoji })
          if (!seed || seed.quanlity < 1) {
            await i.reply({content:`${client.i("fail")} | **${message.author.username}**, bạn không có đủ ${client.seed[codeName].seedEmoji} để trồng cây!`, ephemeral: true}).catch(console.error(`Lỗi timeout nút.`))
            return;
          }
          seed.quanlity -= 1;
          await seed.save()
          planting[codeName] = Date.now() + client.seed[codeName].maturityTime
          await planting.save()
          let timestamp = client.timeStamp(client.seed[codeName].maturityTime)
          await i.reply({ content: `**${message.author.username}** đã trồng ` + client.seed[codeName].emoji + `! Xin hãy đợi ${timestamp.string.short}!` }).catch()
          buttons[codeName].setDisabled(true);
          buttons[codeName].setEmoji(client.seed[codeName].emoji);
          buttons[codeName].setDisabled(true);

          const questData = await questModel.findOne({ userId: i.user.id }); 

          if (questData) {
            if (questData.plant.progress < questData.plant.maxProgress) {
              questData.plant.progress++;
              await questData.save();
            }
  
            if (questData.plant.isComplete == false && questData.plant.progress >= questData.plant.maxProgress) {
              const authorId = i.user.id;
              const reward = questData.plant.reward.reward;
              const rewardName = questData.plant.reward.rewardName;
  
              handleNotiCompletedQuestPlant(message, rewardName, reward);
  
              const rewardNames = {
                "ycoin": async () => { await client.cong(authorId, reward); },
                "gembox": async () => { await client.addgem(authorId, emojis.gembox, reward, 0); },
                "pro_gembox": async () => { await client.addgem(authorId, emojis.progembox, reward, 0); },
                "vip_gembox": async () => { await client.addgem(authorId, emojis.vipgembox, reward, 0); },
              };
              await rewardNames[rewardName]();
              questData.plant.isComplete = true;
              await questData.save();
            }
          }
        } else {
          let amount = Math.floor(Math.random() * (client.seed[codeName].maxHarvest - client.seed[codeName].minHarvest)) + client.seed[codeName].minHarvest;
          let fruit = await invSchema.findOne({ memberid: i.user.id, name: client.seed[codeName].emoji });
          if (!fruit) {
            fruit = new invSchema({
              memberid: i.user.id,
              name: client.seed[codeName].emoji,
              quanlity: amount,
              type: "ns",
              price: client.seed[codeName].sell
            });
            await fruit.save()
          } else {
            fruit.quanlity += amount;
            await fruit.save();
          }
          await i.reply({ content: `${client.seed[codeName].emoji} | **${message.author.username}** đã thu hoạch được **${amount}** ${client.seed[codeName].name}!` }).catch();
          planting[codeName] = 0;
          await planting.save();
          buttons[codeName].setEmoji(client.seed[codeName].seedEmoji);
          buttons[codeName].setDisabled(true);
          const questData = await questModel.findOne({ userId: i.user.id }); 

          if (questData) {
            if (questData.plant.progress < questData.plant.maxProgress) {
              questData.plant.progress++;
              await questData.save();
            }
  
            if (questData.plant.isComplete == false && questData.plant.progress >= questData.plant.maxProgress) {
              const authorId = i.user.id;
              const reward = questData.plant.reward.reward;
              const rewardName = questData.plant.reward.rewardName;
  
              handleNotiCompletedQuestPlant(message, rewardName, reward);
  
              const rewardNames = {
                "ycoin": async () => { await client.cong(authorId, reward); },
                "gembox": async () => { await client.addgem(authorId, emojis.gembox, reward, 0); },
                "pro_gembox": async () => { await client.addgem(authorId, emojis.progembox, reward, 0); },
                "vip_gembox": async () => { await client.addgem(authorId, emojis.vipgembox, reward, 0); },
              };
              await rewardNames[rewardName]();
              questData.plant.isComplete = true;
              await questData.save();
            }
          }
        }
      }
      const row1Edited = new ActionRowBuilder().addComponents([
        buttons.ot,
        buttons.lua,
        buttons.carot,
        buttons.cachua,
        buttons.ngo
      ])
      const row2Edited = new ActionRowBuilder().addComponents([
        buttons.khoaimi,
        buttons.khoaitay,
        buttons.caingot,
        buttons.mia,
        buttons.dao
      ])
      const row3Edited = new ActionRowBuilder().addComponents([
        buttons.dautay,
        buttons.duagang,
        buttons.mit
      ])
      await plantMessage.edit({ components: [row1Edited, row2Edited, row3Edited] })
      collector.resetTimer({ time: 7_000, idle: 7_000 })
    });
    collector.on("end", async collected => {
      collector.stop()
      for (let items in buttons) {
        buttons[items].setDisabled(true);
      }
      const rowChanged1 = new ActionRowBuilder().addComponents(buttons.ot, buttons.lua, buttons.carot, buttons.cachua, buttons.ngo);
      const rowChanged2 = new ActionRowBuilder().addComponents(buttons.khoaimi, buttons.khoaitay, buttons.caingot, buttons.mia, buttons.dao);
      const rowChanged3 = new ActionRowBuilder().addComponents(buttons.dautay, buttons.duagang, buttons.mit);
      await plantMessage.edit({
        components: [rowChanged1, rowChanged2, rowChanged3]
      })
    })
  }
}

const handleNotiCompletedQuestPlant = (message, rewardName, reward) => {
  const reward_emojis = {
      "ycoin": emojis.coin,
      "gembox": emojis.gembox,
      "pro_gembox": emojis.progembox,
      "vip_gembox": emojis.vipgembox
  };

  const notiCompletedQuestEmbed = new EmbedBuilder()
      .addFields({
          name: `Chúc mừng bạn đã xong làm xong quest Plant`,
          value: `Phần thưởng: ${reward} ${reward_emojis[rewardName]}`
      })
      .setColor("Green")
      .setTimestamp();
  return message.reply({ embeds: [notiCompletedQuestEmbed] });
};
