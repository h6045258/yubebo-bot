const fs = require('fs');
const _ = require('lodash');

const blackjack = (client, range = 11) => {
    if (!client || !client.blackjack) return null;
    return _.sample(client.blackjack.filter(card => card.value <= range));
};

module.exports = blackjack;