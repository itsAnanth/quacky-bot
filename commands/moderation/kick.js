import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';
import serverdb from '../../modules/db/server.js';

import { Permissions, MessageEmbed } from 'discord.js';
import logAction from '../../modules/logAction.js';
export default {
    name: 'kick',
    aliases: ['kick'],
    cooldown: 0,
    descriptions: 'Kicks a user with reason, if any',
    excpectedArgs: `${core.prefix}kick [ID / @user] (reason | optional)`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.KICK_MEMBERS] },
    staff: ['admin', 'mod'],
    execute: async function(message, args, bot, bypass) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Error Missing argument\n\`${this.excpectedArgs}\``);
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown User');
        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';

        if (!user.kickable) return message.replyEmbed(null, 'RED', 'Unable to kick the user');
        if (!bypass && user.id == message.author.id) return message.sendEmbed(null, 'RED', 'You cannot kick yourself');
        if (!bypass && message.member.roles.highest.position <= user.roles.highest.position && message.author.id != message.guild.ownerId) return message.replyEmbed(null, 'RED', 'Unable to warn | provided user has higher roles');


        if (!bypass) {
            const kicks = await db.utils.getKicks(message.author.id);
            let stateCount = kicks.count;
            if (kicks.lt) {
                const time = kicks.lt;
                const now = Date.now();
                if (Math.abs(time - now) >= core.kick.time * 60 * 1000) {
                    console.log('resetting kicks');
                    await db.utils.resetKicks(message.author.id);
                    stateCount = 0;
                }
            }
            if (stateCount >= core.kick.max) {
                const mods = await serverdb.utils.staff.get_mod();
                const admins = await serverdb.utils.staff.get_admin();
                const roles = mods.concat(admins);
                for (let i = 0; i < roles.length; i++) {
                    if (message.member.roles.cache.has(roles[i]))
                        return await message.member.roles.remove(roles[i]).catch(console.error);
                }
            }

            await db.utils.setKicks(message.author.id);
        }
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
        const kicklogembed = new MessageEmbed()
            .setAuthor({ name: user.user.username })
            .setTitle(`${user.user.tag} Kicked`)
            .setColor('NOT_QUITE_BLACK')
            .setDescription(`**Moderator:** <@${message.author.id}>
                \n**Reason:** ${reason}`)
            .setFooter({ text: `User ID: ${user.id}` })
            .setTimestamp();
        logAction(bot, kicklogembed, 'kick');
    }
};
