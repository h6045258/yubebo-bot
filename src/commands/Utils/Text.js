module.exports = {
  name: 'text',
  aliases: ['txt'],
  category: 'Utils',
  cooldown: 3,
  description: {
      content: 'Thay đổi font chữ !',
      example: 'txt 1 hello',
      usage: 'txt <style> <content>'
  },
  permissions: {
      bot: ['ViewChannel', 'SendMessages'],
      user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    
    let styles = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", 
      "round", "blackround", "square", "smallbold", "bigbold", "smallitalic", 
      "bigitalic", "smallbolditalic", "bigbolditalic", "smallhand", "bighand", 
      "new", "mono"
    ];

    let style = args[0];
    if (!styles.includes(style)) {
      return message.channel.send({
        content: lang.utils.text_1
          .replace('{value}', message.author),
        embeds: [
          client
            .embed()
            .setColor(client.color.y)
            .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL({}) })
            .setDescription(lang.utils.text_2
                .replaceAll('{value}', prefix))
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({}) })
        ]
      });
    }

    let text2 = args.slice(1).join(" ");
        if (!text2) text2 = lang.utils.text_3;
        let textArray = typeChange(style);
        let formatText = text2.split("").map(char => textArray[char] || char).join("");
        await message.channel.send(formatText);
      }
    };

