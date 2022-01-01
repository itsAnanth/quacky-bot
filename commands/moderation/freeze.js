import { core } from '../../data/index.js';
import { handleInteraction } from '../../modules/messageUtils.js';
import db from '../../modules/db/server.js';
import { MessageEmbed, Permissions, MessageActionRow, MessageButton } from 'discord.js';

export default {
    name: 'freeze',
    aliases: ['lockchannels'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [], roles: [] },
    required: { permissions: [Permissions.FLAGS.MANAGE_CHANNELS] },
    staff: ['admin', 'mod'],
    execute: async function(message) {
        const everyone = message.guild.roles.cache.find(x => x.name.toLowerCase() == 'quack pack');
        if (!everyone) return;
        const lockedChannels = [];

        const channels = message.guild.channels.cache.filter(x => x.type == 'GUILD_TEXT');
        for (let i = 0; i < channels.size; i++) {
            const channel = channels.at(i);
            const permissions = channel.permissionsFor(everyone);
            const send_messages = permissions.has(Permissions.FLAGS.SEND_MESSAGES);
            const view_channel = permissions.has(Permissions.FLAGS.VIEW_CHANNEL);
            if (view_channel && send_messages) {
                try {
                    await channel.permissionOverwrites.create(everyone, {
                        SEND_MESSAGES: false
                    });
                    console.log(channel.name);
                    lockedChannels.push({ name: channel.name, id: channel.id });
                    db.utils.channels.lock(channel.id);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        const minimizedEmbed = new MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setTitle('Server Freeze')
            .setDescription(`Locked ${lockedChannels.length} channels`)
            .setFooter({ text: 'Use the buttons below for details' });
        const maximizedEmbed = new MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setTitle('Server Freeze')
            .setDescription(`Locked ${lockedChannels.length} channels \n ${lockedChannels.map((v, i) => `${i + 1}. ${v.name} | \`${v.id}\``).join('\n')}`)
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
