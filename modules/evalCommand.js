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
    const missingPerms = { user: message.author, color: 'RED', description: `Missing Bot Permission(s)\n${this.required.permissions.join(',').dCode().trim()}` };
    if (!botHasPermission(message, this.required.permissions)) {
        message.replyEmbed(missingPerms);
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
