module.exports = {
  event: "playerDestroy",
  run: async (client, player) => {
    if (!player.connection || !player.connection.guildId) return;
    const guild = client.guilds.cache.get(player.connection.guildId);
    if (!guild) return;
  }
}
