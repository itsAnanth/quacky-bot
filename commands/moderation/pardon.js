import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';
export default {
    name: 'pardon',
    aliases: ['pardon'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [], ids: [] },
    execute: async(message, args) => {
        if (!args[0]) return message.replyEmbed(null, 'RED', 'Missing argument | `user`');
        if (!args[1]) return message.replyEmbed(null, 'RED', 'Missing argument | `case ID`');
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown user');
        const id = parseInt(args[1]);
        if (isNaN(id)) return message.replyEmbed(null, 'RED', 'Invalid case ID');
        const rapsheet = await db.utils.rapsheet.get(user.id);
        const exists = rapsheet.find(x => x.id == id);
        if (!exists) return message.replyEmbed(null, 'RED', 'Invalid case ID');
        await db.utils.rapsheet.remove(user.id, rapsheet.indexOf(exists));
        message.replyEmbed(null, 'GREEN', `\`Case ID: ${id}\` of user <@${user.id}> has been pardoned`);
    }
};
