import { MessageEmbed } from 'discord.js';

function createEmbed(user, col, description) {
    const embed = new MessageEmbed()
        .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
        .setDescription(description)
        .setColor(col);
    return { embeds: [embed], failIfNotExists: false };
}

export { createEmbed };
