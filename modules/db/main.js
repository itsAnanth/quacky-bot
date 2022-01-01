import DBClient from './Db.js';


const db = new DBClient('main');

class DBUtils {

    constructor(keyv) {
        this.state = this;
        this.keyv = keyv;
        this.rapsheet = {
            add: this.r_add.bind(this.state),
            getId: this.r_id.bind(this.state),
            remove: this.r_remove.bind(this.state),
            get: this.getRapsheet.bind(this.state)
        };
    }


    async get(id) {
        let val = await this.keyv.get(id);
        if (!val) {
            val = {
                warns: [],
                rapsheet: []
            };
        }
        return val;
    }

    async r_id(id) {
        const res = await this.get(id);
        return res.rapsheet.length == 0 ? 1 : res.rapsheet[res.rapsheet.length - 1].id + 1;
    }

    async r_add(id, rObj) {
        const res = await this.get(id);
        res.rapsheet.push(rObj);
        await this.keyv.set(id, res);
        return res;
    }

    async getWarns(id) {
        return (await this.get(id)).rapsheet.filter(x => x.type == 'warn');
    }

    async r_remove(id, index) {
        const res = await this.get(id);
        res.rapsheet.splice(index, 1);
        await this.keyv.set(id, res);
        return res;
    }

    async getRapsheet(id) {
        return (await this.get(id)).rapsheet;
    }

}

db.utils = new DBUtils(db.keyv);

export default db;

