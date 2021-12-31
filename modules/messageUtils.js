import { MessageEmbed } from 'discord.js';

function createEmbed(user, col, description) {
    const embed = new MessageEmbed()
        .setAuthor({ name: user.username, iconURL: user.iconURL })
        .setDescription(description)
        .setColor(col);
    return { embeds: [embed], failIfNotExists: false };
}


export { createEmbed };
