import { Formatters, Message, MessageEmbed, User } from 'discord.js';

function init() {
    User.prototype.sendEmbed = async function({ user, color, description, footer }) {
        const embed = new MessageEmbed()
            .setAuthor({ name: user.username, iconURL: user.iconURL })
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        await this.send({ embeds: [embed], failIfNotExists: false }).catch(() => {});
    };

    Message.prototype.getMember = async function(string) {
        const member = await this.guild.members.cache.get(string.replace(/\D/g, ''));
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

    Message.prototype.sendEmbed = function({ user, color, description, footer }) {
        const embed = new MessageEmbed()
            .setAuthor({ name: user.username, iconURL: user.iconURL })
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        this.channel.send({ embeds: [embed], failIfNotExists: false }).catch(() => {});
    };

    Message.prototype.replyEmbed = function({ user, color, description, footer }) {
        const embed = new MessageEmbed()
            .setAuthor({ name: user.username, iconURL: user.iconURL })
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        this.reply({ embeds: [embed], failIfNotExists: false }).catch(() => {});
    };

    String.prototype.dBold = function() {
        return Formatters.bold(this);
    };

    String.prototype.dCode = function() {
        return Formatters.codeBlock(this);
    };
}


export default init;

