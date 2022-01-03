import { Permissions } from 'discord.js';
// import Cache from './Cache.js';
import db from './db/server.js';

const meta = [hasPermission, hasRole, hasId];

function evalCommand(cmd, message) {
    const values = Object.values(cmd.useOnly);
    if (!cmd.useOnly) return true;
    for (let i = 0; i < values.length; i++) {
        if (values[i].length == 0) continue;
        for (let j = 0; j < values[i].length; j++)
            if (!meta[i](message.member, values[i][j])) return false;
    }
    return true;
}

// function evalArgs(message, args) {
//     if (args.length >= this.argMap.length) return true;
//     return message.replyEmbed(null, 'RED', 'Missing arguments\nexpected arguments -> ')
// }

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

async function isStaff(cmd, message) {
    if (!cmd.staff || cmd.staff.length == 0) return true;
    for (let i = 0; i < cmd.staff.length; i++) {
        // const cDat = Cache.get(cmd.staff[i]);
        // let curr;
        // if (cDat) {
        //     curr = cDat;
        //     console.log(curr);
        // } else curr = await db.utils.staff[`get_${cmd.staff[i]}`]();
        const curr = await db.utils.staff[`get_${cmd.staff[i]}`]();
        if (curr.some(x => message.member.roles.cache.has(x))) return true;
    }
    return false;
}


function userHasPermission(message, values) {
    for (let i = 0; i < values.length; i++)
        if (!message.member.permissions.has(values[i])) return false;

    return true;
}


export default evalCommand;
export { botHasPermission, checkPermissions, userHasPermission, isStaff };
