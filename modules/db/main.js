import DBClient from './Db.js';


const db = new DBClient('main');

class DBUtils {

    constructor(keyv) {
        this.keyv = keyv;
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

    async warn(id, warnObj) {
        const res = await this.get(id);
        res.warns.push(warnObj);
        await this.keyv.set(id, res);
        return res;
    }

    async getWarns(id) {
        return (await this.get(id)).warns;
    }

}

db.utils = new DBUtils(db.keyv);

export default db;

