import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/server.js';
import { Permissions } from 'discord.js';

export default {
    name: 'unbanword',
    aliases: ['unbanword'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES], roles: [] },
    required: { permissions: [] },
    execute: async function(message, args) {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing argument | `word to remove from filter`'));
        const word = args.slice(0, args.length).join('').toLowerCase();
        const filter = await db.utils.filter.get();
        const exists = filter.find(x => x == word);
        if (!exists) return message.replyEmbed(null, 'RED', `The word \`${word}\` does not exist in the filter`);
        await db.utils.filter.remove(word, filter.indexOf(exists));
        message.replyEmbed(null, 'GREEN', `Successfully removed the word \`${word}\` from local filter`);
    }
};
