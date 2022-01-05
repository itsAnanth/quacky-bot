import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';


export default {
    name: 'channelDelete',
    execute: async(bot, channel) => {
        handleChannelCreate(bot, channel);
    }
};

async function handleChannelCreate(bot, channel) {
    const Lchannels = await db.utils.log_channels();
    const mId = Lchannels.channelupdate;
    if (!mId) return;
    const mC = bot.channels.resolve(mId);
    if (!mC) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETED',
    });

    const logs = fetchedLogs.entries.first();
    if (!logs) return;


    const embed = new MessageEmbed()
        .setTitle('Channel Delete')
        .setColor('BLUE')
        .setDescription(`**Channel:** ${channel.name}`)
        .addField('Deleted At', `${Formatters.time(new Date(Date.now()))}`, true)
        .addField('Deleted By', `${Formatters.userMention(logs.executor.id)}`, true)
        .addField('NSFW?', `${channel.nsfw}`, true)
        .setFooter({ text: `Channel ID: ${channel.id}` })
        .setTimestamp();
    await mC.send({ embeds: [embed] }).catch(console.error);
}

