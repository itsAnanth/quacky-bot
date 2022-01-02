import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';
import { Formatters } from 'discord.js';

export default {
    name: 'whitelist',
    aliases: ['whitelist'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [] },
    staff: ['mod', 'admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', 'Missing argument | user / role to whitelist');
        if (!args[1]) return message.replyEmbed(null, 'RED', 'Missing argument | `word to whitelist`');
        const word = args.slice(1, args.length).join('');
        const filter = await db.utils.filter.get();
        const exists = filter.find(x => x == word);
        if (!exists) return message.replyEmbed(null, 'RED', `The word \`${word}\` does not exist in the filter to whitelist`);
        const role = message.guild.roles.cache.get(args[0].replace(/\D/g, ''));
        if (!role) return message.replyEmbed(null, 'RED', 'Invalid role | failed to whitelist');
        const success = await db.utils.filter.whitelistRole(role.id, word);
        if (!success) return message.replyEmbed(null, 'RED', 'Role already exists in whitelist');
        message.replyEmbed(null, 'GREEN', `Successfully whitelisted the word \`${word}\` for ${Formatters.roleMention(role.id)}`);
        console.log(await db.utils.filter.getWhitelistRole());
    }
};
