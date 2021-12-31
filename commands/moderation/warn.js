import { core, roles, devs } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import { Formatters } from 'discord.js';

export default {
    name: 'warn',
    aliases: ['warn'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: ['BAN_MEMBERS'], roles: ['b'] },
    execute: async(message, args) => {
        message.channel.send(Formatters.time(Date.now()))
        // if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing user'));
        // if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'Missing Reason'));
        // const user = await message.getUser(args[0]);
        // if (!user) return message.reply('Unknown user');
        // const reason = args[1] ? args.slice(1, args.length).join(' ') : 'No Reason Provided';
        // const warnObj = {
        //     reason: reason,
        //     time: Date.now(),
        //     author: message.author.id
        // };
        // await db.utils.warn(user.id, warnObj);
        // console.log(user);
        // message.reply(createEmbed(message.author, 'RED', `Warned user ${user.tag} with reason : \n\`\`\`${reason}\`\`\``));
        // console.log(await db.utils.getWarns(user.id));
    }
};
