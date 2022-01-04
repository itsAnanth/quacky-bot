import { core } from '../../data/index.js';
import { parseTime } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import { Permissions, MessageEmbed } from 'discord.js';
import logAction from '../../modules/logAction.js';

export default {
    name: 'timeout',
    aliases: ['mute'],
    cooldown: 0,
    descriptions: 'Mutes a user with reason, if any',
    excpectedArgs: `${core.prefix}mute [ID / @user] [time + s/m/h/d/w]`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.MODERATE_MEMBERS] },
    staff: ['helper', 'admin', 'mod'],
    execute: async function(message, args, bot, bypass) {
        console.log(args);
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing user\n\`${this.excpectedArgs}\``);
        if (!args[1]) return message.replyEmbed(null, 'RED', `Missing time argument\n\`${this.excpectedArgs}\``);
        const user = await message.getMember(args[0]);
        if (!user) return message.replyEmbed(null, 'RED', 'Unknown Member');
        const time = parseTime(args[1]);
        if (time == null) return message.replyEmbed(null, 'RED', 'Invalid time argument');
        const reason = args[2] ? args.slice(2, args.length).join(' ') : 'No Reason Provided';

        if (user.roles.highest.position >= message.member.roles.highest.position) return message.replyEmbed(null, 'RED', 'Unable to mute, User has a role higher than yours');
        if (!bypass && user.id == message.author.id) return message.replyEmbed(null, 'RED', 'You cannot mute yourself');

        try {
            await user.timeout(time, reason);
        } catch (e) {
            message.replyEmbed(null, 'RED', `Unable to timeout user | \`${e}\``);
            return;
        }

        const id = await db.utils.rapsheet.getId(user.id);


        const muteObj = {
            reason: reason,
            time: Date.now(),
            duration: args[2],
            author: message.author.id,
            type: 'timeout',
            id: id
        };
        if (time != 0) await db.utils.rapsheet.add(user.id, muteObj);
        message.replyEmbed(null, 'GREEN', `<@${user.id}> has been ${time == 0 ? 'unmuted' : 'timed out for ' + args[1]} | ${user.id.sCode()}`);
        const muteLogembed = new MessageEmbed()
            .setAuthor({ name: user.user.username })
            .setTitle(`${user.user.tag} Muted`)
            .setColor('BLUE')
            .setDescription(`**Moderator:** <@${message.author.id}>
                \n**Reason:** ${reason}`)
            .setFooter({ text: `User ID: ${user.id}` })
            .setTimestamp();
        logAction(bot, muteLogembed, 'mute');
    }
};
