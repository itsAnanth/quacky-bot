import { core, devs } from '../../data/index.js';
import warnDB from '../../modules/db/main.js';

export default {
    name: 'resetDB',
    aliases: ['reset'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [], ids: devs },
    execute: async(message) => {
        warnDB.clear();
        message.sendEmbed({ user: message.author, color: null, description: 'Successfully earsed database' });
    }
};
