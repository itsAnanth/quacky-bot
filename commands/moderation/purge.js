import { Permissions } from 'discord.js';
import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';

export default {
    name: 'purge',
    aliases: ['clear'],
    cooldown: 0,
    descriptions: 'Deletes a specific amount of messages in a channel (100 max limit)',
    excpectedArgs: `${core.prefix}purge [number] [userID/@user optional]`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES] },
    staff: ['helper', 'mod', 'admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Invalid argument | Missing message count to purge'));
        const count = parseInt(args[0]);
        if (isNaN(count)) return message.replyEmbed(null, 'RED', 'Invalid argument | Expected a number');
        if (count < 0 || count > 100) return message.replyEmbed(null, 'RED', 'Messages count must be greater than 0 and less than 100');

        if (!args[1]) {
            message.channel.bulkDelete(count);
            message.sendEmbed(null, 'GREEN', `Purged ${args[0]} messages`);
        } else {
            const user = await message.getMember(args[1]);
            if (!user) return message.replyEmbed(null, 'RED', 'Unknown User');

            const messages = [...(await message.channel.messages.fetch({ limit: 100 })).values()];
            const msgs = messages.filter(x => x.author.id == user.id).slice(0, count + 1);

            for (let i = 0; i < msgs.length; i++)
                await msgs[i].delete().catch(console.error);

            await message.sendEmbed(null, 'GREEN', `Deleted ${msgs.length} messages from ${user.user.tag}`);
        }
    }
};
