import { core } from '../../data/index.js';
import { Formatters, MessageEmbed } from 'discord.js';

export default {
    name: 'emoji',
    aliases: ['emoji'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [] },
    execute: async(message, args) => {
        if (!args[0]) return message.replyEmbed(null, 'RED', 'Missing argument | lock or unlock');
        const type = args[0].toLowerCase();
        if (!['lock', 'unlock'].includes(type)) return message.replyEmbed(null, 'RED', 'Invalid Action');
        if (!args[1]) return message.replyEmbed(null, 'RED', 'Missing argument | Role to blacklist emoji');
        if (!args[2]) return message.replyEmbed(null, 'RED', 'Missing argument | Emoji to lock');

        const emoteId = args[2].replace(/\D/g, '');
        const emote = message.guild.emojis.cache.get(emoteId);
        const role = message.guild.roles.cache.get(args[1].replace(/\D/g, ''));
        if (!role) return message.replyEmbed(null, 'RED', 'Invalid Role');
        if (!emote) return message.replyEmbed(null, 'RED', 'Invalid Emote');
        // console.log(emote);
        emote.roles[`${type == 'lock' ? 'add' : 'remove'}`]([role.id, message.guild.me.roles.botRole.id]);
        // if (type == 'lock') emote.roles.add(...[role.id, bot.user.id]);
        // else emote.roles.remove([role.id, bot.user.id]);
        message.sendEmbed(null, 'RED', `Successfully ${type}ed ${Formatters.formatEmoji(emote.id)} for ${Formatters.roleMention(role.id)}`);
    }
};
