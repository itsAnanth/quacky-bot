import db from './db/server.js';

class Cache {

    constructor() {
        this.cache = new Object();
    }

    async init() {
        const val = ['mod', 'admin', 'helper'];
        for (let i = 0; i < val.length; i++) {
            this.create(val[i]);
            const data = await db.utils.staff[`get_${val[i]}`]();
            console.log(data);
            this.set(val[i], data);
        }
        return true;
    }

    /**
     * Create a new Array
     * @param {String} identifier String to be used as a key for cache generation
     * @returns Array
     */
    create(identifier) {
        this.cache[identifier] = [];
        return this.cache[identifier];
    }

    set(identifier, value) {
        const val = this.cache[identifier];
        if (!val) return null;
        if (value instanceof Array) this.cache[identifier] = [...val, ...value];
        else val.push(value);
        return this.cache[identifier];
    }

    get(identifier) {
        const val = this.cache[identifier];
        if (!val) return null;
        return val;
    }

    delete(identifier, value) {
        const val = this.cache[identifier];
        if (!val) throw new Error(`Property ${identifier} does not exist in cache`);
        if (value instanceof Array) {
            for (const x of value) {
                const index = val.indexOf(x);
                val.splice(index, 1);
            }
            return val;
        } else {
            const index = val.indexOf(value);
            if (index === -1) throw new Error(`${value} does not exist in ${val}`);
            val.splice(index, 1);
            return val;
        }
    }

    /**
     * Returns an Array with first element as the cache tree and second element as the cache element count
     * @returns Array
     */
    tree() {
        return [this.cache, Object.keys(this.cache).length];
    }

}


export default new Cache();
