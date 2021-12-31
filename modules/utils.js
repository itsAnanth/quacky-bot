import { Formatters, Message } from 'discord.js';

function init() {
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

    String.prototype.dBold = function() {
        return Formatters.bold(this);
    };

    String.prototype.dCode = function() {
        return Formatters.codeBlock(this);
    };
}


export default init;

