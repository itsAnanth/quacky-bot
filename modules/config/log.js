import { MessageEmbed, MessageActionRow, MessageSelectMenu, Formatters } from 'discord.js';
import { handleInteraction } from '../messageUtils.js';
import db from '../db/server.js';

const menuOptions = [{
    label: 'Ban',
    description: 'Logs all bans done via the bot',
    value: 'ban',
},
{
    label: 'Kick',
    description: 'logs user kicks done via the bot',
    value: 'kick',
},
{
    label: 'User Update',
    description: 'logs user update events',
    value: 'userupdate',
},
{
    label: 'Message',
    description: 'Logs message update and delete',
    value: 'message',
},
{
    label: 'Join / Leave',
    description: 'logs user join and leave',
    value: 'join_leave',
},
{
    label: 'Role Update',
    description: 'logs role removal addition and edit',
    value: 'roleupdate',
},
{
    label: 'Voice Update',
    description: 'logs VC join and leave',
    value: 'voiceupdate',
},
{
    label: 'Mute',
    description: 'logs user mutes done via the bot',
    value: 'mute',
}];

export default {
    name: 'log',
    execute: async function(message) {
        const menuEmbed = new MessageEmbed()
            .setAuthor({ name: `${message.author.username}`, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setTitle('Server logging config')
            .setDescription('Select a type of logging from the menu given below')
            .setColor('GREEN')
            .setTimestamp();


        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('log_config')
                    .setMaxValues(1)
                    .setPlaceholder('Select a logging type')
                    .addOptions(menuOptions),
            );

        const menu = await message.reply({ components: [row], embeds: [menuEmbed], failIfNotExists: false });

        const collector = menu?.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60000 });

        collector.on('collect', async i => {
            if (await handleInteraction(i, message)) return;
            m_collector(message, i.values[0]);
            menu.delete();
            collector.stop();
        });

        collector.on('end', (i) => { if (i.size == 0) menu.disableComponents(menu); });
    }
};


function m_collector(message, value) {
    message.sendEmbed(null, 'GREEN', `Type a channel for ${value} logging`);
    const msgfilter = i => i.user.id === message.author.id;
    const msgcollector = message.channel.createMessageCollector({ msgfilter, time: 60000, max: 4 });
    msgcollector.on('collect', async i => {
        if (i.author.id !== message.author.id) return;
        const arg = i.content.replace(/\D/g, '');
        const channel = message.guild.channels.cache.get(arg);
        if (!channel) return message.replyEmbed(null, 'RED', 'Invalid channel');
        await db.utils.set_log(value, channel.id);
        console.log(await db.utils.log_channels());
        message.sendEmbed(null, 'GREEN', `Successfully set ${Formatters.channelMention(channel.id)} as \`${value}\` logging channel`);
        msgcollector.stop();
    });

    msgcollector.on('end', () => { });
}
