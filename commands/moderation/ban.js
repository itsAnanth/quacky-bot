import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import { checkPermissions } from '../../modules/evalCommand.js';

export default {
    name: 'ban',
    aliases: ['ban'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: ['BAN_MEMBERS'], roles: [] },
    required: { permissions: ['BAN_MEMBERS'] },
    execute: async function(message, args) {
        if (!checkPermissions.apply(this, [message])) return;
        let user, isMember = true;
        if (!args[0]) user = message.member;
        else {
            user = await message.getMember(args[0]);
            if (user == null)
                user = await message.getUser(args[0]);
        }
        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        try {
            await user.ban({ reason: });
        } catch (e) {
            console.log(e);
            return message.replyEmbed(null, 'RED', `Could not kick the user | \`${e}\``);
        }

        const kickObj = {
            reason: reason,
            time: Date.now(),
            author: message.author.id,
            type: 'kick'
        };
        await db.utils.rapsheet.add(user.id, kickObj);
        message.replyEmbed(null, 'GREEN', `${user.user.tag} has been kicked | ${user.id}`);
    }
};
