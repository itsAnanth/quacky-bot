import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';

export default {
    name: 'resetlb',
    aliases: ['resetlb'],
    cooldown: 0,
    descriptions: 'Resets weekly messages leaderboard',
    excpectedArgs: `${core.prefix}resetlb`,
    useOnly: { permissions: [], roles: [] },
    staff: ['admin'],
    execute: async function(message) {
        await db.utils.reset_event_msg();
        message.replyEmbed(null, 'GREEN', 'Successfully erased weekly messages leaderboard');
    }
};

