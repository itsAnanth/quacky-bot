import { Permissions } from 'discord.js';
import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';

export default {
    name: 'thaw',
    aliases: ['unlockchannels'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [Permissions.FLAGS.MANAGE_CHANNELS], roles: [] },
    required: { permissions: [Permissions.FLAGS.MANAGE_CHANNELS] },
    execute: async function(message) {
        const everyone = message.channel.guild.roles.everyone;
        const lockedChannels = await db.utils.channels.get();
        console.log(lockedChannels);
        for (let i = 0; i < lockedChannels.length; i++) {
            const channel = await message.guild.channels.cache.get(lockedChannels[i]);
            if (!channel) continue;
            try {
                await channel.permissionOverwrites.create(everyone, {
                    SEND_MESSAGES: null
                });
            } catch (e) {
                console.log(e);
            }
        }

        await db.utils.channels.unlock();
        console.log('unlocked');
    }
};
