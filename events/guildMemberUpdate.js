import { Formatters, MessageEmbed } from 'discord.js';
import db from '../modules/db/server.js';

export default {
    name: 'guildMemberUpdate',
    execute: async(bot, oldMember, newMember) => {
        if (oldMember.pending && !newMember.pending)
            handleScreening(bot, oldMember, newMember);

        if (oldMember.roles.cache.size != newMember.roles.cache.size) {
            // handleBooster(bot, oldMember, newMember);
            handleRoleUpdate(bot, oldMember, newMember);
        } else if (oldMember.nickname != newMember.nickname)
            handleUserUpdate(bot, oldMember, newMember);
    }
};


async function handleScreening(bot, o, n) {
    const channel = (o.guild.channels || n.guild.channels).cache.get('697393036077826049');
    if (!channel) return;
    const embed = new MessageEmbed()
        .setColor('#FF8600')
        .setAuthor({ name: `Welcome ${o.user.tag}`, iconURL: 'https://images-ext-2.discordapp.net/external/mxgXDBnPaVN6O7yiPmS-H4f0ss1aiEQo9NnGO_A1TRc/https/media.discordapp.net/attachments/714445203318112256/956596676624252928/hello.gif' })
        .setThumbnail(n.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`To fully understand the server, we strongly recommend that you: \n\n\`1.\` Read the ${Formatters.channelMention('817672264292106240')}\n\`2.\` Select your roles in ${Formatters.channelMention('722708128948420649')}\n\`3.\` Introduce yourself ${Formatters.channelMention('955343973638082561')}`)
        .setFooter({ text: 'Welcome them to The Quack Pack!', iconURL: 'https://media.discordapp.net/attachments/714445203318112256/956597062844166204/893165570015b53aad1a6999d13ea7d8.png' });
    await channel.send({ content: `${Formatters.userMention(o.id)}`, embeds: [embed] });
}

// eslint-disable-next-line no-unused-vars
async function handleBooster(bot, oldMember, newMember) {
    const Lchannels = await db.utils.log_channels();
    const mId = Lchannels.booster;
    if (!mId) return;
    const mC = bot.channels.resolve(mId);
    if (!mC) return;

    const role = newMember.guild.roles.cache.find(x => x.tags?.premiumSubscriberRole);
    if (!role) return;
    if (!oldMember.roles.cache.has(role.id) && newMember.roles.cache.has(role.id)) {
        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.username, iconURL: newMember.user.avatarURL() })
            .setTitle('Nitro Boost')
            .setColor('DARK_VIVID_PINK')
            .setThumbnail('https://media.discordapp.net/attachments/714445203318112256/928216348692201522/921713247965548614.png')
            .setDescription(`${Formatters.userMention(newMember.id)} **Thank you for boosting the Quack Pack - You now have access to exclusive emotes (these emotes begin with qp_)!**`)
            .setTimestamp();
        await mC.send({ embeds: [embed] }).catch(console.error);
    }
}

async function handleUserUpdate(bot, oldMember, newMember) {
    const Lchannels = await db.utils.log_channels();
    const mId = Lchannels.userupdate;
    if (!mId) return;
    const mC = bot.channels.resolve(mId);
    if (!mC) return;

    const embed = new MessageEmbed()
        .setAuthor({ name: newMember.user.username, iconURL: newMember.user.avatarURL() })
        .setTitle('Nickname Changed')
        .setColor('BLUE')
        .setDescription(`**Before:** ${Formatters.codeBlock(oldMember.nickname ? oldMember.nickname : oldMember.user.username)}\n**After:** ${Formatters.codeBlock(newMember.nickname ? newMember.nickname : newMember.user.username)}`)
        .setFooter({ text: `User ID: ${newMember.id}` })
        .setTimestamp();
    await mC.send({ embeds: [embed] }).catch(console.error);
}

async function handleRoleUpdate(bot, oldMember, newMember) {
    const Lchannels = await db.utils.log_channels();
    const mId = Lchannels.roleupdate;
    if (!mId) return;
    const mC = bot.channels.resolve(mId);
    if (!mC) return;
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

