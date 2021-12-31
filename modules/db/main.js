import DBClient from './Db.js';


const db = new DBClient('main');

class DBUtils {

    constructor(keyv) {
        this.state = this;
        this.keyv = keyv;
        this.rapsheet = {
            add: this.r_add.bind(this.state)
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

    async r_add(id, rObj) {
        const res = await this.keyv.get(id);
        console.log(res);
        res.rapsheet.push(rObj);
        await this.keyv.set(id, res);
        return res;
    }

    async warn(id, warnObj) {
        const res = await this.get(id);
        res.warns.push(warnObj);
        warnObj.type = 'warn';
        res.rapsheet.push(warnObj);
        await this.keyv.set(id, res);
        return res;
    }

    async getWarns(id) {
        return (await this.get(id)).warns;
    }

    async getRapsheet(id) {
        return (await this.get(id)).rapsheet;
    }

}

db.utils = new DBUtils(db.keyv);

export default db;

