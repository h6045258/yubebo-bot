module.exports = {
    event: "rateLimit",
    run: async (client, rateLimitData) => {
      console.warn(JSON.stringify(rateLimitData, null, 2))
    },
};
