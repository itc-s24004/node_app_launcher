const { ipcRenderer, contextBridge, webUtils } = require("electron");



const modules = {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    
    getFilePath: (file) => webUtils.getPathForFile(file)
}



window.addEventListener("load", () => {
    document.body.addEventListener("keydown", (ev) => {
        if (ev.code == "KeyQ" && ev.ctrlKey) window.close();
    });
});



//ローカルファイル以外からのアクセスを禁止
// if (location.protocol != "file:") return;


contextBridge.exposeInMainWorld("electron", modules);


const script = document.createElement("script");
script.src = `file://${process.env.ipc_clientPath}`;


window.addEventListener("DOMContentLoaded", () => {
    document.head.append(script);
});