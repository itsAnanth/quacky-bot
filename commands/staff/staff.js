import { core } from '../../data/index.js';
import { Permissions, Formatters } from 'discord.js';
import db from '../../modules/db/server.js';
export default {
    name: 'staff',
    aliases: ['staff'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [Permissions.FLAGS.ADMINISTRATOR], roles: [] },
    execute: async(message) => {
        const mods = (await db.utils.staff.get_mod()).map(v => `${Formatters.roleMention(v)}`);
        const helper = (await db.utils.staff.get_helper()).map(v => `${Formatters.roleMention(v)}`);
        const admin = (await db.utils.staff.get_admin()).map(v => `${Formatters.roleMention(v)}`);
        message.channel.send(`
        mods \n${mods.join('\n')}
        \nhelper \n${helper.join('\n')}
        \nadmin \n${admin.join('\n')}
        `);
    }
};

