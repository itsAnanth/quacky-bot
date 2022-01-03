import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/server.js';

export default {
    name: 'unbanword',
    aliases: ['unbanword'],
    cooldown: 0,
    descriptions: 'Removes a word from the local filter, if it exists',
    excpectedArgs: `${core.prefix}unbanword [word]`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [] },
    staff: ['mod', 'admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing argument | `word to remove from filter`'));
        const word = args.slice(0, args.length).join('').toLowerCase();
        const success = await db.utils.filter.remove(word);
        if (!success) return message.replyEmbed(null, 'RED', `The word \`${word}\` does not exist in the filter`);
        message.replyEmbed(null, 'GREEN', `Successfully removed the word \`${word}\` from local filter`);
    }
};
