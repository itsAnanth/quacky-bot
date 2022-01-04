import { Permissions } from 'discord.js';
import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';

export default {
    name: 'purge',
    aliases: ['clear'],
    cooldown: 0,
    descriptions: 'Deletes a specific amount of messages in a channel (100 max limit)',
    excpectedArgs: `${core.prefix}purge [number]`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES] },
    staff: ['admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Invalid argument | Missing message count to purge'));
        const count = parseInt(args[0]);
        if (isNaN(count)) return message.replyEmbed(null, 'RED', 'Invalid argument | Expected a number');
        if (count < 0 || count > 100) return message.replyEmbed(null, 'RED', 'Messages count must be greater than 0 and less than 100');
        message.channel.bulkDelete(count);
        message.sendEmbed(null, 'GREEN', `Purged ${args[0]} messages`);
    }
};
