module.exports = async (client) => {
    const giveawayModel = require("../models/giveawaySchema");
    const { handleGiveawayReaction } = require('../handlers/BacklistGiveaways');
    const { GiveawaysManager } = require('discord-giveaways');
  
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
      async getAllGiveaways() {
        return await giveawayModel.find().lean().exec();
      }
  
      async saveGiveaway(messageId, giveawayData) {
        await giveawayModel.create(giveawayData);
        return true;
      }
  
      async editGiveaway(messageId, giveawayData) {
        await giveawayModel.updateOne({ messageId }, giveawayData).exec();
        return true;
      }
  
      async deleteGiveaway(messageId) {
        await giveawayModel.deleteOne({ messageId }).exec();
        return true;
      }
    };
  
    const manager = new GiveawayManagerWithOwnDatabase(client, {
      options: {
        giveaway: "💝💝Give Away💝💝",
        forceUpdateEvery: 1,
        endedGiveawaysLifetime: 259200000
      },
      default: {
        botsCanWin: false,
        embedColor: '#FFCC00',
        embedColorEnd: '#000000',
        reaction: '901921067944271912'
      }
    });
  
    client.giveawaysManager = manager;
  
    manager.on('BacklistGiveaways', async (giveaway, member, reaction) => {
      await handleGiveawayReaction(giveaway, member, reaction);
    });
  
    return manager; // Return the manager
  };
  
