import { MessageEmbed } from 'discord.js';

function createEmbed(user, col, description) {
    const embed = new MessageEmbed()
        .setAuthor({ name: user.username, iconURL: user.iconURL })
        .setDescription(description)
        .setColor(col);
    return { embeds: [embed], failIfNotExists: false };
}

function parseTime(str) {
    const strAr = str.split('');
    const val = strAr.pop();
    const arg = parseInt(strAr.join(''));
    if (isNaN(arg)) return null;
    if (val.toLowerCase() == 's')
        return arg * 1000;
    else if (val.toLowerCase() == 'm')
        return arg * 60 * 1000;
    else if (val.toLowerCase() == 'h')
        return arg * 60 * 60 * 1000;
}


export { createEmbed, parseTime };
