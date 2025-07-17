const { NodeManager } = require("./system/LocalNode/main");
const path = require("path");

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
    })
})()