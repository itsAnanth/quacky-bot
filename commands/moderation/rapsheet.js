import { core, roles, devs } from '../../data/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import { Formatters, MessageEmbed } from 'discord.js';
import Paginator from '../../modules/Paginator.js';
import _Formatter from '../../modules/Formatter.js';
export default {
    name: 'rapsheet',
    aliases: ['rapsheet'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: ['b'] },
    execute: async(message, args, bot) => {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Missing user'));
        const user = await message.getUser(args[0]);
        if (!user) return message.reply('Unknown user');
        const raw = await db.utils.getWarns(user.id);

        const data = _Formatter.warns(raw);

        const lastPage = Math.ceil(data.length / 10);
        const options = { author: message.author, current: 1, maxValues: data.length, max: lastPage };
        const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
            const final = [...data].slice(i, i + 10);
            return { embeds: [new MessageEmbed()
                .setAuthor({ name: `Total Case Logs: ${raw.length}` })
                .setFooter(`${dat.page} out of ${lastPage == 0 ? 1 : lastPage}`)
                .setTitle(`${user.username}'s Warnlist`)
                .setColor(core.embed)
                .setDescription(final.join('\n\u200b\n'))] }; // return embed
        });
        await paginator.start();
    }
};
