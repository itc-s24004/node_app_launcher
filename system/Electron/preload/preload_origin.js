const { ipcRenderer, contextBridge, webUtils } = require("electron");



const modules = {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    
    getFilePath: (file) => webUtils.getPathForFile(file)
}






//ローカルファイル以外からのアクセスを禁止
// if (location.protocol != "file:") return;


contextBridge.exposeInMainWorld("electron", modules);