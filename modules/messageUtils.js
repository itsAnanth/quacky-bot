import { MessageEmbed } from 'discord.js';

function createEmbed(user, col, description) {
    const embed = new MessageEmbed()
        .setAuthor({ name: user.username, iconURL: user.iconURL })
        .setDescription(description)
        .setColor(col);
    return { embeds: [embed], failIfNotExists: false };
}

async function handleInteraction(interaction, message) {
    if (interaction.user.id != message.author.id) {
        interaction.reply({ content: `You can't use the controls of a command issued by another user!\n Current Command issued by: <@${message.author.id}>`, ephemeral: true });
        return true;
    } else return false;
}

function parseTime(str) {
    const strAr = str.split('');
    const val = strAr.pop().toLowerCase();
    const arg = parseInt(strAr.join(''));
    if (isNaN(arg)) return null;
    if (val.toLowerCase() == 's')
        return arg * 1000;
    else if (val == 'm')
        return arg * 60 * 1000;
    else if (val == 'h')
        return arg * 60 * 60 * 1000;
    else if (val == 'd')
        return arg * 24 * 60 * 60 * 1000;
    else if (val == 'w')
        return arg * 7 * 24 * 60 * 60 * 1000;
}


export { createEmbed, parseTime, handleInteraction };
