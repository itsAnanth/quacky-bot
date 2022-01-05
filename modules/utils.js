import { Formatters, Message, MessageEmbed, User } from 'discord.js';

function init() {
    User.prototype.sendEmbed = async function({ user, color, description, footer }) {
        const embed = new MessageEmbed()
            .setAuthor({ name: user.username, iconURL: user.iconURL })
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        return await this.send({ embeds: [embed], failIfNotExists: false }).catch(() => {});
    };

    Message.prototype.getMember = async function(string) {
        const member = await this.guild.members.fetch(string.replace(/\D/g, '')).catch(() => {});
        return member ? member : null;
    };

    Message.prototype.getUser = async function(string) {
        const user = await this.client.users.fetch(string.replace(/\D/g, '')).catch(() => {});
        return user ? user : null;
    };


    Message.prototype.disableComponents = function() {
        const newRows = this.components.map(row => {
            row.components = row.components.map(component => component?.setDisabled(true));
            return row;
        });
        return this.edit({ components: newRows });
    };

    Message.prototype.sendEmbed = async function(user, color, description, footer) {
        const embed = new MessageEmbed()
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return await this.channel.send({ embeds: [embed], failIfNotExists: false }).catch(console.error);
    };

    Message.prototype.replyEmbed = async function(user, color, description, footer) {
        const embed = new MessageEmbed()
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return await this.reply({ embeds: [embed], failIfNotExists: false }).catch(console.error);
    };

    String.prototype.dBold = function() {
        return Formatters.bold(this);
    };

    String.prototype.sCode = function() {
        return `\`${this}\``;
    };

    String.prototype.dCode = function() {
        return Formatters.codeBlock(this);
    };
}


export default init;

