const child = require("child_process");
const path = require("path");



const root = path.join(__dirname, "node-v22.17.0-linux-x64");

const node = path.join(root, "bin/node");
const npm = path.join(root, "bin/npm");


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



exports.npm_install = npm_install;