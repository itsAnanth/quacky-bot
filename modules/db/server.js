import DBClient from './Db.js';
import { core } from '../../data/index.js';

const db = new DBClient('server');

class DBUtils {

    constructor(keyv) {
        this.state = this;
        this.keyv = keyv;
        this.channels = {
            lock: this.freeze.bind(this.state),
            unlock: this.thaw.bind(this.state),
            get: this.getLockedChannels.bind(this.state),
        };
        this.filter = {
            get: this.filter_get.bind(this.state),
            add: this.filter_add.bind(this.state),
            includes: this.filter_includes.bind(this.state),
            remove: this.filter_remove.bind(this.state),
            whitelistRole: this.filter_whitelist_role.bind(this.state),
            getWhitelistRole: this.getWhitelistRole.bind(this.state)
        };
        this.staff = {
            assign: this.staff_assign.bind(this.state),
            unassign: this.staff_unassign.bind(this.state),
            get_helper: this.staff_getHelpers.bind(this.state),
            get_mod: this.staff_getMods.bind(this.state),
            get_admin: this.staff_getAdmins.bind(this.state),
        };
    }


    async get() {
        let val = await this.keyv.get(core['server-db-cluster']);
        if (!val) {
            val = {
                channels: { locked: [] },
                log: {
                    ban: null,
                    kick: null,
                    mute: null,
                    message: null,
                    join_leave: null,
                    userupdate: null,
                    roleupdate: null,
                    voiceupdate: null,
                    channelupdate: null,
                    booster: null
                },
                staff: {
                    helper: [],
                    mod: [],
                    admin: []
                },
                event: {
                    messages: {
                        weekly: {},
                        alltime: {}
                    },
                    vc: {},
                },
                filter: {
                    whitelist: {
                        roles: [],
                        ids: []
                    },
                    words: {}
                }
            };
        }
        return val;
    }


    async staff_assign(id, type) {
        const res = await this.get();
        if (res.staff[`${type}`].includes(id)) return false;
        res.staff[`${type}`]?.push(id);
        await this.keyv.set(core['server-db-cluster'], res);
        return true;
    }


    async reset_event_msg() {
        const res = await this.get();
        res.event.messages.weekly = {};
        await this.keyv.set(core['server-db-cluster'], res);
        return res;
    }

    async get_event_msg() {
        const res = await this.get();
        const serialized = Object.entries(res.event.messages.weekly).map(([k, v]) => ({ id: k, count: v }));
        return serialized;
    }

    async get_alltime_msg() {
        const res = await this.get();
        const serialized = Object.entries(res.event.messages.alltime).map(([k, v]) => ({ id: k, count: v }));
        return serialized;
    }

    async delete_event_msg(id) {
        const res = await this.get();

        res.event.messages.weekly[id] = 0;
        res.event.messages.alltime[id] = 0;

        await this.keyv.set(core['server-db-cluster'], res);
        return res;
    }

    async set_event_msg(id) {
        const res = await this.get();
        if (!res.event.messages.weekly[id]) res.event.messages.weekly[id] = 0;
        if (!res.event.messages.alltime[id]) res.event.messages.alltime[id] = 0;
        res.event.messages.alltime[id]++;
        res.event.messages.weekly[id]++;
        await this.keyv.set(core['server-db-cluster'], res);
        return res;
    }

    async staff_unassign(id, type) {
        const res = await this.get();
        const arr = res.staff[`${type}`];
        const exists = arr.find(x => x == id);
        if (!exists) return false;
        const idx = arr.indexOf(exists);
        arr.splice(idx, 1);
        await this.keyv.set(core['server-db-cluster'], res);
        return true;
    }

    async staff_getHelpers() {
        return (await this.get()).staff.helper;
    }

    async staff_getMods() {
        return (await this.get()).staff.mod;
    }

    async staff_getAdmins() {
        return (await this.get()).staff.admin;
    }

    async getWhitelistRole() {
        return (await this.get()).filter.whitelist.roles;
    }

    async filter_get() {
        return Object.entries((await this.get()).filter.words);
    }

    async filter_whitelist_role(id, word) {
        const res = await this.get();
        const user = res.filter.whitelist.roles.find(x => x.role == id);
        if (user && user.words.includes(word)) return false;
        else if (user)
            user.words.push(word);
        else
            res.filter.whitelist.roles.push({ role: id, words: [word] });
        await this.keyv.set(core['server-db-cluster'], res);
        return true;
    }

    async filter_remove(word) {
        const res = await this.get();
        if (!res.filter.words[word]) return false;
        delete res.filter.words[word];
        await this.keyv.set(core['server-db-cluster'], res);
        return true;
    }

    async filter_includes(word) {
        const res = await this.get();
        return res.filter.words[word] ? { success: true, flag: res.filter.words[word].flag } : { success: false };
    }

    async filter_add(word, flag) {
        const res = await this.get();
        if (res.filter.words[word]) return false;
        res.filter.words[word] = { flag: flag };
        await this.keyv.set(core['server-db-cluster'], res);
        return true;
    }

    async set_log(type, id) {
        const res = await this.get();
        res.log[type] = id;
        await this.keyv.set(core['server-db-cluster'], res);
        return res;
    }

    async get_log(type) {
        return (await this.get()).log[type];
    }

    async log_channels() {
        return (await this.get()).log;
    }

    async freeze(id, state) {
        const res = await this.get();
        res.channels.locked.push({ id: id, state: state });
        await this.keyv.set(core['server-db-cluster'], res);
        return res;
    }

    async thaw() {
        const res = await this.get();
        res.channels.locked = [];
        await this.keyv.set(core['server-db-cluster'], res);
        return res;
    }

    async getLockedChannels() {
        return (await this.get()).channels.locked;
    }


}

db.utils = new DBUtils(db.keyv);

export default db;