function typeChange(type) {
  const alphaUpper = [
    "a", "A", "b", "B", "c", "C", "d", "D", "e", "E", "f", "F", "g", "G", "h", "H", "i", "I",
    "j", "J", "k", "K", "l", "L", "m", "M", "n", "N", "o", "O", "p", "P", "r", "R",
    "s", "S", "t", "T", "u", "U", "v", "V", "w", "W", "x", "X", "y", "Y", "z", "Z",
    "q", "Q"
  ];
  const alphaLower = [
      "á", "à", "ả", "ã", "ạ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ",
      "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ", "í", "ì", "ỉ", "ĩ", "ị",
      "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ",
      "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự", "ý", "ỳ", "ỷ", "ỹ", "ỵ",
      "a", "A", "b", "B", "c", "C", "d", "D", "e", "E", "f", "F", "g", "G", "h", "H", "i", "I",
      "j", "J", "k", "K", "l", "L", "m", "M", "n", "N", "o", "O", "p", "P", "r", "R",
      "s", "S", "t", "T", "u", "U", "v", "V", "w", "W", "x", "X", "y", "Y", "z", "Z",
      "q", "Q"
  ];
  const alphabet1 = [
      "ⓐ", "Ⓐ", "ⓑ", "Ⓑ", "ⓒ", "Ⓒ", "ⓓ", "Ⓓ", "ⓔ", "Ⓔ", "ⓕ", "Ⓕ", "ⓖ", "Ⓖ", "ⓗ",
      "Ⓗ", "ⓘ", "Ⓘ", "ⓙ", "Ⓙ", "ⓚ", "Ⓚ", "ⓛ", "Ⓛ", "ⓜ", "Ⓜ", "ⓝ", "Ⓝ", "ⓞ", "Ⓞ", "ⓟ",
      "Ⓟ", "ⓡ", "Ⓡ", "ⓢ", "Ⓢ", "ⓣ", "Ⓣ", "ⓤ", "Ⓤ", "ⓥ", "Ⓥ", "ⓦ", "Ⓦ", "ⓧ", "Ⓧ", "ⓨ", "Ⓨ", "ⓩ",
      "Ⓩ", "ⓠ", "Ⓠ"
    ];
  const alphabet2 = [
      "🅐", "🅐", "🅑", "🅑", "🅒", "🅒", "🅓", "🅓", "🅔", "🅔", "🅕", "🅕", "🅖", "🅖", "🅗",
      "🅗", "🅘", "🅘", "🅙", "🅙", "🅚", "🅚", "🅛", "🅛", "🅜", "🅜", "🅝", "🅝", "🅞", "🅞",
      "🅟", "🅟", "🅡", "🅡", "🅢", "🅢", "🅣", "🅣", "🅤", "🅤", "🅥", "🅥", "🅦", "🅦",
      "🅧", "🅧", "🅨", "🅨", "🅩", "🅩", "🅠", "🅠"
    ];
  const alphabet3 = [
      "🅰", "🅰", "🅱", "🅱", "🅲", "🅲", "🅳", "🅳", "🅴", "🅴", "🅵", "🅵", "🅶", "🅶",
      "🅷", "🅷", "🅸", "🅸", "🅹", "🅹", "🅺", "🅺", "🅻", "🅻", "🅼", "🅼", "🅽", "🅽",
      "🅾", "🅾", "🅿", "🅿", "🆁", "🆁", "🆂", "🆂", "🆃", "🆃", "🆄", "🆄", "🆅", "🆅",
      "🆆", "🆆", "🆇", "🆇", "🆈", "🆈", "🆉", "🆉", "🆀", "🆀"
    ];
  const alphabet4 = [
      "𝐚́", "𝐚̀", "𝐚̉", "𝐚̃", "𝐚̣", "𝐚̆", "𝐚̆́", "𝐚̆̀", "𝐚̆̉", "𝐚̆̃", "𝐚̣̆", "𝐚̂", "𝐚̂́", "𝐚̂̀", "𝐚̂̉",
      "𝐚̂̃", "𝐚̣̂", "𝐞́", "𝐞̀", "𝐞̉", "𝐞̃", "𝐞̣", "𝐞̂", "𝐞̂́", "𝐞̂̀", "𝐞̂̉", "𝐞̂̃", "𝐞̣̂", "𝐢́", "𝐢̀",
      "𝐢̉", "𝐢̃", "𝐢̣", "𝐨́", "𝐨̀", "𝐨̉", "𝐨̃", "𝐨̣", "𝐨̂", "𝐨̂́", "𝐨̂̀", "𝐨̂̉", "𝐨̂̃", "𝐨̣̂", "𝐨̛",
      "𝐨̛́", "𝐨̛̀", "𝐨̛̉", "𝐨̛̃", "𝐨̛̣", "𝐮́", "𝐮̀", "𝐮̉", "𝐮̃", "𝐮̣", "𝐮̛", "𝐮̛́", "𝐮̛̀", "𝐮̛̉", "𝐮̛̃",
      "𝐮̛̣", "𝐲́", "𝐲̀", "𝐲̉", "𝐲̃", "𝐲̣", "𝐚", "𝐀", "𝐛", "𝐁", "𝐜", "𝐂", "𝐝", "𝐃", "𝐞", "𝐄", "𝐟", "𝐅",
      "𝐠", "𝐆", "𝐡", "𝐇", "𝐢", "𝐈", "𝐣", "𝐉", "𝐤", "𝐊", "𝐥", "𝐋", "𝐦", "𝐌", "𝐧", "𝐍", "𝐨", "𝐎", "𝐩",
      "𝐏", "𝐫", "𝐑", "𝐬", "𝐒", "𝐭", "𝐓", "𝐮", "𝐔", "𝐯", "𝐕", "𝐰", "𝐖", "𝐱", "𝐗", "𝐲", "𝐘", "𝐳", "𝐙",
      "𝐪", "𝐐"
    ];
  const alphabet5 = [
      "𝗮́", "𝗮̀", "𝗮̉", "𝗮̃", "𝗮̣", "𝗮̆", "𝗮̆́", "𝗮̆̀", "𝗮̆̉", "𝗮̆̃", "𝗮̣̆", "𝗮̂", "𝗮̂́", "𝗮̂̀", "𝗮̂̉",
      "𝗮̂̃", "𝗮̣̂", "𝗲́", "𝗲̀", "𝗲̉", "𝗲̃", "𝗲̣", "𝗲̂", "𝗲̂́", "𝗲̂̀", "𝗲̂̉", "𝗲̂̃", "𝗲̣̂", "𝗶́", "𝗶̀",
      "𝗶̉", "𝗶̃", "𝗶̣", "𝗼́", "𝗼̀", "𝗼̉", "𝗼̃", "𝗼̣", "𝗼̂", "𝗼̂́", "𝗼̂̀", "𝗼̂̉", "𝗼̂̃", "𝗼̣̂", "𝗼̛",
      "𝗼̛́", "𝗼̛̀", "𝗼̛̉", "𝗼̛̃", "𝗼̛̣", "𝘂́", "𝘂̀", "𝘂̉", "𝘂̃", "𝘂̣", "𝘂̛", "𝘂̛́", "𝘂̛̀", "𝘂̛̉", "𝘂̛̃",
      "𝘂̛̣", "𝘆́", "𝘆̀", "𝘆̉", "𝘆̃", "𝘆̣", "𝗮", "𝗔", "𝗯", "𝗕", "𝗰", "𝗖", "𝗱", "𝗗", "𝗲", "𝗘", "𝗳", "𝗙",
      "𝗴", "𝗚", "𝗵", "𝗛", "𝗶", "𝗜", "𝗷", "𝗝", "𝗸", "𝗞", "𝗹", "𝗟", "𝗺", "𝗠", "𝗻", "𝗡", "𝗼", "𝗢", "𝗽",
      "𝗣", "𝗿", "𝗥", "𝘀", "𝗦", "𝘁", "𝗧", "𝘂", "𝗨", "𝘃", "𝗩", "𝘄", "𝗪", "𝘅", "𝗫", "𝘆", "𝗬", "𝘇", "𝗭",
      "𝗾", "𝗤"
    ];
  const alphabet6 = [
      "𝑎́", "𝑎̀", "𝑎̉", "𝑎̃", "𝑎̣", "𝑎̆", "𝑎̆́", "𝑎̆̀", "𝑎̆̉", "𝑎̆̃", "𝑎̣̆", "𝑎̂", "𝑎̂́", "𝑎̂̀", "𝑎̂̉",
      "𝑎̂̃", "𝑎̣̂", "𝑒́", "𝑒̀", "𝑒̉", "𝑒̃", "𝑒̣", "𝑒̂", "𝑒̂́", "𝑒̂̀", "𝑒̂̉", "𝑒̂̃", "𝑒̣̂", "𝑖́", "𝑖̀",
      "𝑖̉", "𝑖̃", "𝑖̣", "𝑜́", "𝑜̀", "𝑜̉", "𝑜̃", "𝑜̣", "𝑜̂", "𝑜̂́", "𝑜̂̀", "𝑜̂̉", "𝑜̂̃", "𝑜̣̂", "𝑜̛",
      "𝑜̛́", "𝑜̛̀", "𝑜̛̉", "𝑜̛̃", "𝑜̛̣", "𝑢́", "𝑢̀", "𝑢̉", "𝑢̃", "𝑢̣", "𝑢̛", "𝑢̛́", "𝑢̛̀", "𝑢̛̉", "𝑢̛̃",
      "𝑢̛̣", "𝑦́", "𝑦̀", "𝑦̉", "𝑦̃", "𝑦̣", "𝑎", "𝐴", "𝑏", "𝐵", "𝑐", "𝐶", "𝑑", "𝐷", "𝑒", "𝐸", "𝑓", "𝐹",
      "𝑔", "𝐺", "ℎ", "𝐻", "𝑖", "𝐼", "𝑗", "𝐽", "𝑘", "𝐾", "𝑙", "𝐿", "𝑚", "𝑀", "𝑛", "𝑁", "𝑜", "𝑂", "𝑝",
      "𝑃", "𝑟", "𝑅", "𝑠", "𝑆", "𝑡", "𝑇", "𝑢", "𝑈", "𝑣", "𝑉", "𝑤", "𝑊", "𝑥", "𝑋", "𝑦", "𝑌", "𝑧", "𝑍",
      "𝑞", "𝑄"
    ];
  const alphabet7 = [
      "𝘢́", "𝘢̀", "𝘢̉", "𝘢̃", "𝘢̣", "𝘢̆", "𝘢̆́", "𝘢̆̀", "𝘢̆̉", "𝘢̆̃", "𝘢̣̆", "𝘢̂", "𝘢̂́", "𝘢̂̀", "𝘢̂̉",
      "𝘢̂̃", "𝘢̣̂", "𝘦́", "𝘦̀", "𝘦̉", "𝘦̃", "𝘦̣", "𝘦̂", "𝘦̂́", "𝘦̂̀", "𝘦̂̉", "𝘦̂̃", "𝘦̣̂", "𝘪́", "𝘪̀",
      "𝘪̉", "𝘪̃", "𝘪̣", "𝘰́", "𝘰̀", "𝘰̉", "𝘰̃", "𝘰̣", "𝘰̂", "𝘰̂́", "𝘰̂̀", "𝘰̂̉", "𝘰̂̃", "𝘰̣̂", "𝘰̛",
      "𝘰̛́", "𝘰̛̀", "𝘰̛̉", "𝘰̛̃", "𝘰̛̣", "𝘶́", "𝘶̀", "𝘶̉", "𝘶̃", "𝘶̣", "𝘶̛", "𝘶̛́", "𝘶̛̀", "𝘶̛̉", "𝘶̛̃",
      "𝘂̛̣", "𝘺́", "𝘺̀", "𝘺̉", "𝘺̃", "𝘺̣", "𝘢", "𝘈", "𝘣", "𝘉", "𝘤", "𝘊", "𝘥", "𝘋", "𝘦", "𝘌", "𝘧", "𝘍",
      "𝘨", "𝘎", "𝘩", "𝘏", "𝘪", "𝘐", "𝘫", "𝘑", "𝘬", "𝘒", "𝘭", "𝘓", "𝘮", "𝘔", "𝘯", "𝘕", "𝘰", "𝘖", "𝘱",
      "𝘗", "𝘳", "𝘙", "𝘴", "𝘚", "𝘵", "𝘛", "𝘶", "𝘜", "𝘷", "𝘝", "𝘸", "𝘞", "𝘹", "𝘟", "𝘺", "𝘠", "𝘻", "𝘡",
      "𝘲", "𝘘"
    ];
  const alphabet8 = [
      "𝒂́", "𝒂̀", "𝒂̉", "𝒂̃", "𝒂̣", "𝒂̆", "𝒂̆́", "𝒂̆̀", "𝒂̆̉", "𝒂̆̃", "𝒂̣̆", "𝒂̂", "𝒂̂́", "𝒂̂̀", "𝒂̂̉",
      "𝒂̂̃", "𝒂̣̂", "𝒆́", "𝒆̀", "𝒆̉", "𝒆̃", "𝒆̣", "𝒆̂", "𝒆̂́", "𝒆̂̀", "𝒆̂̉", "𝒆̂̃", "𝒆̣̂", "𝒊́", "𝒊̀",
      "𝒊̉", "𝒊̃", "𝒊̣", "𝒐́", "𝒐̀", "𝒐̉", "𝒐̃", "𝒐̣", "𝒐̂", "𝒐̂́", "𝒐̂̀", "𝒐̂̉", "𝒐̂̃", "𝒐̣̂", "𝒐̛",
      "𝒐̛́", "𝒐̛̀", "𝒐̛̉", "𝒐̛̃", "𝒐̛̣", "𝒖́", "𝒖̀", "𝒖̉", "𝒖̃", "𝒖̣", "𝒖̛", "𝒖̛́", "𝒖̛̀", "𝒖̛̉", "𝒖̛̃",
      "𝒖̛̣", "𝒚́", "𝒚̀", "𝒚̉", "𝒚̃", "𝒚̣", "𝒂", "𝑨", "𝒃", "𝑩", "𝒄", "𝑪", "𝒅", "𝑫", "𝒆", "𝑬", "𝒇", "𝑭",
      "𝒈", "𝑮", "𝒉", "𝑯", "𝒊", "𝑰", "𝒋", "𝑱", "𝒌", "𝑲", "𝒍", "𝑳", "𝒎", "𝑴", "𝒏", "𝑵", "𝒐", "𝑶", "𝒑",
      "𝑷", "𝒓", "𝑹", "𝒔", "𝑺", "𝒕", "𝑻", "𝒖", "𝑼", "𝒗", "𝑽", "𝒘", "𝑾", "𝒙", "𝑿", "𝒚", "𝒀", "𝒛", "𝒁",
      "𝒒", "𝑸"
    ];
  const alphabet9 = [
      "𝙖́", "𝙖̀", "𝙖̉", "𝙖̃", "𝙖̣", "𝙖̆", "𝙖̆́", "𝙖̆̀", "𝙖̆̉", "𝙖̆̃", "𝙖̣̆", "𝙖̂", "𝙖̂́", "𝙖̂̀", "𝙖̂̉",
      "𝙖̂̃", "𝙖̣̂", "𝙚́", "𝙚̀", "𝙚̉", "𝙚̃", "𝙚̣", "𝙚̂", "𝙚̂́", "𝙚̂̀", "𝙚̂̉", "𝙚̂̃", "𝙚̣̂", "𝙞́", "𝙞̀",
      "𝙞̉", "𝙞̃", "𝙞̣", "𝙤́", "𝙤̀", "𝙤̉", "𝙤̃", "𝙤̣", "𝙤̂", "𝙤̂́", "𝙤̂̀", "𝙤̂̉", "𝙤̂̃", "𝙤̣̂", "𝙤̛",
      "𝙤̛́", "𝙤̛̀", "𝙤̛̉", "𝙤̛̃", "𝙤̛̣", "𝙪́", "𝙪̀", "𝙪̉", "𝙪̃", "𝙪̣", "𝙪̛", "𝙪̛́", "𝙪̛̀", "𝙪̛̉", "𝙪̛̃",
      "𝙪̛̣", "𝙮́", "𝙮̀", "𝙮̉", "𝙮̃", "𝙮̣", "𝙖", "𝘼", "𝙗", "𝘽", "𝙘", "𝘾", "𝙙", "𝘿", "𝙚", "𝙀", "𝙛", "𝙁",
      "𝙜", "𝙂", "𝙝", "𝙃", "𝙞", "𝙄", "𝙟", "𝙅", "𝙠", "𝙆", "𝙡", "𝙇", "𝙢", "𝙈", "𝙣", "𝙉", "𝙤", "𝙊", "𝙥",
      "𝙋", "𝙧", "𝙍", "𝙨", "𝙎", "𝙩", "𝙏", "𝙪", "𝙐", "𝙫", "𝙑", "𝙬", "𝙒", "𝙭", "𝙓", "𝙮", "𝙔", "𝙯", "𝙕",
      "𝙦", "𝙌"
    ];
  const alphabet10 =  [
    "𝒶́", "𝒶̀", "𝒶̉", "𝒶̃", "𝒶̣", "𝒶̆", "𝒶̆́", "𝒶̆̀", "𝒶̆̉", "𝒶̆̃", "𝒶̣̆", "𝒶̂", "𝒶̂́", "𝒶̂̀", "𝒶̂̉",
    "𝒶̂̃", "𝒶̣̂", "ℯ́", "ℯ̀", "ℯ̉", "ℯ̃", "ℯ̣", "ℯ̂", "ℯ̂́", "ℯ̂̀", "ℯ̂̉", "ℯ̂̃", "ℯ̣̂", "𝒾́", "𝒾̀",
    "𝒾̉", "𝒾̃", "𝒾̣", "ℴ́", "ℴ̀", "ℴ̉", "ℴ̃", "ℴ̣", "ℴ̂", "ℴ̂́", "ℴ̂̀", "ℴ̂̉", "ℴ̂̃", "ℴ̣̂", "ℴ̛",
    "ℴ̛́", "ℴ̛̀", "ℴ̛̉", "ℴ̛̃", "ℴ̛̣", "𝓊́", "𝓊̀", "𝓊̉", "𝓊̃", "𝓊̣", "𝓊̛", "𝓊̛́", "𝓊̛̀", "𝓊̛̉", "𝓊̛̃",
    "𝓊̛̣", "𝓎́", "𝓎̀", "𝓎̉", "𝓎̃", "𝓎̣", "𝒶", "𝒜", "𝒷", "ℬ", "𝒸", "𝒞", "𝒹", "𝒟",
    "ℯ", "ℰ", "𝒻", "ℱ", "ℊ", "𝒢", "𝒽", "ℋ", "𝒾", "ℐ", "𝒿", "𝒥", "𝓴", "𝒦",
    "𝓁", "ℒ", "𝓂", "ℳ", "𝓃", "𝒩", "𝓸", "𝒪", "𝓅", "𝒫", "𝓇", "ℛ",
    "𝓈", "𝒮", "𝓉", "𝒯", "𝓊", "𝒰", "𝓋", "𝒱", "𝔀", "𝒲", "𝔁",
    "𝒳", "𝓎", "𝒴", "𝔃", "𝒵", "𝓆", "𝒬"
    ];
  const alphabet11 = [
    "𝓪́", "𝓪̀", "𝓪̉", "𝓪̃", "𝓪̣", "𝓪̆", "𝓪̆́", "𝓪̆̀", "𝓪̆̉", "𝓪̆̃", "𝓪̣̆", "𝓪̂", "𝓪̂́", "𝓪̂̀", "𝓪̂̉",
    "𝓪̂̃", "𝓪̣̂", "𝓮́", "𝓮̀", "𝓮̉", "𝓮̃", "𝓮̣", "𝓮̂", "𝓮̂́", "𝓮̂̀", "𝓮̂̉", "𝓮̂̃", "𝓮̣̂", "𝓲́", "𝓲̀",
    "𝓲̉", "𝓲̃", "𝓲̣", "𝓸́", "𝓸̀", "𝓸̉", "𝓸̃", "𝓸̣", "𝓸̂", "𝓸̂́", "𝓸̂̀", "𝓸̂̉", "𝓸̂̃", "𝓸̣̂", "𝓸̛",
    "𝓸̛́", "𝓸̛̀", "𝓸̛̉", "𝓸̛̃", "𝓸̛̣", "𝓾́", "𝓾̀", "𝓾̉", "𝓾̃", "𝓾̣",
    "𝓾̛", "𝓾̛́", "𝓾̛̀", "𝓾̛̉", "𝓾̛̃", "𝓾̛̣", "𝔂́", "𝔂̀", "𝔂̉", "𝔂̃",
    "𝔂̣", "𝓪", "𝓐", "𝓫", "𝓑", "𝓬", "𝓒", "𝓭", "𝓓", "𝓮", "𝓔",
    "𝓯", "𝓕", "𝓰", "𝓖", "𝓱", "𝓗", "𝓲", "𝓘", "𝓳", "𝓙", "𝓴", "𝓚",
    "𝓵", "𝓛", "𝓶", "𝓜", "𝓷", "𝓝", "𝓸", "𝓞", "𝓹", "𝓟", "𝓻", "𝓡",
    "𝓼", "𝓢", "𝓽", "𝓣", "𝓾", "𝓤", "𝓿", "𝓥", "𝔀", "𝓦", "𝔁", "𝓧",
    "𝔂", "𝓨", "𝔃", "𝓩", "𝓺", "𝓠"
    ];
  const alphabet12 = [
    "𝕒́", "𝕒̀", "𝕒̉", "𝕒̃", "𝕒̣", "𝕒̆", "𝕒̆́", "𝕒̆̀", "𝕒̆̉", "𝕒̆̃", "𝕒̣̆", "𝕒̂", "𝕒̂́", "𝕒̂̀", "𝕒̂̉",
    "𝕒̂̃", "𝕒̣̂", "𝕖́", "𝕖̀", "𝕖̉", "𝕖̃", "𝕖̣", "𝕖̂", "𝕖̂́", "𝕖̂̀", "𝕖̂̉", "𝕖̂̃", "𝕖̣̂", "𝕚́", "𝕚̀",
    "𝕚̉", "𝕚̃", "𝕚̣", "𝕠́", "𝕠̀", "𝕠̉", "𝕠̃", "𝕠̣", "𝕠̂", "𝕠̂́", "𝕠̂̀", "𝕠̂̉", "𝕠̂̃", "𝕠̣̂", "𝕠̛",
    "𝕠̛́", "𝕠̛̀", "𝕠̛̉", "𝕠̛̃", "𝕠̛̣", "𝕦́", "𝕦̀", "𝕦̉", "𝕦̃", "𝕦̣", "𝕦̛", "𝕦̛́", "𝕦̛̀", "𝕦̛̉", "𝕦̛̃",
    "𝕦̛̣", "𝕪́", "𝕪̀", "𝕪̉", "𝕪̃", "𝕪̣", "𝕒", "𝔸", "𝕓", "𝔹", "𝕔", "ℂ", "𝕕", "𝔻", "𝕖", "𝔼", "𝕗", "𝔽",
    "𝕘", "𝔾", "𝕙", "ℍ", "𝕚", "𝕀", "𝕛", "𝕁", "𝕜", "𝕂", "𝕝", "𝕃", "𝕞", "𝕄", "𝕟", "ℕ", "𝕠", "𝕆", "𝕡",
    "ℙ", "𝕣", "ℝ", "𝕤", "𝕊", "𝕥", "𝕋", "𝕦", "𝕌", "𝕧", "𝕍", "𝕨", "𝕎", "𝕩", "𝕏", "𝕪", "𝕐", "𝕫", "ℤ",
    "𝕢", "ℚ"
    ];
  const alphabet13 =  [
    "𝚊́", "𝚊̀", "𝚊̉", "𝚊̃", "𝚊̣", "𝚊̆", "𝚊̆́", "𝚊̆̀", "𝚊̆̉", "𝚊̆̃", "𝚊̣̆", "𝚊̂", "𝚊̂́", "𝚊̂̀", "𝚊̂̉",
    "𝚊̂̃", "𝚊̣̂", "𝚎́", "𝚎̀", "𝚎̉", "𝚎̃", "𝚎̣", "𝚎̂", "𝚎̂́", "𝚎̂̀", "𝚎̂̉", "𝚎̂̃", "𝚎̣̂", "𝚒́", "𝚒̀",
    "𝚒̉", "𝚒̃", "𝚒̣", "𝚘́", "𝚘̀", "𝚘̉", "𝚘̃", "𝚘̣", "𝚘̂", "𝚘̂́", "𝚘̂̀", "𝚘̂̉", "𝚘̂̃", "𝚘̣̂", "𝚘̛",
    "𝚘̛́", "𝚘̛̀", "𝚘̛̉", "𝚘̛̃", "𝚘̛̣", "𝚞́", "𝚞̀", "𝚞̉", "𝚞̃", "𝚞̣", "𝚞̛", "𝚞̛́", "𝚞̛̀", "𝚞̛̉", "𝚞̛̃",
    "𝚞̛̣", "𝚢́", "𝚢̀", "𝚢̉", "𝚢̃", "𝚢̣", "𝚊", "𝙰", "𝚋", "𝙱", "𝚌", "𝙲", "𝚍", "𝙳", "𝚎", "𝙴", "𝚏", "𝙵",
    "𝚐", "𝙶", "𝚑", "𝙷", "𝚒", "𝙸", "𝚓", "𝙹", "𝚔", "𝙺", "𝚕", "𝙻", "𝚖", "𝙼", "𝚗", "𝙽", "𝚘", "𝙾", "𝚙",
    "𝙿", "𝚛", "𝚁", "𝚜", "𝚂", "𝚝", "𝚃", "𝚞", "𝚄", "𝚟", "𝚅", "𝚠", "𝚆", "𝚡", "𝚇", "𝚢", "𝚈", "𝚣", "𝚉",
    "𝚚", "𝚀"
    ];
  switch (type) {
    case "1":
    case "round":
      return mergeText(alphaUpper, alphabet1);
    case "2":
    case "blackround":
      return mergeText(alphaUpper, alphabet2);
    case "3":
    case "square":
      return mergeText(alphaUpper, alphabet3);
    case "4":
    case "smallbold":
      return mergeText(alphaLower, alphabet4);
    case "5":
    case "bigbold":
      return mergeText(alphaLower, alphabet5);
    case "6":
    case "smallitalic":
      return mergeText(alphaLower, alphabet6);
    case "7":
    case "bigitalic":
      return mergeText(alphaLower, alphabet7);
    case "8":
    case "smallbolditalic":
      return mergeText(alphaLower, alphabet8);
    case "9":
    case "bigbolditalic":
      return mergeText(alphaLower, alphabet9);
    case "10":
    case "smallhand":
      return mergeText(alphaLower, alphabet10);
    case "11":
    case "bighand":
      return mergeText(alphaLower, alphabet11);
    case "12":
    case "new":
      return mergeText(alphaLower, alphabet12);
    case "13":
    case "mono":
      return mergeText(alphaLower, alphabet13);
    default:
      return {};
  }
}

function mergeText(array1, array2) {
  let result = {};
  for (let i = 0; i < array1.length; i++) {
    result[array1[i]] = array2[i];
  }
  return result;
}
