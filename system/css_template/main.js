const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");


const root = path.join(__dirname, "template");

ipcMain.handle("css_template-getCSS_Path", (ev, template) => {
    console.log(template)
    if (typeof template != "string" || !path.isAbsolute(template)) return;
    const target = path.join(root, template);
    return target;
});

ipcMain.handle("css_template-getCSS", (ev, template) => {
    if (typeof template != "string" || !path.isAbsolute(template)) return;
    const target = path.join(root, template);
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return fs.readFileSync(target).toString();
});