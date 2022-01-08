import { Formatters, MessageEmbed, Permissions } from 'discord.js';
import db from '../modules/db/server.js';


export default {
    name: 'channelUpdate',
    execute: async(bot, oldMember, newMember) => {
        handleChannelUpdate(bot, oldMember, newMember);
    }
};

async function handleChannelUpdate(bot, oldChannel, newChannel) {
    const Lchannels = await db.utils.log_channels();
    const mId = Lchannels.channelupdate;
    if (!mId) return;
    const mC = bot.channels.resolve(mId);
    if (!mC) return;

    const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
        limit: 1,
    });

    const channelLog = fetchedLogs.entries.first();
    if (!channelLog) return;
    const change = channelLog.changes[0];


    if (channelLog.action == 'CHANNEL_OVERWRITE_UPDATE')
        overwriteUpdate(channelLog, change, newChannel, mC);
    else if (channelLog.action == 'CHANNEL_UPDATE')
        channelUpdate(channelLog, change, newChannel, mC);
}


async function channelUpdate(channelLog, change, channel, mC) {
    const embed = new MessageEmbed()
        .setTitle('Channel Update')
        .setColor('BLUE')
        .setDescription(`**Action:** \`${channelLog.action}\`\n**Change:** \`${change.key}\``)
        .addField('\u200b', `Before: \n\`${change.old}\`\nAfter: \n\`${change.new}\``)
        .setFooter({ text: `Channel ID: ${channel.id}` })
        .setTimestamp();
    await mC.send({ embeds: [embed] }).catch(console.error);
}

async function overwriteUpdate(channelLog, change, channel, mC) {
    const permission = new Permissions(change.new).toArray().map(x => (`\`${x}\``));
    const embed = new MessageEmbed()
        .setTitle('Channel Update')
        .setColor('BLUE')
        .setDescription(`**Action:** \`${channelLog.action}\``)
        .addField(`${permission.length != 0 ? change.key : 'Netural'} permissions\n\u200b`, `\n${channelLog.extra.type == 'member' ? 'Member' : 'Role'}:  ${channelLog.extra.type == 'member' ? Formatters.userMention(channelLog.extra.id) : Formatters.roleMention(channelLog.extra.id)}\n${permission.length != 0 ? permission.join('\n') : (new Permissions(change.old).toArray().map(x => (`\`${x}\``))).join('\n')}`)
        .setFooter({ text: `Channel ID: ${channel.id}` })
        .setTimestamp();
    await mC.send({ embeds: [embed] }).catch(console.error);
}

