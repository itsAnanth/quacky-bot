import { core } from '../../data/index.js';
import { Permissions, Formatters } from 'discord.js';
export default {
    name: 'role',
    aliases: ['role'],
    cooldown: 0,
    descriptions: 'Adds or removes a role from a user',
    excpectedArgs: `${core.prefix}role [ID / @user] [Role ID / @Role]`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.MANAGE_ROLES] },
    staff: ['admin', 'mod'],
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Error Missing argument\n\`${this.excpectedArgs}\``);
        if (!args[1]) return message.replyEmbed(null, 'RED', `Error Missing argument\n\`${this.excpectedArgs}\``);

        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown User');

        const role = message.guild.roles.cache.find(x => x.name == args.slice(1, args.length).join(' ')) || message.guild.roles.cache.get(args[1].replace(/\D/g, ''));
        if (!role) return message.replyEmbed(null, 'RED', 'Unknown Role');


        if (role.position >= message.guild.me.roles.highest.position) return message.replyEmbed(null, 'RED', 'Specified role is higher than bot\'s role');
        if (role.position >= message.member.roles.highest.position) return message.replyEmbed(null, 'RED', 'Specified role is higher than your role');
        let txt;
        if (user.roles.cache.has(role.id)) {
            await user.roles.remove(role.id).catch(console.error);
            txt = '-';
        } else {
            await user.roles.add(role.id).catch(console.error);
            txt = '+';
        }

        message.sendEmbed(null, 'RED', `<@${user.id}> ${txt}${Formatters.roleMention(role.id)}`);
    }
};
