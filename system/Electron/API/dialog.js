const { ipcMain, dialog } = require("electron")

ipcMain.handle("showOpenDialog", async (ev, option) => {
    // const window = BrowserWindow.fromWebContents(ev.sender)
    return await dialog.showOpenDialog(null, option)
})