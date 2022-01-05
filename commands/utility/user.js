import { core } from '../../data/index.js';
import { Formatters, MessageEmbed } from 'discord.js';

export default {
    name: 'user',
    aliases: ['whois', 'who'],
    cooldown: 0,
    descriptions: 'Shows user info',
    excpectedArgs: `${core.prefix}user [ID / @user]`,
    useOnly: { permissions: [], roles: [] },
    staff: ['helper', 'admin', 'mod'],
    execute: async(message, args) => {
        let user, isMember = true;
        if (!args[0]) user = message.member;
        else {
            user = await message.getMember(args[0]);
            if (user == null) {
                user = await message.getUser(args[0]);
                isMember = false;
            }
        }
        if (!user) return message.replyEmbed({ user: message.author, color: 'RED', description: 'Unknown User' });
        const embed = new MessageEmbed()
            .setTitle(isMember ? 'Member Info' : 'User Info')
            .setDescription(`<@${user.id}>`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addField('Username', `${isMember ? user.user.username : user.username}`, true)
            .addField('Discriminator', `${isMember ? user.user.discriminator : user.discriminator}`, true)
            .addField('ID', `\`${user.id}\``, true)
            // .addField('Status', `${isMember ? user.presence.status : 'Nil'}`, true)
            .addField('Joined on', `${isMember ? Formatters.time(user.joinedAt) : 'Nil'}`, true)
            .addField('Created on', `${Formatters.time(isMember ? user.user.createdAt : user.createdAt)}`, true)
            .addField('\u200b', '\u200b', true)
            .setFooter({ text: 'Officer Quack' })
            .setTimestamp();
        if (isMember) embed.addField(`Roles [${user.roles.cache.size}]`, user.roles.cache.map(r => Formatters.roleMention(r.id)).join(' '));
        message.channel.send({ embeds: [embed] });
    }
};

