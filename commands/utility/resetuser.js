import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';

export default {
    name: 'resetuser',
    aliases: ['userreset'],
    cooldown: 0,
    descriptions: 'Resets weekly & alltime messages leaderboard for the user',
    excpectedArgs: `${core.prefix}resetuser [@user / ID]`,
    useOnly: { permissions: [], roles: [] },
    staff: ['admin'],
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing user\n\`${this.excpectedArgs}\``);
        const user = await message.getUser(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown user');
        await db.utils.delete_event_msg(user.id);
        message.replyEmbed(null, 'GREEN', `Successfully erased message count for ${user.username} (${user.id})`);
    }
};

