import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';

export default {
    name: 'voiceStateUpdate',
    execute: async(bot, oldMember, newMember) => {
        const Lchannels = await db.utils.log_channels();
        const mId = Lchannels.voiceupdate;
        if (!mId) return;
        const mC = bot.channels.resolve(mId);
        if (!mC) return;
        const type = newMember.channelId ? 'Joined' : 'Left';
        const embed = new MessageEmbed()
            .setTitle('Voice State Update')
            .setColor(type == 'Joined' ? 'GREEN' : 'NOT_QUITE_BLACK')
            .setDescription(`<@${newMember.id}> ${type} VC
                \n**Channel:** ${Formatters.channelMention(newMember.channelId ? newMember.channelId : oldMember.channelId)}`)
            .setFooter({ text: `User ID: ${newMember.id}` })
            .setTimestamp();
        await mC.send({ embeds: [embed] }).catch(console.error);
    }
};

