import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';

export default {
    name: 'warn',
    aliases: ['warn'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: ['BAN_MEMBERS'], roles: ['b'] },
    execute: async(message, args) => {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing user'));
        if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'Missing Reason'));
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown User');
        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        const warnObj = {
            reason: reason,
            time: Date.now(),
            author: message.author.id,
            type: 'warn'
        };
        await db.utils.warn(user.id, warnObj);
        message.sendEmbed(null, 'GREEN', `<@${user.id}> has been **warned** | ${user.id.sCode()}`);
    }
};
