import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';

export default {
    name: 'guildMemberUpdate',
    execute: async(bot, oldMember, newMember) => {
        const Lchannels = await db.utils.log_channels();
        const mId = Lchannels.roleupdate;
        if (!mId) return;
        const mC = bot.channels.resolve(mId);
        if (!mC) return;
        if (oldMember.roles.cache.size != newMember.roles.cache.size) {
            const type = oldMember.roles.cache.size > newMember.roles.cache.size ? 'removed' : 'added';

            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE',
            });

            const roleAddLog = fetchedLogs.entries.first();
            if (!roleAddLog) return;
            const { executor, target, changes } = roleAddLog;
            const embed = new MessageEmbed()
                .setAuthor({ name: newMember.user.username, iconURL: newMember.user.avatarURL() })
                .setTitle(`Role ${type}`)
                .setColor('BLUE')
                .setDescription(`**Role:** ${Formatters.roleMention(changes[0].new[0].id)}
                \n**Author:** <@${executor.id}>`)
                .setFooter({ text: `User ID: ${target.id}` })
                .setTimestamp();
            await mC.send({ embeds: [embed] }).catch(console.error);
        }
    }
};

