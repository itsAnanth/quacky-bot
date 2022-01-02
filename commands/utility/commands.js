import { core } from '../../data/index.js';
import { MessageEmbed, Permissions } from 'discord.js';
import Paginator from '../../modules/Paginator.js';
export default {
    name: 'commands',
    aliases: ['command', 'cmd'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix}commands [mod/helper/admin]`,
    useOnly: { permissions: [], roles: [] },
    staff: ['admin', 'mod', 'helper'],
    execute: async function(message, args, bot) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);
        const type = args[0].toLowerCase();
        if (!['helper', 'mod', 'admin'].includes(type)) return message.replyEmbed(null, 'RED', 'Invalid Staff position');
        const allCommands = [...bot.commands.values()];
        const typeOnlyCmd = allCommands.filter(x => x.staff?.includes(type));


        const data = typeOnlyCmd.map(v => `**Name: ** ${v.name}\n**Expected Args:** \`${v.excpectedArgs}\`\n**Required bot permissions:** ${getBotPerms(v?.required?.permissions)}`);
        const lastPage = Math.ceil(data.length / core['page-break']);
        const options = { author: message.author, current: 1, maxValues: data.length, max: lastPage, count: core['page-break'] };
        const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
            const final = [...data].slice(i, i + core['page-break']);
            return { embeds: [new MessageEmbed()
                .setFooter({ text: `${dat.page} out of ${lastPage == 0 ? 1 : lastPage}` })
                .setTitle(`${type} Commands`)
                .setColor(core.embed)
                .setDescription(final.join('\n\n'))] }; // return embed
        });
        await paginator.start();
    }
};


function getBotPerms(permissions) {
    return permissions && permissions.length != 0 ? permissions.reduce((a, c) => new Permissions(c).toArray().concat(a), []).join(', ').trim().sCode() : 'None';
}
