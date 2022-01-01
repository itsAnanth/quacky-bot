import { core, devs } from '../../data/index.js';
import mainDB from '../../modules/db/main.js';
import serverDB from '../../modules/db/server.js';
export default {
    name: 'resetdb',
    aliases: ['reset'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [], ids: devs },
    execute: async(message) => {
        mainDB.clear();
        serverDB.clear();
        message.sendEmbed(null, null, 'Successfully earsed database');
    }
};
