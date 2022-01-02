import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';
import { Permissions } from 'discord.js';
export default {
    name: 'kick',
    aliases: ['kick'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix}kick [ID / @user] (reason | optional)`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.KICK_MEMBERS] },
    staff: ['admin', 'mod'],
    execute: async function(message, args) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Error Missing argument\n\`${this.excpectedArgs}\``);
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown User');
        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';

        if (!user.kickable) return message.replyEmbed(null, 'RED', 'Unable to kick the user');

        if (user.id == message.author.id) return message.sendEmbed(null, 'RED', 'You cannot kick yourself');

        try {
            await user.kick(reason);
        } catch (e) {
            console.log(e);
            return message.replyEmbed(null, 'RED', `Could not kick the user | \`${e}\``);
        }

        const id = db.utils.rapsheet.getId(user.id);

        const kickObj = {
            reason: reason,
            time: Date.now(),
            author: message.author.id,
            type: 'kick',
            id: id
        };
        await db.utils.rapsheet.add(user.id, kickObj);
        message.replyEmbed(null, 'GREEN', `${user.user.tag} has been kicked | ${user.id}`);
    }
};
