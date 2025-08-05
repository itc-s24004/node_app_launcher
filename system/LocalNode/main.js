const child = require("child_process");
const path = require("path");
const fs = require("fs");
const https = require("https");

const tar = require("tar");
const { EventEmitter } = require("stream");
const { LCR } = require("../../main");


const rootDir = path.join(LCR, "LocalNode");
if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);


const tmpDir = path.join(rootDir, "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
const packageDir = path.join(rootDir, "package");
if (!fs.existsSync(packageDir)) fs.mkdirSync(packageDir);
const nodeBinaryRoot = path.join(rootDir, "node");
if (!fs.existsSync(nodeBinaryRoot)) fs.mkdirSync(nodeBinaryRoot);


class NodeManager {
    /**
     * 
     * @returns {Promise.<import("./node_versions").node_version_info[]>}
     */
    static async getAllVersions() {
        try {
            return await (await fetch("https://nodejs.org/download/release/index.json")).json();
        } catch {
            return [];
        }
    }

    static isVersion(version) {
        if (typeof version != "string") return false;
        return /^[0-9]+.[0-9]+.[0-9]+$/.test(version);
    }

    static isVersionText(version) {
        if (typeof version != "string") return false;
        return /^v[0-9]+.[0-9]+.[0-9]+$/.test(version);
    }



    /**
     * 
     * @param {string} version 
     * @returns {Promise.<boolean>}
     */
    static #download(version) {
        return new Promise( async (resolve, rej) => {
            const versionText = `v${version}`;
            const versions = (await this.getAllVersions()).map(v => v.version);
            if (!versions.includes(versionText)) return resolve(false);

            https.get(`https://nodejs.org/dist/v${version}/node-v${version}-linux-x64.tar.gz`, {timeout: 1000*10}, (res) => {
                const savePath = path.join(packageDir, `${version}.tgz`);
                const stream = fs.createWriteStream(savePath);
                res.pipe(stream);
                stream.once("close", () => resolve(res.complete));
            });
        });
    }

    /**
     * 
     * @param {string} version 
     * @returns {Promise.<boolean>}
     */
    static async #extract(version) {
        const packagePath = path.join(packageDir, `${version}.tgz`);
        const exPath = path.join(tmpDir, version);
        //展開▼
        if (!fs.existsSync(exPath)) fs.mkdirSync(exPath);
        await tar.x({f: packagePath, cwd: exPath});
        //一覧に移動▼
        const exs = fs.readdirSync(exPath);
        if (!exs.length) return false;
        const nodeRoot = path.join(exPath, exs[0]);
        fs.renameSync(nodeRoot, path.join(nodeBinaryRoot, version));
        return true;
    }

    static #initializing = [];
    static #eventPipe = new EventEmitter();

    /**
     * 
     * @param {*} version 
     * @returns {Promise.<boolean>}
     */
    static nodeInit(version) {
        return new Promise(async (res, rej) => {
            //初期化済み▼
            const nodeRoot = path.join(nodeBinaryRoot, version);
            if (fs.existsSync(nodeRoot)) return res(true);

            //初期化中なら待機▼
            if (this.#initializing.includes(version)) return this.#eventPipe.once(version, (status => res(status)));

            //初期化処理▼
            this.#initializing.push(version);
            const dlStatus = await this.#download(version);
            if (!dlStatus) {
                this.#eventPipe.emit(version, false);
                return res(false);
            }

            const exStatus = this.#extract(version);
            this.#eventPipe.emit(version, exStatus);
            res(exStatus);
        });
    }


    /**
     * 
     * @param {string} version 
     * @returns {Promise.<NodeManager | undefined>}
     */
    static async get(version) {
        if (!this.isVersion(version)) return;
        const status = await this.nodeInit(version);
        if (!status) return;
        const nodeDir = path.join(nodeBinaryRoot, version);
        return new NodeManager(nodeDir);
    }

    #node
    get node() {
        return this.#node;
    }
    #npm
    constructor(binaryRootPath) {
        this.#node = path.join(binaryRootPath, "bin/node");
        this.#npm = path.join(binaryRootPath, "bin/npm");
    }

    /**
     * @param {string} cwd 
     * @param {string[]} args 
     * @param {((ms: import("child_process").Serializable) => void) | undefined} callback 
     * @returns {Promise.<{code: number | null, signal: NodeJS.Signals | null}>}
     */
    npm(cwd, args, callback) {
        if (typeof callback != "function") callback = () => {};
        return new Promise((res, rej) => {
            child.execFile(this.#node, [this.#npm, ...args], {cwd}).once("exit", (code, signal) => {
                res({code, signal});
                
            }).stdout.on("data", callback)
        });
    }

    npm_install(dir) {
        return this.npm(dir, ["i"]);
    }
}

// (async () => {
//     const NM = await NodeManager.get("24.4.1");
//     if (!NM) return console.log("node version error");
//     const status = await NM.npm(__dirname, ["-v"]);

// })();


exports.NodeManager = NodeManager;