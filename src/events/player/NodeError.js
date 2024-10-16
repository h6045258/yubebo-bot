module.exports = {
  event: "nodeError",
  run: async (client, node, error) => {
    client.logger.error(`Node ${node} xảy ra lỗi:\n${JSON.stringify(error)}.`)
  }
}
