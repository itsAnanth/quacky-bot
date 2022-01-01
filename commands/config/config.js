import { core } from '../../data/index.js';
import { handleInteraction } from '../../modules/messageUtils.js';
import db from '../../modules/db/main.js';
import { MessageEmbed, Permissions, MessageActionRow, MessageButton } from 'discord.js';
import log_menu from '../../modules/config/log.js';
export default {
    name: 'config',
    aliases: ['config'],
    cooldown: 0,
    descriptions: 'Warns a user with reason, if any',
    excpectedArgs: `${core.prefix} warn [ID / @user] (reason)`,
    useOnly: { permissions: [Permissions.FLAGS.ADMINISTRATOR], roles: [] },
    required: { permissions: [] },
    execute: async function(message) {
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
                log_menu.execute(message);
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
