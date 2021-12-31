import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import { checkPermissions } from '../../modules/evalCommand.js';

export default {
    name: 'kick',
    aliases: ['kick'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: ['KICK_MEMBERS'], roles: [] },
    required: { permissions: ['KICK_MEMBERS'] },
    execute: async function(message, args) {
        if (!checkPermissions.apply(this, [message])) return;

        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing user'));
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed({ user: message.author, color: 'RED', description: 'Unknown User' });
        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        const msgObj = { user: message.author, color: 'GREEN', description: `Kicked user \`${user.user.tag}\` with reason\n\`\`\`${reason}\`\`\``, footer: 'Logged response' };
        try {
            await user.kick(reason);
        } catch (_) {
            const m = { ...msgObj };
            m.color = 'RED';
            m.footer = '';
            m.description = 'Missing Permission';
            return message.replyEmbed(m);
        }

        const kickObj = {
            reason: reason,
            time: Date.now(),
            author: message.author.id,
            type: 'kick'
        };
        await db.utils.rapsheet.add(user.id, kickObj);
        console.log(await db.utils.getRapsheet(user.id));
        message.replyEmbed(msgObj);
    }
};
