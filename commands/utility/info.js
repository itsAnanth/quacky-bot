import { core } from '../../data/index.js';
import { MessageEmbed, Permissions } from 'discord.js';
export default {
    name: 'info',
    aliases: ['info'],
    cooldown: 0,
    descriptions: 'Shows brief info about a command',
    excpectedArgs: `${core.prefix}info [command name]`,
    useOnly: { permissions: [], roles: [] },
    staff: [],
    execute: async function(message, args, bot) {
        if (!args[0]) return message.replyEmbed(null, 'RED', `Missing argument\n\`${this.excpectedArgs}\``);
        const allCommands = [...bot.commands.values()];

        const command = allCommands.find(x => x.name.toLowerCase() == args[0].toLowerCase());
        if (!command) return message.replyEmbed(null, 'RED', `Invalid command name - \`${args[0]}\``);

        const embed = new MessageEmbed()
            .setTitle(`${command.name}`)
            .setDescription(`${command.descriptions}\n\nExpected Arguments: \`${command.excpectedArgs}\``)
            .setColor('DARK_BLUE')
            .addField('Required staff role', `${!command.staff || command.staff.length == 0 ? 'None' : command.staff.join(', ')}`, true)
            .addField('Command aliases', `${!command.aliases || command.aliases.length == 0 ? 'None' : command.aliases.join(', ')}`, true)
            .addField('Required bot permissions', `${!command.required || command.required.permissions.length == 0 || !command.required.permissions ? 'None' : getBotPerms(command.required.permissions)}`, true)
            .setTimestamp()
            .setFooter({ text: 'Quack Quack' });

        message.channel.send({ embeds: [embed] });
    }
};


function getBotPerms(permissions) {
    return permissions && permissions.length != 0 ? permissions.reduce((a, c) => new Permissions(c).toArray().concat(a), []).join(', ').trim().sCode() : 'None';
}
