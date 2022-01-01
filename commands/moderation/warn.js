import { core } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import timeout from './timeout.js';
import ban from './ban.js';
import { Permissions } from 'discord.js';


export default {
    name: 'warn',
    aliases: ['warn'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [] },
    staff: ['helper', 'mod', 'admin'],
    execute: async(message, args) => {
        if (!args[0]) return message.replyEmbed(null, 'RED', 'Missing user');
        if (!args[1]) return message.replyEmbed(null, 'RED', 'Missing Reason');
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown User');

        // if (message.author.id == user.id) return message.replyEmbed(null, 'RED', 'You cannot warn yourself');
        if (message.member.roles.highest.position <= user.roles.highest.position && message.author.id != message.guild.ownerId) return message.replyEmbed(null, 'RED', 'Unable to warn | provided user has higher roles');

        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        const totalWarns = await db.utils.getWarns(user.id);
        const id = await db.utils.rapsheet.getId(user.id);
        const punishment = core.punishments[totalWarns.length + 1];
        const warnObj = {
            reason: reason,
            time: Date.now(),
            author: message.author.id,
            type: 'warn',
            id: id
        };
        await db.utils.rapsheet.add(user.id, warnObj);
        const msg = await message.sendEmbed(null, 'GREEN', `<@${user.id}> has been **warned** | ${user.id.sCode()}`);
        setTimeout(() => msg.delete(), 5000);
        // if (punishment) {
        //     switch (punishment.type) {
        //     case 'mute':
        //         // eslint-disable-next-line no-case-declarations
        //         timeout.execute(message, [user.id, punishment.duration, ...`Auto Mod | ${totalWarns.length + 1} Infractions`.split(' ')]);
        //         break;
        //     case 'ban':
        //         ban.execute(message, [user.id, ...`Auto Mod | ${totalWarns.length + 1} Infractions`.split(' ')]);
        //     }
        // }
    }
};
