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
        const member = await this.guild.members.fetch(string.replace(/\D/g, ''));
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

    Message.prototype.sendEmbed = function(user, color, description, footer) {
        const embed = new MessageEmbed()
            .setAuthor({ name: user ? user.username : this.author.username, iconURL: user ? user.avatarURL() : this.author.avatarURL() })
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        this.channel.send({ embeds: [embed], failIfNotExists: false }).catch(console.error);
    };

    Message.prototype.replyEmbed = function(user, color, description, footer) {
        const embed = new MessageEmbed()
            .setAuthor({ name: user ? user.username : this.author.username, iconURL: user ? user.avatarURL() : this.author.avatarURL() })
            .setDescription(description)
            .setColor(color ? color : 'GOLD')
            .setFooter({ text: footer ? footer : '' });
        this.channel.send({ embeds: [embed], failIfNotExists: false }).catch(console.error);
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

