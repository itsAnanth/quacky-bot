/* eslint-disable no-unused-vars */
import { core, devs } from '../../data/index.js';
import { inspect } from 'util';

import main_db from '../../modules/db/main.js';
import server_db from '../../modules/db/server.js';

const { prefix } = core;

export default {
    name: 'eval',
    aliases: ['eval'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [], ids: devs },
    execute: async(message) => {
        try {
            let script = message.content.replace(`${prefix}eval `, '');
            if (script.includes('await'))
                script = `(async() => {${script}})()`;
            console.log(script);
            let evaled = await eval(script);
            if (typeof evaled !== 'string')
                evaled = inspect(evaled);
            console.log(clean(evaled));
            message.channel.send(clean(evaled), { code: 'xl' });
        } catch (e) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(inspect(e))}\n\`\`\``);
        }
    }
};

const clean = text => {
    if (typeof text === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).substring(0, 1800);
    else
        return text;
};
