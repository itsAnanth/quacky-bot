import { Collection, MessageEmbed } from 'discord.js';
import { devs, core } from '../data/index.js';
import evalCommand, { checkPermissions, isStaff } from '../modules/evalCommand.js';
import filter from '../modules/filter.js';
export default {
    name: 'messageCreate',
    execute: async(bot, message) => {
        if (await filter.execute(message)) message.delete();
        const cooldowns = new Collection();
        let maintenance;
        /** Ignores:
        * - Bots
        * - Messages that don't start with bot prefix
        * - Banned users */
        if (message.author.bot || !message.content.toLowerCase().startsWith(core.prefix)) return;
        // Maintenance mode
        if (devs.includes(message.author.id) && message.content.startsWith(`${core.prefix}maintenance`) && message.content.split.length == 2) {
            maintenance = message.content.split(' ')[1] == 'on' ? true : false;
            if (maintenance) bot.user.setPresence({ activity: { name: 'the janitor', type: 'WATCHING' }, status: 'dnd' });
            else bot.user.setPresence({ activity: { name: 'Duck Gang', type: 'WATCHING' }, status: 'online' });
            message.channel.send({ content: `maintenance mode ${maintenance ? 'enabled' : 'disabled'}` });
        }

        const args = message.content.substring(core.prefix.length).trim().split(' '),
            commandName = args.shift().toLowerCase(),
            command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

        const now = Date.now(),
            timestamps = cooldowns.get(command.name),
            expirationTime = timestamps.get(message.author.id) + ((command.cooldown || 0) * 1000);

        if (!devs.includes(message.author.id) && timestamps.has(message.author.id)) {
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000,
                    time = timeLeft / 60;
                let seconds;

                if (time.toFixed(0) < 1) seconds = `${timeLeft.toFixed(1)} second(s)`;
                else seconds = `${time.toFixed(1)} minute(s)`;

                return message.reply({ embeds: [new MessageEmbed()
                    .setColor('YELLOW')
                    .setAuthor({ name: message.author.username, iconURL: message.author.iconURL })
                    .setTitle('Whoa whoa hold on...')
                    .setDescription(`You need to wait \`${seconds}\` before reusing the \`${command.name}\` command.`)
                    .setFooter({ text: 'not stonks' })], failIfNotExists: false });
            } else timestamps.delete(message.author.id);
        }
        if (!maintenance) {
            try {
                message.timestamps = timestamps;
                // if (!(await isStaff(command, message))) return;
                if (!(evalCommand(command, message) && await isStaff(command, message))) return;
                if (!checkPermissions.apply(command, [message])) return;
                command.execute(message, args, bot);
                if (!command.manualStamp) timestamps.set(message.author.id, now);
            } catch (error) { console.log(error); }
        } else {
            message.reply({ embeds: [new MessageEmbed()
                .setDescription('```diff\n- The bot commands are disabled for maintenance , please try again later``` \n<a:tools:830536514303295518> [Join our support server](https://discord.gg/DfhQDQ8e8c)')
                .setColor('BLACK')
                .setURL('https://discord.gg/DfhQDQ8e8c')], failIfNotExists: false }
            ).catch(e => console.log(e));
        }
    }
};
