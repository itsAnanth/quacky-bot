import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';


export default {
    name: 'test',
    aliases: ['test'],
    cooldown: 0,
    descriptions: 'Checks if a word exists in the local filter',
    excpectedArgs: `${core.prefix}test [word]`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [] },
    staff: ['mod', 'admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);
        const word = args.slice(0, args.length).join('').toLowerCase();
        const exists = await db.utils.filter.includes(word);
        message.replyEmbed(null, exists ? 'GREEN' : 'RED', `The word \`${word}\` ${exists ? 'exists' : 'does not exist'} in the filter`);
    }
};
