const { getAudioUrl } = require("google-tts-api");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionState,
} = require("@discordjs/voice");

let speak = false;

module.exports = {
  name: 'talk',
  aliases: ['t', 'tts'],
  category: 'Utils',
  cooldown: 2,
  description: {
    content: 'Tính năng dành cho người câm !',
    example: 'talk hello bro',
    usage: 'talk <content>'
  },
  permissions: {
    bot: ['ViewChannel', 'SendMessages'],
    user: ''
  },
  run: async (client, message, args, prefix, lang) => {
    let languages = {
      vi: "vi",
      en: "en",
      fr: "fr",
      de: "de",
      it: "it",
      ko: "ko",
      chi: "zh-CN",
      ja: "ja",
      ru: "ru",
    };

    let langs = languages[args[0]];
    let text = args.join(" ");
    if (langs) text = args.slice(1).join(" ");
    if (!langs) langs = "vi";

    const { channel } = message.member.voice;
    const botvc = await message.guild.members.me.voice.channel;

    /*if (speak) {
      await message.react(client.e.fail);
      return message.channel.send({
        content: lang.utils.talk_5.replace(
          "{value}", 
          message.member.displayName
        ),
      }).then(async (ctx) => {
        await client.sleep(5000);
        await ctx.delete();
      });
    }*/

    const player = client.queue.get(message.guild.id);
    if (player) {
      return await message.channel.send({
        content: `${client.e.fail} | Bot đang phát nhạc không thể nói vào lúc này!`
      });
    }

    if (!channel) {
      return message.channel.send({
        content: lang.utils.talk_1.replace(
          "{value}",
          message.member.displayName,
        ),
      });
    }

    if (botvc && channel.id !== botvc.id) {
      return message.channel.send({
        content: lang.utils.talk_2
          .replace("{value1}", message.member.displayName)
          .replace("{value2}", `<#${botvc.id}>`),
      });
    }

    if (!args[0]) {
      return message.channel.send({
        content: lang.utils.talk_3.replace(
          "{value}",
          message.member.displayName,
        ),
      });
    }

    if (text.length > 200) {
      return message.channel.send({
        content: lang.utils.talk_4.replace(
          "{value}",
          message.member.displayName,
        ),
      });
    }

    let timeout;

    clearTimeout(timeout);

    try {
      const audio = await getAudioUrl(text, {
        lang: langs,
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      });
      await message.react(client.e.mic);

      const voiceConnect = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      const resource = createAudioResource(audio);
      const tts = createAudioPlayer();

      speak = true;

      tts.on(AudioPlayerStatus.Idle, () => {
        return
        speak = false;
        timeout = setTimeout(() => {
          if (voiceConnect) {
            try {
              message.guild.members.me.voice.disconnect();
              message.channel.send({
                content: lang.utils.talk_6.replace(
                  "{value}",
                  message.member.displayName,
                ),
              });
            } catch (error) {
              client.logger.error(`Error while destroying voiceConnect: ${error.stack}`);
            }
          }
        }, 360000);
      });

      tts.on("error", (error) => {
        client.logger.error(`Lỗi khi xử lý ngôn ngữ giọng nói: ${error.stack}`);
        speak = false;
        if (voiceConnect) {
          try {
            message.guild.members.me.voice.disconnect();
          } catch (error) {
            client.logger.error(`Error while destroying voiceConnect on error: ${error.stack}`);
          }
        }
      });

      voiceConnect.subscribe(tts);
      tts.play(resource);
    } catch (e) {
      speak = false;
      client.logger.error(e.stack);
      message.channel.send({
        content: lang.utils.talk_7.replace("{error}", e.message),
      });
    }
  },
};