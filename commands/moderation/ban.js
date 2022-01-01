import { Permissions } from 'discord.js';
import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';

export default {
    name: 'ban',
    aliases: ['ban'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [Permissions.FLAGS.BAN_MEMBERS], roles: [] },
    required: { permissions: [Permissions.FLAGS.BAN_MEMBERS] },
    argMap: ['user', 'reason (optional)'],
    execute: async function(message, args) {
        let user, isMember = true;
        if (!args[0]) return message.replyEmbed(null, 'RED', 'Missing argument | `user`');

        user = await message.getMember(args[0]);
        if (user == null) {
            user = await message.getUser(args[0]);
            isMember = false;
        }


        if (isMember && !user.bannable) return message.replyEmbed(null, 'RED', 'Unable to ban the user');

        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        try {
            await user.ban({ reason: reason });
        } catch (e) {
            console.log(e);
            return message.replyEmbed(null, 'RED', `Unable to ban the user | \`${e}\``);
        }

        const id = db.utils.rapsheet.getId(user.id);


        const kickObj = {
            reason: reason,
            time: Date.now(),
            author: message.author.id,
            type: 'ban',
            id: id
        };
        await db.utils.rapsheet.add(user.id, kickObj);
        message.replyEmbed(null, 'GREEN', `${user.user.tag} has been **banned** | ${user.id}`);
    }
};
