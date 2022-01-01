import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';

export default {
    name: 'config',
    aliases: ['config'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: ['ADMINISTRATOR'], roles: [] },
    required: { permissions: [] },
    execute: async function(message, args) {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing user'));
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown User');
        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        try {
            await user.kick(reason);
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