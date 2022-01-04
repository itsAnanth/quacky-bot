import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';

export default {
    name: 'banword',
    aliases: ['banword'],
    cooldown: 0,
    descriptions: 'Bans a specific word with flags',
    excpectedArgs: `${core.prefix}banword [none/ban/kick/mute] [word]`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [] },
    staff: ['mod', 'admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing flag argument [none/mute/ban/kick]\n\`${this.excpectedArgs}\``);
        if (!args[1]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);
        const flag = args[0].toLowerCase();
        if (!['none', 'ban', 'kick', 'mute', 'warn'].includes(flag)) return message.replyEmbed(null, 'RED', 'Invalid flag, use [none/kick/mute/ban]');
        const word = args.slice(1, args.length).join('').toLowerCase();
        const success = await db.utils.filter.add(word, flag);
        if (!success) return message.replyEmbed(null, 'RED', `The word ${word} already exists in the local filter`);
        message.replyEmbed(null, 'GREEN', `Successfully added \`${word}\` to local filter with flag \`${flag}\``);
    }
};
