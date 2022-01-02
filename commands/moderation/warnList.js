import { core } from '../../data/index.js';
import db from '../../modules/db/main.js';
import { MessageEmbed } from 'discord.js';
import Paginator from '../../modules/Paginator.js';
import _Formatter from '../../modules/Formatter.js';
export default {
    name: 'warnlist',
    aliases: ['warns'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix}warnlist [ID / @user]`,
    useOnly: { permissions: [], roles: [], ids: [] },
    staff: ['helper', 'admin', 'mod'],
    execute: async function(message, args, bot) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing user\n\`${this.excpectedArgs}\``);
        const user = await message.getMember(args[0]);
        if (!user) return message.reply('Unknown user');
        const raw = await db.utils.getWarns(user.id);

        const data = _Formatter.warns(raw);

        const lastPage = Math.ceil(data.length / core['page-break']);
        const options = { author: message.author, current: 1, maxValues: data.length, max: lastPage, count: core['page-break'] };
        const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
            const final = [...data].slice(i, i + core['page-break']);
            return { embeds: [new MessageEmbed()
                .setAuthor({ name: `Total Case Logs: ${raw.length}` })
                .setFooter({ text: `${dat.page} out of ${lastPage == 0 ? 1 : lastPage}` })
                .setTitle(`${user.user.username}'s Warnlist`)
                .setColor(core.embed)
                .setDescription(final.join('\n\u200b\n'))] }; // return embed
        });
        await paginator.start();
    }
};
