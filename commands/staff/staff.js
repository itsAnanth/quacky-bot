import { core } from '../../data/index.js';
import { Permissions, Formatters, MessageEmbed } from 'discord.js';
import db from '../../modules/db/server.js';
import Paginator from '../../modules/Paginator.js';
export default {
    name: 'staff',
    aliases: ['staff'],
    cooldown: 0,
    descriptions: 'Displays all staff roles of the server',
    excpectedArgs: `${core.prefix}staff`,
    useOnly: { permissions: [], roles: [] },
    staff: ['helper', 'mod', 'admin'],
    execute: async(message, args, bot) => {
        const mods = (await db.utils.staff.get_mod()).map(v => `${Formatters.roleMention(v)} | \`mod\``);
        const helper = (await db.utils.staff.get_helper()).map(v => `${Formatters.roleMention(v)} | \`helper\``);
        const admin = (await db.utils.staff.get_admin()).map(v => `${Formatters.roleMention(v)} | \`admin\``);
        const data = [...admin, ...helper, ...mods];
        const lastPage = Math.ceil(data.length / core['page-break']);
        const options = { author: message.author, current: 1, maxValues: data.length, max: lastPage, count: core['page-break'] };
        const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
            const final = [...data].slice(i, i + core['page-break']);
            return { embeds: [new MessageEmbed()
                .setFooter({ text: `${dat.page} out of ${lastPage == 0 ? 1 : lastPage}` })
                .setTitle('Staff List')
                .setColor(core.embed)
                .setDescription(final.join('\n\u200b\n'))] }; // return embed
        });
        await paginator.start();
    }
};

