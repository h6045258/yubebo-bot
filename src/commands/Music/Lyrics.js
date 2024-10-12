const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "lyrics",
    aliases: ["loinhac", "lyric", "lr"],
    cooldown: 3,
    category: "Music",
    description: {
        content: "Hiển thị lời của bài nhạc",
        examples: ["lyrics"],
        usage: "lyrics",
    },
    run: async (client, message, args, prefix) => {

        const search = args.join(" ");
        const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(search)}`;

        const response = await fetch(searchUrl, {
            headers: {
                Authorization: `Bearer 1UWi9nSkqUj893f0Yi4op9IIwxPiX5J9MgFku2dm-hj2G_vIY8D4q3I9Ulv_HsU6`
            }
        });

        if (!response.ok) {
            throw new Error(`API yêu cầu thất bại: ${response.status}`);
        }

        const data = await response.json();
        const hits = data?.response?.hits ?? [];
        if (hits.length === 0) {
            return message.channel.send(`${client.e.fail} | Lỗi, không tìm thấy lyric cho bài ${search}`);
        }

        const song = hits[0].result;
        const artistName = song.primary_artist?.name;
        const songPath = song.path;
        const lyricsUrl = `https://genius.com${songPath}`;
        const thumbnailUrl = song.song_art_image_thumbnail_url;
        const lyricsPageResponse = await fetch(lyricsUrl);
        if (!lyricsPageResponse.ok) {
            throw new Error(`Đọc lyric thất bại: ${lyricsPageResponse.status}`);
        }
        const lyricsPageHtml = await lyricsPageResponse.text();
        const $ = cheerio.load(lyricsPageHtml);
        let lyricsRaw = $('.lyrics').text().trim() || $('[data-lyrics-container]').text().trim();
        if (!lyricsRaw) {
            return message.channel.send(`${client.e.fail} | Không tìm thấy lyric cho bài ${search}`);
        }

        lyricsRaw = lyricsRaw
            .replace(/([.?!])/g, '$1\n')
            .replace(/(\[.*?\])/g, '\n$1\n')
            .replace(/([a-z])([A-Z])/g, '$1\n$2')
            .replace(/(\p{L})(\p{Lu})/gu, '$1\n$2')
            .replace(/\)(?=\S)/g, ')\n');
        const lyricsLines = lyricsRaw.split('\n').map(line => line.trim()).filter(line => line);
        const formattedLyrics = lyricsLines.map(line => {
            if (line.startsWith('[') && line.endsWith(']')) {
                return `\n**${line}**\n`;
            }
            return line;
        });
        const b1 = new ButtonBuilder()
            .setCustomId('previous')
            .setEmoji(client.e.swap_page.previous)
            .setStyle(ButtonStyle.Secondary);
        const b2 = new ButtonBuilder()
            .setCustomId('rewind')
            .setEmoji(client.e.swap_page.rewind)
            .setStyle(ButtonStyle.Secondary);
        const b3 = new ButtonBuilder()
            .setCustomId('stop')
            .setEmoji(client.e.swap_page.home)
            .setStyle(ButtonStyle.Danger);
        const b4 = new ButtonBuilder()
            .setCustomId('forward')
            .setEmoji(client.e.swap_page.forward)
            .setStyle(ButtonStyle.Secondary);
        const b5 = new ButtonBuilder()
            .setCustomId('skip')
            .setEmoji(client.e.swap_page.skip)
            .setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(b1, b2, b3, b4, b5);
        const linesPerPage = 15;
        const chunks = [];
        for (let i = 0; i < formattedLyrics.length; i += linesPerPage) {
            chunks.push(formattedLyrics.slice(i, i + linesPerPage));
        }
        const pages = chunks.map((chunk, index) => client.embed()
            .setColor(client.color.y)
            .setAuthor({ name: search.toUpperCase(), iconURL: message.guild.iconURL({}) })
            .setDescription(chunk.join("\n"))
            .setThumbnail(thumbnailUrl)
            .addFields({ name: `Nghệ Sĩ`, value: artistName })
            .setFooter({ text: `Trang ${index + 1} / ${chunks.length}`, iconURL: message.member.displayAvatarURL({}) })
        );
        let currentPage = 0;
        const updateButtons = () => {
            b1.setDisabled(currentPage === 0);
            b2.setDisabled(currentPage === 0);
            b4.setDisabled(currentPage === pages.length - 1);
            b5.setDisabled(currentPage === pages.length - 1);
            row.setComponents(b1, b2, b3, b4, b5);
        };
        updateButtons();
        const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [row] });
        const collector = msg.createMessageComponentCollector({ time: 180000 });
        collector.on('collect', async (b) => {
            if (b.user.id !== message.author.id) {
                await b.reply({ content: `${client.e.fail} | Bạn không có quyền điều khiển, hãy dùng lệnh \`lyric\` nếu bạn muốn sử dụng!`, ephemeral: true });
                return;
            }
            switch (b.customId) {
                case 'previous':
                    currentPage = 0;
                    break;
                case 'rewind':
                    currentPage = currentPage > 0 ? currentPage - 1 : currentPage;
                    break;
                case 'stop':
                    b1.setDisabled(true);
                    b2.setDisabled(true);
                    b3.setDisabled(true);
                    b4.setDisabled(true);
                    b5.setDisabled(true);
                    row.setComponents(b1, b2, b3, b4, b5);
                    await message.edit({ components: [row] });
                    b.deferUpdate();
                    return;
                case 'forward':
                    currentPage = currentPage < pages.length - 1 ? currentPage + 1 : currentPage;
                    break;
                case 'skip':
                    currentPage = pages.length - 1;
                    break;
                default:
                    break;
            }
            updateButtons();
            await b.update({ embeds: [pages[currentPage]], components: [row] });
        });
        collector.on('end', async () => {
            await msg.edit({ components: [] });
        });
    }
};