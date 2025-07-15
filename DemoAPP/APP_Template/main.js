const { BrowserWindow } = require("electron");
const path = require("path");



const content = path.join(__dirname, "content/index.html");
const icon = path.join(__dirname, "icon.png");

/**
 * 
 * @param {import("../../system/ModuleRepository/main").ModuleReposiory} REP 
 */
exports.run = async (REP) => {
    //必要なクラス・関数など取得▼
    const createWindow = REP.get("createWindow");
    const GUI_APP_Launcher = REP.get("GUI_APP_Launcher");
    await GUI_APP_Launcher.whenReady();


    //ランチャーウィンドウにアプリボタンを作成
    const appButton = new GUI_APP_Launcher();

    //アプリの表示名とアイコン▼
    appButton.name = "アプリテンプレート";
    appButton.icon = `rgb(109, 109, 109) url(${icon}) center / 70% no-repeat `;



    /**@type {BrowserWindow} */
    let contentWindow;

    //ボタンがクリックされたとき
    appButton.on("click", (type) => {
        //ダブルクリックではないなら戻る
        if (type == "single") return;

        if (contentWindow && contentWindow.isEnabled()) {
            //コンテンツウィンドウがあるならフォーカスして最前面に
            window.focus();
        } else {
            //有効なコンテンツウィンドウがないなら作成
            contentWindow = createWindow();
            //コンテンツを読み込み
            contentWindow.loadFile(content);
            //ウィンドウが閉じたとき
            contentWindow.once("closed", () => {
                contentWindow = null;
            });
        }
    });

    //ファイルをドロップまたはペースト
    appButton.on("inputFile", (inputs) => {
        console.log("入力されたファイルパス一覧");
        console.log(inputs);
    });

    //文字列やHTMLをドロップまたはペースト
    appButton.on("inputData", (inputs) => {
        console.log("入力されたデータ一覧");
        console.log(inputs);
    });
}