import { Permissions, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { core } from '../../data/index.js';
import db from '../../modules/db/server.js';
import { handleInteraction } from '../../modules/messageUtils.js';

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
        const unlockedChannels = [];
        console.log(lockedChannels);
        for (let i = 0; i < lockedChannels.length; i++) {
            const channel = await message.guild.channels.cache.get(lockedChannels[i]);
            if (!channel) continue;
            try {
                await channel.permissionOverwrites.create(everyone, {
                    SEND_MESSAGES: null
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
            .setDescription(`Unocked ${unlockedChannels.length} channels`)
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
