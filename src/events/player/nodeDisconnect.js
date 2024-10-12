module.exports = {
  event: "nodeDisconnect",
  run: async (client, node, count) => {
    client.logger.error(`Node ${node} đã bị ngắt kết nối ${count} lần.`)
  }
}