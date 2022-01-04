import { core } from '../../data/index.js';
import { handleInteraction } from '../../modules/messageUtils.js';
import { MessageEmbed, Permissions, MessageActionRow, MessageButton, Formatters } from 'discord.js';
import log_menu from '../../modules/config/log.js';
import db from '../../modules/db/server.js';
import Paginator from '../../modules/Paginator.js';
export default {
    name: 'config',
    aliases: ['config'],
    cooldown: 0,
    descriptions: 'Bot configuration command',
    excpectedArgs: `${core.prefix}config`,
    useOnly: { permissions: [Permissions.FLAGS.ADMINISTRATOR], roles: [] },
    required: { permissions: [] },
    execute: async function(message, args, bot) {
        const embed = new MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setTitle('Bot Configuration')
            .setDescription('Select an option from the buttons given below')
            .setFooter({ text: 'Use the buttons below for details' });

        const btns = [new MessageButton().setStyle('PRIMARY').setLabel('Logging').setCustomId('log')];

        const res = await message.reply({ components: [new MessageActionRow().addComponents(...btns)], embeds: [embed] });
        const collector = res?.createMessageComponentCollector({ componentType: 'BUTTON', time: core.timeouts['lock&unlock'] });

        collector.on('collect', async i => {
            if (await handleInteraction(i, message)) return;
            if (i.customId === 'log') {
                logging(message, bot);
                i.update({ embeds: [embed] });
                // res.delete();
            }
            // else if (i.customId === 'minimize')
            //     await i.update({ embeds: [minimizedEmbed], components: [maximizeRow] });
        });

        collector.on('end', () => {
            res.disableComponents();
        });
    }
};

async function displayLoggingChannels(message, bot) {
    const raw = await db.utils.log_channels();
    const data = Object.entries(raw).map(([k, v], i) => `**${i + 1}.** \`${k} logging\`: ${v ? Formatters.channelMention(v) : 'Not set'}`);

    const lastPage = Math.ceil(data.length / core['page-break']);
    const options = { author: message.author, current: 1, maxValues: data.length, max: lastPage, count: core['page-break'] };
    const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
        const final = [...data].slice(i, i + core['page-break']);
        return { embeds: [new MessageEmbed()
            .setFooter({ text: `${dat.page} out of ${lastPage == 0 ? 1 : lastPage}` })
            .setTitle('Server Logging Configuration')
            .setColor(core.embed)
            .setDescription(final.join('\n\u200b\n'))] }; // return embed
    });
    await paginator.start();
}

async function logging(message, bot) {
    const embed = new MessageEmbed()
        .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
        .setTitle('Server Logging Configuration')
        .setDescription('Select an option from the buttons given below')
        .setFooter({ text: 'Use the buttons below for details' });

    const btns = [new MessageButton().setStyle('SUCCESS').setLabel('Assign').setCustomId('assign'),
        new MessageButton().setStyle('PRIMARY').setLabel('Display').setCustomId('display')];

    const res = await message.reply({ components: [new MessageActionRow().addComponents(...btns)], embeds: [embed] });
    const collector = res?.createMessageComponentCollector({ componentType: 'BUTTON', time: core.timeouts['lock&unlock'] });

    collector.on('collect', async i => {
        if (await handleInteraction(i, message)) return;
        if (i.customId === 'assign') {
            log_menu.execute(message);
            i.update({ embeds: [embed] });
        } else if (i.customId === 'display')
            displayLoggingChannels(message, bot);
        // else if (i.customId === 'minimize')
        //     await i.update({ embeds: [minimizedEmbed], components: [maximizeRow] });
    });

    collector.on('end', () => {
        res.disableComponents();
    });
}
