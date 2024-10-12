module.exports = {
  event: "nodeDestroy",
  run: async (client, node, code, reason) => {
    client.logger.error(`Node ${node} đã bị destroy với code ${code}, với lý do ${reason}.`);
  }
}