import { Permissions, MessageEmbed } from 'discord.js';
import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';
import logAction from '../../modules/logAction.js';
export default {
    name: 'ban',
    aliases: ['ban'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix}ban [ID / @user] (reason | optional)`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.BAN_MEMBERS] },
    staff: ['admin', 'mod'],
    execute: async function(message, args, bot) {
        let user, isMember = true;
        if (!args[0]) return message.replyEmbed(null, 'RED', `Error : Missing argument\n\`${this.excpectedArgs}\``);

        user = await message.getMember(args[0]);
        if (user == null) {
            user = await message.getUser(args[0]);
            isMember = false;
        }


        if (isMember && !user.bannable) return message.replyEmbed(null, 'RED', 'Unable to ban the user');
        if (message.author.id == user.id) return message.replyEmbed(null, 'RED', 'You cannot ban yourself');
        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        try {
            await user.ban({ reason: reason });
        } catch (e) {
            console.log(e);
            return message.replyEmbed(null, 'RED', `Unable to ban the user | \`${e}\``);
        }

        const id = db.utils.rapsheet.getId(user.id);


        const banObj = {
            reason: reason,
            time: Date.now(),
            author: message.author.id,
            type: 'ban',
            id: id
        };
        await db.utils.rapsheet.add(user.id, banObj);
        message.replyEmbed(null, 'GREEN', `${user.user.tag} has been **banned** | ${user.id}`);
        const banlogembed = new MessageEmbed()
            .setAuthor({ name: isMember ? user.user.username : user.username })
            .setTitle(`${isMember ? user.user.tag : user.tag} Banned`)
            .setColor('NOT_QUITE_BLACK')
            .setDescription(`**Moderator:** <@${message.author.id}>
                \n**Reason:** ${reason}`)
            .setFooter({ text: `User ID: ${user.id}` })
            .setTimestamp();
        logAction(bot, banlogembed, 'ban');
    }
};
