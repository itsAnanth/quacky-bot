import { core } from '../../data/index.js';
import { Formatters } from 'discord.js';

export default {
    name: 'emoji',
    aliases: ['emoji'],
    cooldown: 0,
    descriptions: 'Locks or unlocks a emoji for a specific role',
    excpectedArgs: `${core.prefix}emoji [lock/unlock] [ID / @Role] [emoteID / emote]`,
    useOnly: { permissions: [], roles: [] },
    staff: ['admin', 'mod'],
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);
        const type = args[0].toLowerCase();
        if (!['lock', 'unlock'].includes(type)) return message.replyEmbed(null, 'RED', 'Invalid Action');
        if (!args[1]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);
        if (!args[2]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);

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

