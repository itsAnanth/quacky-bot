import { core } from '../../data/index.js';
import { createEmbed, parseTime } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import { Permissions } from 'discord.js';

export default {
    name: 'timeout',
    aliases: ['mute'],
    cooldown: 0,
    descriptions: 'Mutes a user with reason, if any',
    excpectedArgs: `${core.prefix}mute [ID / @user] [time + s/m/h]`,
    useOnly: { permissions: [Permissions.FLAGS.MODERATE_MEMBERS], roles: [] },
    required: { permissions: [Permissions.FLAGS.MODERATE_MEMBERS] },
    execute: async function(message, args) {
        console.log(args);
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing user'));
        if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'Missing time argument'));
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown Member');
        const time = parseTime(args[1]);
        if (time == null) return message.replyEmbed(null, 'RED', 'Invalid time argument');
        const reason = args[2] ? args.slice(2, args.length).join(' ') : 'No Reason Provided';

        try {
            await user.timeout(time, reason);
        } catch (e) {
            message.replyEmbed(null, 'RED', `Unable to timeout user | \`${e}\``);
            return;
        }

        const muteObj = {
            reason: reason,
            time: Date.now(),
            duration: args[2],
            author: message.author.id,
            type: 'timeout'
        };
        if (time != 0) await db.utils.rapsheet.add(user.id, muteObj);
        message.replyEmbed(null, 'GREEN', `<@${user.id}> has been ${time == 0 ? 'unmuted' : 'timed out for ' + args[1]} | ${user.id.sCode()}`);
    }
};
