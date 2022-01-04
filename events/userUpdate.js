import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';

export default {
    name: 'userUpdate',
    execute: async(bot, oldMember, newMember) => {
        if (oldMember && oldMember.user && newMember.user.tag && oldMember.user.tag != newMember.user.tag)
            handleUserUpdate(bot, oldMember, newMember);
    }
};

async function handleUserUpdate(bot, oldMember, newMember) {
    const Lchannels = await db.utils.log_channels();
    const mId = Lchannels.userupdate;
    if (!mId) return;
    const mC = bot.channels.resolve(mId);
    if (!mC) return;

    const embed = new MessageEmbed()
        .setAuthor({ name: newMember.user.user.username, iconURL: newMember.user.user.avatarURL() })
        .setTitle('Username Changed')
        .setColor('BLUE')
        .setDescription(`**Before:** ${Formatters.codeBlock(oldMember.user.tag)}\n**After:** ${Formatters.codeBlock(newMember.user.tag)}`)
        .setFooter({ text: `User ID: ${newMember.id}` })
        .setTimestamp();
    await mC.send({ embeds: [embed] }).catch(console.error);
}

