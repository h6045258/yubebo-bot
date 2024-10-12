const trungThuItem = require("../configs/trungThuItem.json");

const handleRewardTrungThu = async (client, userId) => {
    const rewardKeys = Object.keys(trungThuItem);
    const [, que, giay, mau, nen, bangkeo, ] = rewardKeys;
    const rewardKeysDestructuring = [que, giay, mau, nen, bangkeo];
    const randomReward = Math.floor(Math.random() * rewardKeysDestructuring.length);
    const reward = rewardKeysDestructuring[randomReward];
    const rewardName = client.trungthu(reward).name;
    const rewardEmoji = client.trungthu(reward).emoji;

    const objFuncTrungThu = {
        //"longdenchongnuoc": async () => { },
        "que": async () => { client.congItemTrungThu(userId, reward, 1); },
        "giay": async () => { client.congItemTrungThu(userId, reward, 1); },
        "mau": async () => { client.congItemTrungThu(userId, reward, 1); },
        "nen": async () => { client.congItemTrungThu(userId, reward, 1); },
        "bangkeo": async () => { client.congItemTrungThu(userId, reward, 1); },
        //"batlua": async () => { },
    };

    await objFuncTrungThu[reward]();

    return {
        rewardName: rewardName,
        rewardEmoji: rewardEmoji
    };
};

module.exports = { handleRewardTrungThu };