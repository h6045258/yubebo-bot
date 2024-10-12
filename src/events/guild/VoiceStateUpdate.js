const { ChannelType } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionState,
} = require("@discordjs/voice");

module.exports = {
  event: "voiceStateUpdate",
  run: async (client, oldState, newState) => {



    const guildId = newState.guild.id;
    if (!guildId) return;
    const player = client.queue.get(guildId);
    if (!player) return;
    if (newState.guild.members.cache.get(client.user.id) && !newState.guild.members.cache.get(client.user.id).voice.channelId) {
      if (player) {
        player.destroy();
      }
    }
    if (newState.id === client.user.id && newState.channelId && newState.channel.type == ChannelType.GuildStageVoice && newState.guild.members.me.voice.suppress) {
      if (newState.guild.members.me.permissions.has(['Connect', 'Speak']) || newState.channel.permissionsFor(newState.guild.members.me).has('MuteMembers')) {
        await newState.guild.members.me.voice.setSuppressed(false).catch(() => { });
      }
    }
    if (newState.id == client.user.id) return;
    const vc = newState.guild.channels.cache.get(
      player.node.manager.connections.get(newState.guild.id).channelId
    );
    if (
      newState.id === client.user.id &&
      !newState.serverDeaf &&
      vc &&
      vc.permissionsFor(newState.guild.member.me).has("DeafenMembers")
    )
      await newState.setDeaf(true);
    if (
      newState.id === client.user.id &&
      newState.serverMute &&
      !player.paused
    )
      player.pause();
    if (
      newState.id === client.user.id &&
      !newState.serverMute &&
      player.paused
    )
      player.pause();
    let voiceChannel = newState.guild.channels.cache.get(
      player.node.manager.connections.get(newState.guild.id).channelId
    );
    if (newState.id === client.user.id && newState.channelId === null)
      return;
    if (!voiceChannel) return;
  },
}