const path = require("path");
const fs = require("fs");


const APP_root = path.join(__dirname, "../../NodeAPP");
const APPs = (() => {
    try {
        return fs.readdirSync(APP_root);

    } catch {
        throw new Error(`アプリルートの読み込みに失敗: ${APP_root}`)

    }
})();



const typePathList = [];
APPs.forEach(FName => {
    if (FName.startsWith("___")) return;
    const typePath_abs = path.join(APP_root, FName, "_rep.ts");

    const typePath = path.relative(__dirname, typePath_abs);
    try {
        if (fs.existsSync(typePath_abs) && fs.statSync(typePath_abs)) typePathList.push(typePath);

    } catch {
        console.error(`補完エラー: ${typePath_abs}`);

    }
});


const repTypes = `export type rep_plugin = ${typePathList.map(typePath => `import("${typePath}").rep`).join(" & ")};`;
fs.writeFileSync(path.join(__dirname, "_rep_plugin.ts"), repTypes);

// console.log(typePathList)