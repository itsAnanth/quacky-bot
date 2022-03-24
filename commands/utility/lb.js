import { core, emotes } from '../../data/index.js';
import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import Paginator from '../../modules/Paginator.js';
import db from '../../modules/db/server.js';
import { handleInteraction } from '../../modules/messageUtils.js';
import Cron from 'cron-converter';
const cronInstance = new Cron({
    timezone: 'Europe/London'
});
export default {
    name: 'lb',
    aliases: ['leaderboard', 'lbs'],
    cooldown: 0,
    descriptions: 'Shows messages leaderboard of the server',
    excpectedArgs: `${core.prefix}commands [mod/helper/admin]`,
    useOnly: { permissions: [], roles: [] },
    staff: [],
    execute: async function(message, args, bot) {
        if (message.channel.id == '697393036077826049') return;
        const meta = [db.utils.get_event_msg.bind(db.utils), db.utils.get_alltime_msg.bind(db.utils)];
        const embed = new MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setTitle('Server Leaderboard')
            .setDescription('Select a leaderboard type from the buttons below')
            .setFooter({ text: 'Use the buttons below for details' });

        const btns = [
            new MessageButton().setStyle('SUCCESS').setLabel('All Time').setCustomId('1'),
            new MessageButton().setStyle('PRIMARY').setLabel('Weekly').setCustomId('0')];

        const res = await message.reply({ components: [new MessageActionRow().addComponents(...btns)], embeds: [embed] });
        const collector = res?.createMessageComponentCollector({ componentType: 'BUTTON', time: core.timeouts['lock&unlock'] });

        collector.on('collect', async i => {
            if (await handleInteraction(i, message)) return;
            leaderBoard(parseInt(i.customId));
            i.update({ embeds: [embed] });
        });

        collector.on('end', () => {
            res.disableComponents();
        });

        async function leaderBoard(type) {
            const raw = await meta[type]();
            const emot = [emotes.firstplace, emotes.secondplace, emotes.thirdplace];
            const data = raw.sort((a, b) => b.count - a.count).map((v, i) => `${emot[i] ? emot[i] : i + 1 + '.'} <@${v.id}> - \`${v.count}\` messages`);

            const lastPage = Math.ceil(data.length / core['page-break']);
            const options = { author: message.author, current: 1, maxValues: data.length, max: lastPage, count: core['page-break'] };
            const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
                const final = [...data].slice(i, i + core['page-break']);
                const lbembed = new MessageEmbed()
                    .setFooter({ text: `${type == 0 ? 'LB resets in ' + timeRemaining() : ''}\n${dat.page} out of ${lastPage == 0 ? 1 : lastPage}` })
                    .setTitle(`${type == 0 ? 'Weekly' : 'All Time'} Messages Leaderboard`)
                    .setColor(core.embed)
                    .setDescription(final.join('\n'));
                // if (type == 0) lbembed.setFooter({ text: `LB resets in ${timeRemaining()}` });
                return { embeds: [lbembed] }; // return embed
            });
            await paginator.start();
        }
    }
};

function timeRemaining() {
    cronInstance.fromString('1 1 * * 0');
    const tt = Date.parse(cronInstance.schedule().next()) - Date.now();

    function msToDHM(v) {
        const days = v / 8.64e7 | 0;
        const hrs = (v % 8.64e7) / 3.6e6 | 0;
        const mins = Math.round((v % 3.6e6) / 6e4);

        return days + 'd ' + z(hrs) + 'h ' + z(mins) + 'm';

        function z(n) {
            return ((n < 10) ? '0' : '') + n;
        }
    }

    return msToDHM(tt);
}
