import { Permissions, MessageEmbed } from 'discord.js';
import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';
import serverdb from '../../modules/db/server.js';
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
    execute: async function(message, args, bot, bypass) {
        let user, isMember = true;
        if (!args[0]) return message.replyEmbed(null, 'RED', `Error : Missing argument\n\`${this.excpectedArgs}\``);

        user = await message.getMember(args[0]);
        if (user == null) {
            user = await message.getUser(args[0]);
            isMember = false;
        }


        if (isMember && !user.bannable) return message.replyEmbed(null, 'RED', 'Unable to ban the user');
        if (!bypass && message.author.id == user.id) return message.replyEmbed(null, 'RED', 'You cannot ban yourself');
        if (!bypass && message.member.roles.highest.position <= user.roles.highest.position && message.author.id != message.guild.ownerId) return message.replyEmbed(null, 'RED', 'Unable to warn | provided user has higher roles');

        const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        try {
            await user.ban({ reason: reason });
        } catch (e) {
            console.log(e);
            return message.replyEmbed(null, 'RED', `Unable to ban the user | \`${e}\``);
        }

        // exploit protection
        if (!bypass) {
            const bans = await db.utils.getBans(message.author.id);
            let stateCount = bans.count;

            if (bans.lt) {
                const time = bans.lt;
                const now = Date.now();
                if (Math.abs(time - now) >= core.ban.time * 60 * 1000) {
                    console.log('resetting bans');
                    await db.utils.resetBans(message.author.id);
                    stateCount = 0;
                }
            }
            if (stateCount >= core.ban.max) {
                console.log(bans.count);
                const mods = await serverdb.utils.staff.get_mod();
                const admins = await serverdb.utils.staff.get_admin();
                const roles = mods.concat(admins);
                for (let i = 0; i < roles.length; i++) {
                    if (message.member.roles.cache.has(roles[i]))
                        return await message.member.roles.remove(roles[i]).catch(console.error);
                }
            }


            await db.utils.setBans(message.author.id);
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
