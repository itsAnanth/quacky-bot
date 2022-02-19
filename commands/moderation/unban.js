import { Permissions, MessageEmbed } from 'discord.js';
import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';
import serverdb from '../../modules/db/server.js';
import logAction from '../../modules/logAction.js';
export default {
    name: 'unban',
    aliases: ['unban'],
    cooldown: 0,
    descriptions: 'Unbans a user',
    excpectedArgs: `${core.prefix}ban [ID / @user] (reason | optional)`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.BAN_MEMBERS] },
    staff: ['admin', 'mod'],
    execute: async function(message, args, bot, bypass) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Error : Missing argument\n\`${this.excpectedArgs}\``);

        const user = await message.getUser(args[0]);

        if (!user) return message.replyEmbed(null, 'RED', 'Invalid User');

        const bans = await message.guild.fetchBans();
        if (bans.size == 0) return message.replyEmbed(null, 'RED', 'There are no bans in this server');
        const bUser = bans.find(b => b.user.id == user.id);
        if (!bUser) return message.replyEmbed(null, 'RED', `Could not find user with id ${user.id} in guild bans`);

        try {
            await message.guild.members.unban(bUser.user);
        } catch (e) {
            return message.replyEmbed(null, 'RED', `error: ${e}`);
        }

        message.replyEmbed(null, 'GREEN', `${user.tag} has been **unbanned** | ${user.id}`);
        // const banlogembed = new MessageEmbed()
        //     .setAuthor({ name: isMember ? user.user.username : user.username })
        //     .setTitle(`${isMember ? user.user.tag : user.tag} Banned`)
        //     .setColor('NOT_QUITE_BLACK')
        //     .setDescription(`**Moderator:** <@${message.author.id}>
        //         \n**Reason:** ${reason}`)
        //     .setFooter({ text: `User ID: ${user.id}` })
        //     .setTimestamp();
        // logAction(bot, banlogembed, 'ban');
    }
};
