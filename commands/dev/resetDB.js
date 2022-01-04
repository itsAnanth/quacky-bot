import { core, devs } from '../../data/index.js';
import mainDB from '../../modules/db/main.js';
import serverDB from '../../modules/db/server.js';
export default {
    name: 'resetdb',
    aliases: ['reset'],
    cooldown: 0,
    descriptions: 'db nuke for devs',
    excpectedArgs: `${core.prefix}resetdb`,
    useOnly: { permissions: [], roles: [], ids: devs },
    execute: async(message) => {
        mainDB.clear();
        serverDB.clear();
        message.sendEmbed(null, null, 'Successfully earsed database');
    }
};
