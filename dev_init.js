const { NodeManager } = require("./system/LocalNode/main");
const { ModuleReposiory } = require("./system/ModuleRepository/main");

const path = require("path");
const fs = require("fs");

//ModuleRepositoryの補完ファイル生成
require("./system/ModuleRepository/init");


(async () => {
    const local_node = await NodeManager.get("22.17.1");

    const installModule = [
        path.join(__dirname, "system/GitHubAPI")
    ];
    installModule.forEach(dir => {
        ( async () => {
            const {code} = await local_node.npm_install(dir);
            if (code) throw new Error(`パッケージのインストールに失敗: ${dir}`)
        })();
    });




    const rep = new ModuleReposiory();
    rep.register("NodeManager", NodeManager);

    const APP_Root = path.resolve("NodeAPP");
    fs.readdirSync(APP_Root).forEach(DName => {
        if (DName.startsWith("___")) return;

        const init = path.join(APP_Root, DName, "init.js");
        try {
            require(init).run(rep);
        } catch (e) {
            console.error(`初期化エラー: ${init}`);
            // console.log(e)
        }
    });


})();