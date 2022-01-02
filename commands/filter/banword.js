import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';
import { Permissions } from 'discord.js';

export default {
    name: 'banword',
    aliases: ['banword'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix}banword [word]`,
    useOnly: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES], roles: [] },
    required: { permissions: [] },
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);
        const word = args.slice(0, args.length).join('').toLowerCase();
        const filter = await db.utils.filter.get();
        if (filter.find(x => x == word)) return message.replyEmbed(null, 'RED', `The word \`${word}\` already exists in filter`);
        await db.utils.filter.add(word);
        message.replyEmbed(null, 'GREEN', `Successfully added \`${word}\` to local filter`);
    }
};
