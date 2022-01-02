import { core } from '../../data/index.js';
import { MessageEmbed } from 'discord.js';
import Paginator from '../../modules/Paginator.js';
import db from '../../modules/db/server.js';
export default {
    name: 'lb',
    aliases: ['leaderboard', 'lbs'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix}commands [mod/helper/admin]`,
    useOnly: { permissions: [], roles: [] },
    staff: [],
    execute: async function(message, args, bot) {
        const raw = await db.utils.get_event_msg();
        const data = raw.sort((a, b) => b.count - a.count).map((v, i) => `${i + 1}. <@${v.id}> - \`${v.count}\` messages`);


        const lastPage = Math.ceil(data.length / core['page-break']);
        const options = { author: message.author, current: 1, maxValues: data.length, max: lastPage, count: core['page-break'] };
        const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
            const final = [...data].slice(i, i + core['page-break']);
            return { embeds: [new MessageEmbed()
                .setFooter({ text: `${dat.page} out of ${lastPage == 0 ? 1 : lastPage}` })
                .setTitle('Messages Leaderboard')
                .setColor(core.embed)
                .setDescription(final.join('\n\n'))] }; // return embed
        });
        await paginator.start();
    }
};
