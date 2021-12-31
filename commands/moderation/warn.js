import { core, roles, devs } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';

export default {
    name: 'warn',
    aliases: ['warn'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: ['BAN_MEMBERS'], roles: ['b'] },
    execute: async(message) => {
        message.channel.send({ content: 'e' });
    }
};
