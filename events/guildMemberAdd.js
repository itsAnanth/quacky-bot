import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';

export default {
    name: 'guildMemberAdd',
    execute: async(bot, m) => {
        const Lchannels = await db.utils.log_channels();
        const mId = Lchannels.join_leave;
        if (!mId) return;
        const mC = bot.channels.resolve(mId);
        if (!mC) return;
        const embed = new MessageEmbed()
            .setAuthor({ name: m.user.tag, iconURL: m.user.avatarURL() })
            .setTitle('User Joined')
            .setColor('GREEN')
            .setDescription(
                `**Name:** ${m.user.username}
                \n**User ID:** <@${m.id}>
                \n**Created At:** ${Formatters.time(m.user.createdAt)}`)
            .setFooter({ text: `Member Count: ${m.guild.memberCount}` })
            .setTimestamp();
        await mC.send({ embeds: [embed] }).catch(console.error);
    }
};

