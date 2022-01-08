import { Permissions } from 'discord.js';
import db from './db/server.js';
import { isStaff } from './evalCommand.js';
import warn from '../commands/moderation/warn.js';
import kick from '../commands/moderation/kick.js';
import mute from '../commands/moderation/timeout.js';
import ban from '../commands/moderation/ban.js';

const punishments = {
    ban: ban.execute,
    mute: mute.execute,
    kick: mute.execute,
    warn: warn.execute
};
export default {
    name: 'filter',
    bypass: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES] },
    staff: ['admin', 'mod'],
    execute: async function(message, bot) {
        if (await isStaff(this, message)) return false;
        // if (userHasPermission(message, this.bypass.permissions)) return false;
        if (await checkMentions(message, bot)) return true;

        const filter = await db.utils.filter.get();
        const str = message.content.toLowerCase();
        const filtered = str.replaceAll(/\s/g, '');

        console.log(filtered);
        const roleW = await db.utils.filter.getWhitelistRole();

        const idx = getIndex();

        if (idx != -1) {
            for (let i = 0; i < roleW[idx].words.length; i++)
                if (filtered.find(x => x[0].includes(roleW[idx].words[i]))) return false;
        }
        // if (filtered.length != copy.replace(/[^\x00-\x7F]/g, '')) return true;
        // for (let i = 0; i < filter.length; i++)
        const exists = filter.find(x => filtered.includes(x[0]));
        if (exists) {
            const flag = exists[1].flag;
            if (flag != 'none') {
                const punishment = punishments[flag];
                if (!punishment) return true;
                if (flag == 'mute')
                    punishment(message, [message.author.id, '30m', ...'Auto mod - banned word infraction'].split(' '), bot, true);
                else
                    punishment(message, [message.author.id, ...'Auto mod - banned word infraction'.split(' ')], bot, true);
            }
            return true;
        }

        return false;

        function getIndex() {
            for (let i = 0; i < roleW.length; i++)
                if (message.member.roles.cache.has(roleW[i].role)) return i;
            return -1;
        }
    }
};

async function checkMentions(message, bot) {
    const mentionsSize = message.content.match(/<@(&|!)?\d+>/gm)?.length || 0;
    const reason = 'Too many mentions in one message'.split(' ');
    if (mentionsSize >= 3 && mentionsSize < 10) {
        await warn.execute(message, [message.author.id, ...reason], bot, true);
        return true;
    } else if (mentionsSize >= 10) {
        await kick.execute(message, [message.author.id, ...reason], bot, true);
        return true;
    }
    return false;
}

