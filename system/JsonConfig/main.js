const path = require("path");
const fs = require("fs");





class JsonConfig {

    /**
     * @template {Object.<string, any>} c
     * 
     * @param {string} configPath 
     * @param {c} defaultConfig 
     * @param {(config: c, defConfig: c) => boolean} checkCallback 
     * @returns {[config: c, useDefault: boolean, save: () => void]}
     */
    static load(configPath, defaultConfig = {}, checkCallback = (config, dconfig) => this.typeCheck(config, dconfig)) {
        if (!path.isAbsolute(configPath)) throw new Error(`${configPath}は絶対パスにする必要があります`);
        const dconfig = JSON.parse(JSON.stringify(defaultConfig, null));

        const config = (() => {
            try {
                /**@type {c} */
                const config = require(configPath);
                return checkCallback(config, dconfig) ? config : dconfig;
            } catch {
                return dconfig;
            }
        })();

        function save(space=4) {
            fs.writeFileSync(configPath, JSON.stringify(config, null, space));
        }

        const useDefault = config == dconfig;

        return [config, useDefault , save];
    }

    /**
     * 
     * @param {Object.<string, any>} json 
     * 比較対象
     * @param {Object.<string, any>} json2 
     * 比較型
     * @returns 
     */
    static typeCheck(json, json2) {
        const [type1, type2] = [json, json2].map(e => typeof e);
        const [isArray1, isArray2] = [json, json2].map(Array.isArray);

        if (type1 != type2 || isArray1 != isArray2) return false;

        if (type1 == "object") {
            let result = true;
            Object.keys(json2).forEach(key => {
                if (!(key in json)) result = false;
                if (!this.typeCheck(json[key], json2[key])) result = false;
            });
            return result;

        } else if (type1 != type2) return false;

        return true;
    }


}


exports.JsonConfig = JsonConfig;