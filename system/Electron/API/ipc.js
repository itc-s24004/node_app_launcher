const { ipcMain } = require("electron");
const path = require("path");

ipcMain.handle("getSystemScript-ipc_client", () => {
    return path.join(__dirname, "../customScripts/ipc_client.js");
});