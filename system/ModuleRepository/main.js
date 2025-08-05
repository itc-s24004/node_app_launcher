const { EventEmitter } = require("events")



class ModuleReposiory {
    #eventPipe = new EventEmitter();

    /**@type {Object.<string, any>} */
    #rep = {}


    /**
     * 
     * @param {string} name 
     * @param {any} data 
     * @returns {boolean}
     */
    register(name, data) {
        if (typeof name != "string") return false;
        if (name in this.#rep) throw new Error(`登録エラー: すでに使用済みの名前です: ${name}`);
        this.#rep[name] = data;
        this.#eventPipe.emit(name);
        return true;
    }

    /**
     * 登録済みか確認
     * @template {keyof import("./_rep_plugin").rep_plugin} T
     * @param {T} name 
     */
    has(name) {
        return (name in this.#rep);
    }

    /**
     * 
     * @template {keyof import("./_rep").rep} T
     * 
     * @param {T} key 
     * @returns {import("./_rep").rep[T]}
     */
    get(key) {
        return this.#rep[key];
    }


    /**
     * 
     * @template {keyof (import("./_rep").rep & import("./_rep_plugin").rep_plugin)} T
     * 
     * @param {T} name 
     * @returns {Promise.<(import("./_rep").rep & import("./_rep_plugin").rep_plugin)[T]>}
     */
    getAsync(name) {
        return new Promise((res, rej) => {
            if (typeof name != "string") return res();
            if (name in this.#rep) return res(this.#rep[name]);
            this.#eventPipe.once(name, () => {
                res(this.#rep[name]);
            });
        });

    }
}


exports.ModuleReposiory = ModuleReposiory;