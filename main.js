const { app } = require("electron");

const path = require("path");
const fs = require("fs");
const { GitHub_API_Client } = require("./system/GitHubAPI/main");
const { NodeManager } = require("./system/LocalNode/main");


( async () => {
    await app.whenReady();

    const { ModuleReposiory } = require("./system/ModuleRepository/main");
    const { createWindow } = require("./system/Electron/main");
    const { GUI_APP_Launcher, addExitCall } = require("./system/GUI_APP_Launcher/main");

    //cssテンプレ▼
    require("./system/css_template/main");

    const rep = new ModuleReposiory();
    rep.register("ModuleReposiory", ModuleReposiory);

    rep.register("createWindow", createWindow);
    rep.register("GUI_APP_Launcher", GUI_APP_Launcher);
    rep.register("GitHub_API_Client", GitHub_API_Client);
    rep.register("NodeManager", NodeManager);
    rep.register("addExitCall", addExitCall);
    rep.register("defoult_preload", path.join(__dirname, "system/Electron/preload/preload_origin.js"));



    //デフォルトアプリ▼
    const PRE_APP_Root = path.join(__dirname, "NodeAPP");
    loadAPP(PRE_APP_Root, rep);

    //カスタムアプリ▼
    const APP_Root = path.resolve("NodeAPP");
    if (APP_Root != PRE_APP_Root) loadAPP(APP_Root, rep);

})();



function loadAPP(rootDir, ...arg) {
    fs.readdirSync(rootDir).forEach(DName => {
        if (DName.startsWith("___")) return;
        // console.log(DName)

        const app = path.join(rootDir, DName, "main.js");
        try {
            require(app).run(...arg);
        } catch (e) {
            console.error(`プラグインエラー: ${app}`);
            console.log(e)
        }
    });
}