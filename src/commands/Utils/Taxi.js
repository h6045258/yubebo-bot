const { PermissionsBitField } = require('discord.js')
const taxiSchema = require('../../models/taxiSchema')
module.exports = {
    name: 'taxi',
    aliases: ['go'],
    cooldown: 3,
    category: 'Utils',
    description: {
        content: 'Đưa bạn đi muôn nơi',
        example: 'taxi chat, sẽ đưa bạn đến kênh chat',
        usage: 'taxt <channel setting> (Kênh đã lưu trong hệ thống)'
    },
    permissions: {
       bot: ['ViewChannel', 'SendMessages'],
       user: ''
    },
    run: async (client, message, args, prefix, lang) => {

        let emojis = [
            '<a:Yvayduoi1:924665323578359888>',
            '<a:Ymeonhay:902835820094971924>',
            '<a:Ykimcuonglaplanh:922597979146313830>',
            '<a:yhug:903753945397231726>',
            '<a:Ydosat:919967409190862858>',
            '<a:Ybutterfly:911682101005398058>',
            '<a:Yaibietjdou:915376724152287342>',
        ];
        let emoji = emojis[Math.floor(Math.random() * emojis.length)];
        let job = args[0]
        if (!job) {
            let missingJob = 
                `1. Nếu bạn có quyền quản lý trong server :
- Gõ Ytaxi new [ID CHANNEL] [TAG] để tạo lối tắt đến kênh
Ví dụ: Ytaxi new 123456789 main
2. Sau đó sử dụng bằng cách
- Gõ Ygo main => Tôi sẽ đưa link kênh cho bạn mà không cần phải lướt danh sách kênh.
3. Ngoài ra bạn có thể check các tag đã tạo bằng Ygo list`
            message.channel.send(missingJob)
        }
        else if (job == 'new') {
            let errorMissingPerm = `Bạn phải có quyền quản lý mới được tạo lệnh taxi mới!`
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !allowedUserIDs.includes(message.author.id)) return await message.channel.send(errorMissingPerm)
            let idchannel = args[1]
            let errorMissingChannel = 
                `Thiếu ID hoặc ID channel không đúng! 
Cú Pháp : \`Ytaxi new [channelid] [tag]\`
VD : Ytaxi new 123456789 mainchat`
            if (!idchannel) return await message.channel.send(errorMissingChannel).catch(e => console.log(e))
            let tag = args[2]
            let errorTag =
                `Thiếu tag channel ! 
Cú Pháp : \`Ytaxi new [channelid] [tag]\`
VD : Ytaxi new 123456789 mainchat`
            if (!tag) return await message.channel.send(errorTag).catch(e => console.log(e))
            const guild = await taxiSchema.findOne({ guildid: `${message.guild.id}_${tag}` })
            const list = await taxiSchema.findOne({ guildid: message.guild.id })
            if (!list) {
                const newlist = new taxiSchema({ guildid: message.guild.id, channelid: `LIST`, tag: args[2] })
                await newlist.save()
            } else {
                list.tag += `\`${args[2]}\` `
                await list.save()
            }
            let errorExist = 
                `Bạn đã tạo lối tắt có tag : **${tag}** rồi! Hãy sử dụng tên khác!`
            if (guild) return await message.channel.send(errorExist).catch(e => console.log(e))

            const newtag = new taxiSchema({ guildid: `${message.guild.id}_${tag}`, channelid: args[1], tag: args[2] })
            await newtag.save()
            let success = 
                `Bạn đã tạo lối tắt **${tag}** cho kênh <#${idchannel}>! Dùng lệnh : Ygo **${tag}** sẽ dẫn đến kênh này!
\`Dùng lệnh Ygo list để xem các tag trong server!\``
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (job == 'delete' || job == 'xoa') {
            let errorMissingPerm = 
                `Bạn phải có quyền quản lý mới được tạo lệnh taxi mới!`
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await message.channel.send(errorMissingPerm)
            let tag = args[1]
            let errorTag = 
                `Thiếu tag channel ! 
Cú Pháp : \`Ytaxi xoa [tag]\`
VD : Ytaxi xoa mainchat`
            if (!tag) return await message.channel.send(errorTag).catch(e => console.log(e))
            const guild = await taxiSchema.findOne({ guildid: `${message.guild.id}_${tag}` })
            const errorTag2 =
                `Không có **${tag}** rồi! Hãy check lại list taxi bằng lệnh Ytaxi list!`
            if (!guild) return await message.channel.send(errorTag2).catch(e => console.log(e))
            const list = await taxiSchema.findOne({ guildid: message.guild.id })
            if (list) {
                const string = list.tag
                list.tag = string.replace(`\`${args[1]}\` `, ``)
                await list.save()
            }
            await taxiSchema.deleteOne({ guildid: `${message.guild.id}_${tag}` })
            const success = 
                `Bạn đã xóa lối tắt **${tag}** Dùng lệnh : Ygo list để xem danh sách tag còn lại trong server!`
            await message.channel.send(success).catch(e => console.log(e))
        }
        else if (job == `list`) {
            const list = await taxiSchema.findOne({ guildid: message.guild.id })
            let listed = []
            if (list) listed = list.tag
            const listedMSG = 
                `Danh sách các tag dùng được trong server : 
**${listed}**`
            await message.channel.send(listedMSG).catch(e => console.log(e))
        }
        else {
            const tag = args[0]
            const place = await taxiSchema.findOne({ guildid: `${message.guild.id}_${tag}` })
            const errorTag2 = 
                `Không tìm thấy lối tắt **${tag}**, hãy tạo bằng lệnh : Ytaxi new [channel ID] [tag]`
            if (!place) return await message.channel.send(errorTag2)
            const id = place.channelid
            const success = 
                `🚕 | Mời bạn đến <#${id}> ${emoji}`
            await message.channel.send(success).catch(e => console.log(e))
        }
    }
}