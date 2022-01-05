import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';

export default {
    name: 'messageUpdate',
    execute: async(bot, oldm, newm) => {
        const Lchannels = await db.utils.log_channels();
        const mId = Lchannels.message;
        if (!mId) return;
        const mC = bot.channels.resolve(mId);
        if (!mC) return;
        if (!oldm.content || !newm.content) return;
        const embed = new MessageEmbed()
            .setAuthor({ name: newm.author.username, iconURL: newm.author.avatarURL() })
            .setTitle('Message Edited')
            .setColor('BLUE')
            .setDescription(
                `**Channel:** ${Formatters.channelMention(newm.channel.id)}\n**Before:** ${Formatters.codeBlock(oldm.content)}\n**After:** ${Formatters.codeBlock(newm.content)}`)
            .setFooter({ text: `User ID: ${newm.author.id}` })
            .setTimestamp();
        await mC.send({ embeds: [embed] }).catch(() => {});
    }
};
