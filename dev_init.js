const { npm_install } = require("./system/_node_npm/main");
const path = require("path");

//ModuleRepositoryの補完ファイル生成
require("./system/ModuleRepository/init");


const installModule = [
    path.join(__dirname, "system/GitHubAPI")
];
installModule.forEach(dir => {
    ( async () => {
        const {code} = await npm_install(dir);
        if (code) throw new Error(`パッケージのインストールに失敗: ${dir}`)
    })();
})