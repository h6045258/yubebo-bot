const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const blackjack = require('../../functions/Blackjack');
const _ = require('lodash');

module.exports = {
    name: 'blackjack',
    aliases: ['bj', '21'],
    category: 'Gambling',
    cooldown: 15,
    description: {
        content: 'Chơi blackjack kiếm tiền',
        example: 'blackjack 10000 tối đa 250,000',
        usage: 'blackjack <số tiền>'
    },
    permissions: {
        bot: ['ViewChannel', 'SendMessages'],
        user: ''
    },
    run: async (client, message, args, prefix, lang) => {
        const user = message.member;

        const hitButton = new ButtonBuilder()
            .setCustomId('hit')
            .setLabel('🎲 Bốc Thêm')
            .setStyle(ButtonStyle.Success);
        const standButton = new ButtonBuilder()
            .setCustomId('stand')
            .setLabel('🛑 Bỏ Bài')
            .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder()
            .addComponents(hitButton, standButton);
        let pre = args[0];

        const player_1 = await blackjack(client, 11);
        const player_2 = await blackjack(client, 11);
        const player_3 = await blackjack(client, 11);
        const player_4 = await blackjack(client, 11);
        const player_5 = await blackjack(client, 11);

        const dealer_1 = await blackjack(client, 11);
        const dealer_2 = await blackjack(client, 11);
        const dealer_3 = await blackjack(client, 11);
        const dealer_4 = await blackjack(client, 11);
        const dealer_5 = await blackjack(client, 11);

        let display = `${player_1.id} ${player_2.id}`;
        let dl_display = `${dealer_1.id} ${dealer_2.id}`;
        let pl_point = parseInt(player_1.value) + parseInt(player_2.value);
        let dl_point = parseInt(dealer_1.value) + parseInt(dealer_2.value);
        let bal = await client.cash(message.author.id);

        if (args[0] == 'all') {
            if (bal > 250000) {
                pre = 250000;
            } else pre = bal;
        }

        if (pre > 250000) {
            pre = 250000;
        }

        if (!pre) {
            return message.channel.send(`${client.e.fail} **| ${user.displayName}**, Bạn chưa nhập số ${client.e.coin} Ycoin cược để bắt đầu chơi!`).then(async msg => {
                await client.sleep(10000);
                await msg.delete();
            });
        } else if (pre > 0 && pre != undefined && pre <= bal) {
            let turn = 1;
            let end = 0;
            let dl_turn = 0;
            let win = 0;
            let tier = 0;
            let reward = 0;

            if ((player_1.value == 11 && (player_2.value == 10 || player_2.value == 11)) || ((player_1.value == 10 || player_1.value == 11) && player_2.value == 11)) {
                const screen_game = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `${user.displayName}, bạn đã cược ${pre.toLocaleString()} để chơi xì dách`, iconURL: message.member.displayAvatarURL() })
                    .setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Dealer** [${dl_point}]\n${dealer_1.id} ${dealer_2.id}`);

                if (player_1.value == 11 && player_2.value == 11) {
                    reward = pre * 2;
                } else {
                    reward = pre * 2;
                }

                screen_game.setFooter({ text: `🎲 ~ Bạn đã thắng ${reward.toLocaleString()} Ycoin với xì dzách!` });
                message.channel.send({ embeds: [screen_game] });
                await client.cong(message.author.id, parseInt(reward));
            } else if ((dealer_1.value == 11 && (dealer_2.value == 10 || dealer_2.value == 11)) || ((dealer_1.value == 10 || dealer_1.value == 11) && dealer_2.value == 11)) {

                const screen_game = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `${user.displayName}, bạn đã cược ${pre.toLocaleString()} để chơi xì dách`, iconURL: message.member.displayAvatarURL() })
                    .setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Dealer** [${dl_point}]\n${dealer_1.id} ${dealer_2.id}`)
                    .setFooter({ text: `🎲 ~ Bạn đã thua ${pre.toLocaleString()} Ycoin, Dealer có xì dzách!` });

                message.channel.send({ embeds: [screen_game] });
                await client.tru(message.author.id, parseInt(pre));
            } else {
                const screen_game = client
                    .embed()
                    .setColor(client.color.y)
                    .setAuthor({ name: `${user.displayName}, bạn đã cược ${pre.toLocaleString()} để chơi xì dách`, iconURL: message.member.displayAvatarURL() })
                    .setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [ ${dealer_1.value} + ? ]\n${dealer_1.id} <:backcard:954209816912486440>`)
                    .setFooter({ text: '🎲 rút bài 🛑 bỏ bài' });

                const msg = await message.channel.send({ embeds: [screen_game], components: [row] });

                const filter = i => i.isButton() && i.user.id === message.author.id;

                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 300000
                });

                collector.on("collect", async i => {
                    if (!i.isButton()) return;
                    if (i.user.id != message.member.id) return i.reply({ content: `${client.e.fail} | Bạn không có quyền sử dụng phím điều khiển, dùng lệnh ${prefix}blackjack để bắt đầu chơi!`, ephemeral: true });
                    if (i.customId === "hit") {
                        if (end == 0) {
                            if (pl_point < 21 && pl_point > 0 && turn == 1) {
                                pl_point = pl_point + parseInt(player_3.value)
                                display = `${player_1.id} ${player_2.id} ${player_3.id}`;
                                if (pl_point < 21) turn++;
                                else if (pl_point > 21 && player_3.value != 11) {
                                    if (player_1.value == 11 || player_2.value == 11) {
                                        pl_point = pl_point - 10;
                                        turn++;
                                    }
                                    else if (player_1.value != 11 && player_2.value != 11) {
                                        end = 1;
                                        dl_turn = 1;
                                    }
                                } else if (pl_point > 21 && player_3.value == 11) {
                                    pl_point = pl_point - 10;
                                    turn++;
                                }
                            }
                            else if (pl_point < 21 && pl_point > 0 && turn == 2) {
                                pl_point = pl_point + parseInt(player_4.value);
                                display = `${player_1.id} ${player_2.id} ${player_3.id} ${player_4.id}`;
                                if (pl_point < 21) turn++;
                                else if (pl_point > 21 && player_4.value != 11) {
                                    end = 1;
                                    dl_turn = 1;
                                } else if (pl_point > 21 && player_4.value == 11) {
                                    pl_point = pl_point - 10;
                                    turn++;
                                }
                            }
                            else if (pl_point < 21 && pl_point > 0 && turn == 3) {
                                pl_point = pl_point + parseInt(player_5.value)
                                display = `${player_1.id} ${player_2.id} ${player_3.id} ${player_4.id} ${player_5.id}`;
                                if (pl_point < 21)
                                    win = 1,
                                        end = 1,
                                        dl_turn = 1,
                                        reward = pre * 2,
                                        await client.cong(message.author.id, parseInt(reward));
                                else if (pl_point > 21 && player_5.value != 11) {
                                    end = 1;
                                    dl_turn = 1;
                                } else if (pl_point > 21 && player_5.value == 11) {
                                    pl_point = pl_point - 10;
                                    win = 1, end = 1, dl_turn = 1;
                                    reward = pre * 2,
                                        await client.cong(message.author.id, parseInt(reward));
                                }
                            }
                            if (dl_turn = 1) {
                                if (dl_point < 17) {
                                    dl_point = dl_point + parseInt(dealer_3.value)
                                    dl_display = `${dealer_1.id} ${dealer_2.id} ${dealer_3.id}`;
                                    if (dl_point > 21 && dealer_3.value == 11) dl_point = dl_point - 10;
                                    else if (dl_point > 21 && dealer_3.value != 11) {
                                        if (dealer_1.value == 11 || dealer_2.value == 11) {
                                            dl_point = dl_point - 10;
                                        }
                                    }
                                    if (dl_point < 17) {
                                        dl_point = dl_point + parseInt(dealer_4.value)
                                        dl_display = `${dealer_1.id} ${dealer_2.id} ${dealer_3.id} ${dealer_4.id}`;
                                        if (dl_point > 21 && dealer_4.value == 11) {
                                            dl_point = dl_point - 10;
                                        }
                                        if (dl_point < 17) {
                                            dl_point = dl_point + parseInt(dealer_5.value)
                                            dl_display = `${dealer_1.id} ${dealer_2.id} ${dealer_3.id} ${dealer_4.id} ${dealer_5.id}`;
                                            if (dl_point > 21 && dealer_5.value == 11) {
                                                dl_point = dl_point - 10;
                                            }
                                        }
                                    }
                                }
                            }
                            if (end == 0) {
                                screen_game.setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [${dealer_1.value} + ?]\n${dealer_1.id} <:backcard:954209816912486440>`);
                                await i.update({ embeds: [screen_game] });
                            } else if (end == 1) {
                                if ((pl_point > dl_point && pl_point <= 21) || (pl_point < dl_point && dl_point > 21 && pl_point <= 21)) {
                                    win = 1;
                                    reward = pre;
                                    await client.cong(message.author.id, parseInt(reward));
                                } else if (pl_point < dl_point && pl_point <= 21) {
                                    lose = 1;
                                } else if ((pl_point == dl_point && pl_point <= 21) || (pl_point == dl_point && pl_point > 21) || (pl_point > 21 && dl_point > 21)) tier = 1;

                                if (win == 1) {
                                    screen_game.setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [${dl_point}]\n${dl_display}`);
                                    screen_game.setFooter({ text: `🎲 ~ Bạn đã thắng ${reward.toLocaleString()} Ycoin!` });
                                    await i.update({ embeds: [screen_game], components: [] });
                                } else if (tier == 1) {
                                    screen_game.setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [${dl_point}]\n${dl_display}`);
                                    screen_game.setFooter({ text: `🎲 ~ Bạn và Yubabe hòa` });
                                    await i.update({ embeds: [screen_game], components: [] });
                                } else {
                                    await client.tru(message.author.id, parseInt(pre));
                                    screen_game.setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [${dl_point}]\n${dl_display}`);
                                    screen_game.setFooter({ text: `🎲 ~ Bạn đã thua ${pre.toLocaleString()} Ycoin!` });
                                    await i.update({ embeds: [screen_game], components: [] });
                                }
                            }
                        }
                    } else if (i.customId === "stand") {
                        if (end == 0) {
                            end = 1;
                            dl_turn = 1;
                            const safeDrawCard = () => {
                                let remainingDeck = client.blackjack.filter(card => dl_point + card.value <= 21);
                                if (remainingDeck.length === 0) return null;
                                return _.sample(remainingDeck);
                            };
                            const moveToNextCard = (currentCard, nextCard) => {
                                currentCard = nextCard;
                            };
                            const shouldDealerDrawMore = (point) => {
                                const dealerPosibilities = { 21: 0.5, 20: 0.5, 19: 0.4, 18: 0.3 };
                                return Math.random() < (dealerPosibilities[point] || 0.1);
                            };

                            while (dl_point < 17) {
                                let new_card = safeDrawCard();
                                if (new_card === null) break;
                                let new_card_value = parseInt(new_card.value);
                                dl_point += new_card_value;
                                dl_display += ` ${new_card.id}`;
                                if (dl_point > 21 && new_card.value == 11) {
                                    dl_point -= 10;
                                }
                                moveToNextCard(dealer_3, dealer_4);
                                moveToNextCard(dealer_4, dealer_5);
                                if (dl_point > 21) {
                                    break;
                                }
                            }

                            while (dl_point <= 21 && dl_point <= pl_point) {
                                if (dl_point >= 18 && (!shouldDealerDrawMore(dl_point))) break;
                                let new_card = safeDrawCard();
                                if (new_card === null) break;
                                let new_card_value = parseInt(new_card.value);
                                dl_point += new_card_value;
                                dl_display += ` ${new_card.id}`;
                                if (dl_point > 21 && new_card.value == 11) {
                                    dl_point -= 10;
                                }
                                moveToNextCard(dealer_3, dealer_4);
                                moveToNextCard(dealer_4, dealer_5);
                            }

                            if (pl_point <= 21 && (pl_point > dl_point || dl_point > 21)) {

                                win = 1;
                                reward = pre;
                                await client.cong(message.author.id, parseInt(reward));
                            } else if (dl_point <= 21 && (dl_point > pl_point || pl_point > 21)) {

                                lose = 1;
                            } else if (pl_point == dl_point) {

                                tier = 1;
                            }

                            if (win == 1) {
                                screen_game.setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [${dl_point}]\n${dl_display}`);
                                screen_game.setFooter({ text: `🎲 ~ Bạn đã thắng ${reward.toLocaleString()} Ycoin!` });
                                await i.update({ embeds: [screen_game], components: [] });
                            } else if (tier == 1) {
                                screen_game.setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [${dl_point}]\n${dl_display}`);
                                screen_game.setFooter({ text: `🎲 Bạn và Yubabe hòa` });
                                await i.update({ embeds: [screen_game], components: [] });
                            } else {
                                await client.tru(message.author.id, parseInt(pre));
                                screen_game.setDescription(`**${user.displayName}** [${pl_point}]\n${display}\n**Yubabe** [${dl_point}]\n${dl_display}`);
                                screen_game.setFooter({ text: `🎲 ~ Bạn đã thua ${pre.toLocaleString()} Ycoin!` });
                                await i.update({ embeds: [screen_game], components: [] });
                            }
                        }
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (collected.size < 0) {
                        screen_game.setDescription(`Đã hết thời gian chơi, bạn không bị trừ tiền`);
                        screen_game.setFooter({ text: `Game đã kết thúc.` });
                        msg.edit({ embeds: [screen_game], components: [] });
                    } else if (collected.size > 2) {
                        screen_game.setDescription(`Hết thời gian chơi, nhưng trước đó bạn có chơi nhưng không thao tác, bạn bị trừ 10% tổng giá trị cược!`);
                        screen_game.setFooter({ text: `Game đã kết thúc` });
                        msg.edit({ embeds: [screen_game], components: [] });
                    }
                });
            }
        } else {
            message.channel.send(`**${client.e.fail} | ${user.displayName}**, Bạn không đủ ${client.e.coin} Ycoin để chơi.`).then(async msg => {
                await client.sleep(10000);
                await msg.delete();
            });
        }
        client.usedSuccess.set(message.author.id, true);
    },
}