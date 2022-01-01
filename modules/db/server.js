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
            get: this.getLockedChannels.bind(this.state)
        };
        this.filter = {
            get: this.filter_get.bind(this.state),
            add: this.filter_add.bind(this.state)
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
                    messages: null,
                    userjoin: null,
                    userupdate: null,
                    roleupdate: null,
                    channelupdate: null
                },
                filter: {
                    words: []
                }
            };
        }
        return val;
    }

    async filter_get() {
        return (await this.get()).filter.words;
    }

    async filter_add(word) {
        const res = await this.get();
        res.filter.words.push(word);
        await this.keyv.set(core['server-db-cluster'], res);
        return res;
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

    async freeze(id) {
        const res = await this.get();
        res.channels.locked.push(id);
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

