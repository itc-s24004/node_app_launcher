const child = require("child_process");
const path = require("path");
const fs = require("fs");

const https = require("https");



const root = path.join(__dirname, "node-binary");

const node = path.join(root, "bin/node");
const npm = path.join(root, "bin/npm");




/**
 * 
 * @param {import("../ModuleRepository/main").ModuleReposiory} REP 
 */
exports.run = async (REP) => {
    REP.register("local_node", node);
    REP.register("npm_install", npm_install);

}




/**
 * npm install\
 * node: v22.17.0\
 * npm: 10.9.0
 * @param {string} Dir 
 * @returns {Promise.<{code: number | null, signal: NodeJS.Signals | null}>}
 */
function npm_install(Dir) {
    return new Promise((res, rej) => {
        // console.log(Dir)
        child.execFile(node, [npm, "i"], {cwd: Dir}).once("exit", (code, signal) => {
            // console.log(code);
            // console.log(signal);
            res({code, signal});
            
        }).on("message", (ms) => console.log(ms));
    });
}


const NodeDownloadRoot = path.resolve("LocalNode");
if (fs.existsSync(NodeDownloadRoot)) {
    if (!fs.statSync(NodeDownloadRoot).isDirectory())
    fs.mkdirSync(NodeDownloadRoot);
}

class NodeManager {
    /**
     * 
     * @returns {import("./node_versions").node_version_info[]}
     */
    static async getAllVersions() {
        try {
            return await (await fetch("https://nodejs.org/download/release/index.json")).json();
        } catch {
            return [];
        }
    }

    static #download(version) {

    }


    static get(version) {

    }




    #node
    #npm
    constructor(binaryRootPath) {

    }

    /**
     * @param {string} cwd 
     * @returns {Promise.<{code: number | null, signal: NodeJS.Signals | null}>}
     */
    npm(cwd, ...args) {
        return new Promise((res, rej) => {
            child.execFile(this.#node, [this.#npm, ...args], {cwd}).once("exit", (code, signal) => {
                res({code, signal});
                
            }).on("message", (ms) => console.log(ms));
        });
    }

    npm_install(dir) {
        return this.npm(dir, "i");
    }
}


exports.npm_install = npm_install;