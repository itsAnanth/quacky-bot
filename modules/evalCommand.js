import { Permissions } from 'discord.js';

const meta = [hasPermission, hasRole, hasId];

function evalCommand(cmd, message) {
    const values = Object.values(cmd.useOnly);
    for (let i = 0; i < values.length; i++) {
        if (values[i].length == 0) continue;
        for (let j = 0; j < values[i].length; j++)
            if (!meta[i](message.member, values[i][j])) return false;
    }
    return true;
}

function botHasPermission(message, values) {
    for (let i = 0; i < values.length; i++)
        if (!message.guild.me.permissions.has(values[i])) return false;

    return true;
}

function checkPermissions(message) {
    console.log(this);
    if (!this.required || !this.required.permissions || this.required.permissions.length == 0) return true;
    if (!botHasPermission(message, this.required.permissions)) {
        message.replyEmbed(null, 'RED', `Missing Bot Permission(s) | ${this.required.permissions.reduce((a, c) => new Permissions(c).toArray().concat(a), []).join(', ').trim().sCode()}`);
        return false;
    }
    return true;
}

function hasPermission(member, value) {
    return member.permissions.has(value) ? true : false;
}

function hasRole(member, value) {
    return member.roles.cache.find(x => x.name.toLowerCase() == value) ? true : false;
}

function hasId(member, value) {
    return member.id == value ? true : false;
}

export default evalCommand;
export { botHasPermission, checkPermissions };
