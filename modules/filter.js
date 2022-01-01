import { Permissions } from 'discord.js';
import db from './db/server.js';
import { userHasPermission } from './evalCommand.js';
export default {
    name: 'filter',
    bypass: { permissions: [Permissions.FLAGS.MANAGE_MESSAGES] },
    execute: async function(message) {
        if (userHasPermission(message, this.bypass.permissions)) return false;
        const filter = await db.utils.filter.get();
        const str = message.content.toLowerCase();
        const filtered = str.replaceAll(/\s/g, '');

        const roleW = await db.utils.filter.getWhitelistRole();

        const idx = getIndex();

        if (idx != -1) {
            for (let i = 0; i < roleW[idx].words.length; i++)
                if (filtered.includes(roleW[idx].words[i])) return false;
        }
        // if (filtered.length != copy.replace(/[^\x00-\x7F]/g, '')) return true;
        for (let i = 0; i < filter.length; i++)
            if (filtered.includes(filter[i])) return true;

        return false;

        function getIndex() {
            for (let i = 0; i < roleW.length; i++)
                if (message.member.roles.cache.has(roleW[i].role)) return i;
            return -1;
        }
    }
};
