//Electron初期化前に呼ばれてもいいもののみ記述▼


const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");


//クライアント用スクリプト▼
const preloadPath = path.join(__dirname, "preload/preload.js");
const preloadSecurePath = path.join(__dirname, "preload/preload_s.js");

//ipc通信スクリプト▼
const ipc_clientPath = path.join(__dirname, "customScripts/ipc_client.js");
process.env.ipc_clientPath = ipc_clientPath;

require("./API/dialog");


/**
 * ウィンドウを作成
 * @param {import("electron").BrowserWindowConstructorOptions} options 
 */
function createWindow(options, securePreload=true) {
    const option = (() => {
        if (typeof options != "object") return {}
        if (Array.isArray(options)) return {}
        return options;
    })();
    option.webPreferences = {preload: securePreload ? preloadSecurePath : preloadPath}
    option.webPreferences.webSecurity = true;
    const window = new BrowserWindow(option);
    window.setMenu(null);

    

    return window;
}

exports.createWindow = createWindow;




// /**@type {Object.<number, string[]>} */
// const CustomScripts = {

// }


// ipcMain.handle("window_id", (ev) => {
//     return BrowserWindow.fromWebContents(ev.sender).id;
// });


// ipcMain.handle("getCustomPlugins", (ev) => {

// })