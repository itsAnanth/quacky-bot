import { Permissions, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';
import { handleInteraction } from '../../modules/messageUtils.js';

export default {
    name: 'thaw',
    aliases: ['unlockchannels'],
    cooldown: 0,
    descriptions: 'Unlocks all the previously locked channels via freeze',
    excpectedArgs: `${core.prefix}thaw`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.MANAGE_CHANNELS] },
    staff: ['admin', 'mod'],
    execute: async function(message) {
        const everyone = message.guild.roles.cache.find(x => x.name.toLowerCase() == 'quack pack');
        if (!everyone) return;
        const lockedChannels = await db.utils.channels.get();
        const unlockedChannels = [];
        for (let i = 0; i < lockedChannels.length; i++) {
            const channel = await message.guild.channels.cache.get(lockedChannels[i].id);
            if (!channel) continue;
            try {
                await channel.permissionOverwrites.edit(everyone, {
                    SEND_MESSAGES: lockedChannels[i].state
                });
                unlockedChannels.push({ name: channel.name, id: channel.id });
            } catch (e) {
                console.log(e);
            }
        }

        await db.utils.channels.unlock();
        const minimizedEmbed = new MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setTitle('Server Thaw')
            .setDescription(`Unlocked ${unlockedChannels.length} channels`)
            .setFooter({ text: 'Use the buttons below for details' });
        const maximizedEmbed = new MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setTitle('Server Thaw')
            .setDescription(`Unocked ${unlockedChannels.length} channels \n ${unlockedChannels.map((v, i) => `${i + 1}. ${v.name} | \`${v.id}\``).join('\n')}`)
            .setFooter({ text: 'Use the buttons below to shrink' });
        const maximizeRow = new MessageActionRow()
            .addComponents(new MessageButton().setLabel('Maximize').setStyle('SUCCESS').setCustomId('maximize'));
        const minimizeRow = new MessageActionRow()
            .addComponents(new MessageButton().setLabel('Minimize').setStyle('SUCCESS').setCustomId('minimize'));

        const res = await message.reply({ components: [maximizeRow], embeds: [minimizedEmbed] });
        const collector = res?.createMessageComponentCollector({ componentType: 'BUTTON', time: core.timeouts['lock&unlock'] });

        collector.on('collect', async i => {
            if (await handleInteraction(i, message)) return;
            if (i.customId === 'maximize')
                await i.update({ embeds: [maximizedEmbed], components: [minimizeRow] });
            else if (i.customId === 'minimize')
                await i.update({ embeds: [minimizedEmbed], components: [maximizeRow] });
        });

        collector.on('end', () => {
            res.edit(minimizedEmbed);
            res.disableComponents();
        });
    }
};
