import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';

export default {
    name: 'messageDelete',
    execute: async(bot, m) => {
        const Lchannels = await db.utils.log_channels();
        const mId = Lchannels.message;
        if (!mId) return;
        const mC = bot.channels.resolve(mId);
        if (!mC) return;
        const attachments = [...m.attachments.values()];
        const embed = new MessageEmbed()
            .setAuthor({ name: m.author.username, iconURL: m.author.avatarURL() })
            .setTitle('Message Deleted')
            .setColor('RED')
            .setDescription(
                `**Channel:** ${Formatters.channelMention(m.channel.id)}
            \n**Attachments:** ${attachments.length != 0 ? attachments.map(v => v.url).join('\n') : 'No Attachments'}
            \n**Content:** ${Formatters.codeBlock(m.content ? m.content : 'No message')}`)
            .setFooter({ text: `User ID: ${m.author.id}` })
            .setTimestamp();
        await mC.send({ embeds: [embed] }).catch(() => {});
    }
};
