import { core } from '../../data/index.js';
import { Permissions } from 'discord.js';
import db from '../../modules/db/server.js';
export default {
    name: 'resing',
    aliases: ['demote'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [Permissions.FLAGS.ADMINISTRATOR], roles: [] },
    execute: async(message, args) => {
        const valid = ['mod', 'helper', 'admin'];
        if (!args[0]) return message.replyEmbed(null, 'RED', 'Missing assignment position | [mod/helper/admin]');
        if (!args[1]) return message.replyEmbed(null, 'RED', 'Missing assignee');
        const type = args[0].toLowerCase();
        if (!valid.includes(type)) return message.replyEmbed(null, 'RED', 'Invalid assignment position');
        const member = await message.getMember(args[1]);
        if (!member) return message.replyEmbed(null, 'RED', 'Invalid user');
        const success = await db.utils.staff.assign(member.id, type);
        if (!success) return message.replyEmbed(null, 'RED', `<@${member.id}> is already assigned as \`${type}\``);
        message.sendEmbed(null, 'RED', `Assigned <@${member.id}> as ${type}`);
        console.log(await db.utils.staff.gethelper());
    }
};

