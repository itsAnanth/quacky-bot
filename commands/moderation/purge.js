import { Permissions } from 'discord.js';
import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';

export default {
    name: 'purge',
    aliases: ['clear'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES] },
    staff: ['admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Invalid argument | Missing message count to purge'));
        if (isNaN(parseInt(args[0]))) return message.replyEmbed(null, 'RED', 'Invalid argument | Expected a number');
        let count = args[0], i = 100;
        if (count > 100) {
            while (count > 0) {
                if (count < 100) i = count;
                try {
                    await message.channel.bulkDelete(i);
                    count -= i;
                } catch (e) {
                    message.sendEmbed(null, 'RED', `Error | \`${e}\``);
                    return;
                }
            }
        } else
            message.channel.bulkDelete(count);
        message.sendEmbed(null, 'GREEN', `Purged ${args[0]} messages`);
    }
};
