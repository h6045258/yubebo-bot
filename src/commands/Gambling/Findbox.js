const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const questModel = require("../../models/questSchema");
const emojis = require('../../configs/emojis.json');

module.exports = {
  name: 'findbox',
  aliases: ['fb'],
  category: 'Gambling',
  cooldown: 15,
  description: {
      content: 'Tìm ra chiếc hộp chứa đựng phần thưởng hoặc mất hết.',
      example: 'Findbox 10000 tối đa 250,000',
      usage: 'fb <số tiền>'
  },
  permissions: {
      bot: ['ViewChannel', 'SendMessages'],
      user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    let Boxes = [
      "<:so0:1037675460127113226>",
      "<:so1:1037675506398658620>",
      "<:so2:1037675570990952458>",
      "<:so3:1037675602972508241>",
      "<:so4:1037675631409897512>",
      "<:so5:1037676087951507516>",
      "<:so6:1037675670333046874>",
      "<:so7:1037675704210427904>",
      "<:so8:1037675894359195658>",
      "<:so9:1037675919629885442>"
    ]
    let cash = await client.cash(message.author.id)
    let text = args.join(' ');
    let bet;
    
    if (cash < 10000) {
      return message.reply(`${client.e.fail} | Bạn không còn gì để đặt! Cần ít nhất 10.000 Ycoin để chơi!`)
    }
    
    if (text.toLowerCase() === "all") {
      bet = cash >= 250000 ? 250000 : cash;
    } else {
      bet = parseInt(text.replace(/[^\d]/g, ''));
    }
    
    if (!bet || bet < 10000) {
      return message.channel.send(`${client.e.fail} | Số tiền không hợp lệ hoặc dưới 10,000 Ycoin`);
    } else if (bet > 250000) {
      return message.channel.send(`${client.e.fail} | Số tiền không thể lớn hơn 250,000 Ycoin`);
    } else if (bet < 1) {return message.channle.send("${client.e.fail} | Người sống vui lòng chơi số dương !")}
     else if (bet > cash) {
      return message.reply(`${client.e.fail} | Bạn không đủ tiền để đặt`);
    }
    
    // Rest of your code...
    
    let Prizes = [
      bet,
      bet * 2,
      bet * 3,
      bet * 4,
      bet
    ]
    let startembed = new EmbedBuilder()
      .setAuthor({ name: message.author.username, icon_url: message.author.displayAvatarURL() })
      .setDescription(`Mỗi chiếc hộp bên dưới có một giá trị bí ẩn!
Bạn hãy chọn chiếc hộp có giá trị cao nhất để sở hữu số tiền lời mình mong muốn nhé!    
`)

    let buttonrow1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[0])
          .setCustomId('0'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[1])
          .setCustomId('1'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[2])
          .setCustomId('2'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[3])
          .setCustomId('3'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[4])
          .setCustomId('4')
      );
    let buttonrow2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[5])
          .setCustomId('5'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[6])
          .setCustomId('6'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[7])
          .setCustomId('7'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[8])
          .setCustomId('8'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji(Boxes[9])
          .setCustomId('9')
      );
    let reply = await message.reply({ embeds: [startembed], components: [buttonrow1, buttonrow2] })
    var collector = reply.createMessageComponentCollector({
      filter: interaction => (interaction.isButton()
        && interaction.message.id == reply.id
        && interaction.user.id == message.author.id
        && interaction.message.author.id == client.user.id)
    })
    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) {  
          return interaction
            .reply({ content: `${client.e.fail} | **${interaction.user.username}** , không phải nút dành cho bạn!`, ephemeral: true })
            .catch(e => console.log(e))
      }
      await interaction.deferUpdate()
      await reply.delete()
      let win = false
      let msg
      let rand = Math.floor(Math.random() * 99)
      if (rand <= 29) win = true
      if (win) prize = Prizes[Math.floor(Math.random() * Prizes.length)]
      if (win) await client.cong(message.author.id, prize - bet)
      else await client.tru(message.author.id, bet)
      let msh = await message.reply(`Bạn đã chọn chiếc hộp số ${interaction.customId}\nKết quả là..... <a:yl_loading:1109041890667544678>`)
      await client.sleep(2000)
      let msh1 = await msh.edit("Và đó là...")
      await client.sleep(1000)
      let msh2 = await msh1.edit("Và đó là ..")
      await client.sleep(1000)
      await msh2.edit(`${win
        ? `🔥 | Chúc mừng bạn đã chọn trúng chiếc hộp có số tiền x${prize / bet} lần! 
      Bạn đã ăn được **__${parseInt(prize).toLocaleString("en-us")} Ycoin__**`
        : `😭 | Rất tiếc, bạn đã chọn phải chiếc hộp rỗng, bạn đã mất **__${parseInt(bet).toLocaleString("en-us")} Ycoin__**`
        }`)

        const questData = await questModel.findOne({ userId: interaction.user.id }); 

        if (questData && questData.gambling.commandName == "findbox") {
          if (questData.gambling.progress < questData.gambling.maxProgress) {
            questData.gambling.progress++;
            await questData.save();
          }

          if (questData.gambling.isComplete == false && questData.gambling.progress >= questData.gambling.maxProgress) {
            const authorId = interaction.user.id;
            const reward = questData.gambling.reward.reward;
            const rewardName = questData.gambling.reward.rewardName;

            handleNotiCompletedQuestFindBox(message, rewardName, reward);

            const rewardNames = {
              "ycoin": async () => { await client.cong(authorId, reward); },
              "gembox": async () => { await client.addgem(authorId, emojis.gembox, reward, 0); },
              "pro_gembox": async () => { await client.addgem(authorId, emojis.progembox, reward, 0); },
              "vip_gembox": async () => { await client.addgem(authorId, emojis.vipgembox, reward, 0); },
            };
            await rewardNames[rewardName]();
            questData.gambling.isComplete = true;
            await questData.save();
          }
        }
    })
  }
}


const handleNotiCompletedQuestFindBox = (message, rewardName, reward) => {
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