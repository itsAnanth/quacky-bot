import { core } from '../../data/index.js';
import { Permissions, Formatters } from 'discord.js';
import db from '../../modules/db/server.js';
export default {
    name: 'unassign',
    aliases: ['demote'],
    cooldown: 0,
    descriptions: 'Unassigns a role from staff',
    excpectedArgs: `${core.prefix}unassign [helper/mod/admin] [ID / @user]`,
    useOnly: { permissions: [Permissions.FLAGS.ADMINISTRATOR], roles: [] },
    execute: async(message, args) => {
        const valid = ['mod', 'helper', 'admin'];
        if (!args[0]) return message.replyEmbed(null, 'RED', 'Missing assignment position | [mod/helper/admin]');
        if (!args[1]) return message.replyEmbed(null, 'RED', 'Missing assignee');
        const type = args[0].toLowerCase();
        if (!valid.includes(type)) return message.replyEmbed(null, 'RED', 'Invalid assignment position');
        const role = await message.guild.roles.cache.get(args[1].replace(/\D/g, ''));
        if (!role) return message.replyEmbed(null, 'RED', 'Invalid role');
        const success = await db.utils.staff.unassign(role.id, type);
        if (!success) return message.replyEmbed(null, 'RED', `${Formatters.roleMention(role.id)} is not assigned as \`${type}\``);
        message.sendEmbed(null, 'RED', `Unssigned ${Formatters.roleMention(role.id)} from ${type}`);
    }
};

