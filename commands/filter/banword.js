import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/server.js';
import { Permissions } from 'discord.js';

export default {
    name: 'banword',
    aliases: ['banword'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES], roles: [] },
    required: { permissions: [] },
    execute: async function(message, args) {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing argument | `word to blacklist`'));
        const word = args.slice(0, args.length).join('').toLowerCase();
        const filter = await db.utils.filter.get();
        if (filter.find(x => x == word)) return message.replyEmbed(null, 'RED', `The word \`${word}\` already exists in filter`);
        await db.utils.filter.add(word);
        message.replyEmbed(null, 'GREEN', `Successfully added \`${word}\` to local filter`);
    }
};
