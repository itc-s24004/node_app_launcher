const { EventEmitter } = require("events");
const { createWindow } = require("../Electron/main");
const path = require("path");
const { ipcMain, session } = require("electron");


const exitCalls = [];
function addExitCall(call) {
    exitCalls.push(call);
}


exports.addExitCall = addExitCall;


class GUI_APP_Launcher {
    static #launcher = createWindow({transparent: true, frame: false, width: 500, height: 70, resizable: false, alwaysOnTop: false, fullscreenable: false});
    // static get window() {
    //     return this.#launcher; 
    // }

    /**全てのアプリボタン @type {GUI_APP_Launcher[]} */
    static #apps = [];


    static #ready = false;


    /**デスクトップ背景 @type {string} */
    static #background
    /**デスクトップ背景 @type {string} */
    static get background() {
        return this.#background;
    }
    static set background(value) {
        if (typeof value != "string") return;
        this.#background = value;
        this.#send("GUI_APP_Launcher-SetBackground", value);
    }

    /**タイトルバーの色 @type {string} */
    static #titleBarColor = ""
    /**タイトルバーの色 @type {string} */
    static get titleBarColor() {
        return this.#titleBarColor;
    }
    static set titleBarColor(value) {
        if (typeof value != "string") return;
        this.#titleBarColor = value;
        this.#send("GUI_APP_Launcher-SetTitleColor", value);
    }


    static {

        this.#launcher.addListener("closed", () => {
            session.defaultSession.clearCache();
            exitCalls.forEach(call => call());
            process.exit();
        })
        //アプリアイコンのクリック
        ipcMain.on("GUI_APP_Launcher-APP_Click", (ev, id, type) => {
            const APP = this.#apps.find(app => app.#id == id);
            if (APP) APP.#emit("click", type);
        });
        //ファイル入力
        ipcMain.on("GUI_APP_Launcher-InputFile", (ev, id, pathList) => {
            const APP = this.#apps.find(app => app.#id == id);
            if (APP) APP.#emit("inputFile", pathList);
            // console.log(pathList);
        });
        //データ入力(ファイル以外の文字など)
        ipcMain.on("GUI_APP_Launcher-InputData", (ev, id, dataList) => {
            const APP = this.#apps.find(app => app.#id == id);
            if (APP) APP.#emit("inputData", dataList);
            // console.log(dataList);
        });


        this.#launcher.loadFile(path.join(__dirname, "content/index.html"));
        this.#launcher.webContents.once("did-finish-load", () => {

            this.background = `center / cover no-repeat url(${path.join(__dirname, "content/background.png")})`;

            // let i = true;
            // const background = setInterval(() => {
            //     i = !i;
            //     if (i) {
            //         this.background = `center / cover no-repeat url(${path.join(__dirname, "content/background.png")})`;
            //     } else {
            //         this.background = `center / cover no-repeat url(${path.join(__dirname, "content/mizugaki.png")})`;
            //     }
            // }, 500);
            // this.#launcher.once("closed", () => {
            //     clearInterval(background);
            // })



            this.titleBarColor = "rgb(35, 35, 35)"

            



            let isWindowMode = true;
            const switchMode = () => {
                isWindowMode = !isWindowMode;

                this.#send("GUI_APP_Launcher-SetWindowMode", isWindowMode ? "window" : "floathing");

                const size = isWindowMode ? [896, 504] : [500, 70];

                this.#launcher.setResizable(true);
                this.#launcher.setSize(...size);
                this.#launcher.setResizable(false);

                this.#launcher.setAlwaysOnTop(!isWindowMode);

            }


            const app = new GUI_APP_Launcher();
            app.name = "デスクトップ";
            app.icon = `rgb(109, 109, 109) url(${path.join(__dirname, "icons/mode_window.png")}) center / 70% no-repeat `;



            // for (let index = 0; index < 100; index++) {
            //     const app2 = new GUI_APP_Launcher();
            //     app2.name = `アプリ: ${index}`;
            //     app2.icon = `rgb(109, 109, 109) url(${path.join(__dirname, "icons/mode_window.png")}) center / 70% no-repeat `;
            //     app2.on("click", (type) => {
            //         if (type == "double") console.log(`アプリ: ${index} - 起動`);
            //     });
            // }

            switchMode();
            app.on("click", switchMode);

            

            app.on("inputFile", (filePathList) => {
                console.log(filePathList);
            });



            this.#ready = true;
            this.#leadyCalls.forEach(c => c());
            this.#launcher.webContents.openDevTools({mode: "detach"});


        });
    }


    /**@type {(() => void)[]} */
    static #leadyCalls = [];

    /**
     * ランチャーの読み込みが完了時に結果を返します\
     * 例:▼\
     * //読み込み待機\
     * await GUI_APP_Launcher.whenReady();\
     * //アプリボタン追加\
     * const app = new GUI_APP_Launcher();
     * @returns {Promise.<void>}
     */
    static whenReady() {
        return new Promise((res, rej) => {
            if (this.#ready) return res();
            this.#leadyCalls.push(() => {res()});
        });
    }


    /**
     * ウィンドウにイベントを送信
     * @param {string} event 
     * @param  {...any} args 
     */
    static #send(event, ...args) {
        this.#launcher.webContents.send(event, ...args);
    }


    /**
     * 
     * @param {string} id 
     * @param {"icon" | "name" | "enable" | "visibility"} type 
     * @param {string | boolean} value 
     */
    static #update(id, type, value) {
        this.#send("GUI_APP_Launcher-Update", id, type, value);
    }


    /**
     * 
     * @param {string} id 
     */
    static #addAPP(id) {
        this.#send("GUI_APP_Launcher-AddAPP", id);
    }










    /**アプリの識別ID */
    #id = crypto.randomUUID();




    /**アプリの表示名 */
    #name = "";
    /**アプリの表示名 */
    get name() {
        return this.#name;
    }
    set name(value) {
        if (typeof value != "string") return;
        this.#name = value;
        GUI_APP_Launcher.#update(this.#id, "name", value);
    }


    /**表示アイコン(background) */
    #icon = "";
    get icon() {return this.#icon}
    set icon(value) {
        if (typeof value != "string") return;
        this.#icon = value;
        GUI_APP_Launcher.#update(this.#id, "icon", value);
    }

    #bubble


    #eventPipe = new EventEmitter();


    constructor() {
        GUI_APP_Launcher.#apps.push(this);
        GUI_APP_Launcher.#addAPP(this.#id);
    }



    
    /**
     * 任意のイベントを受け取る
     * @template {keyof import("./event").GUI_APP_EventMap} T
     * 
     * @param {T} eventName 
     * @param {import("./event").GUI_APP_EventMap[T]} callback 
     * @returns 
     */
    on(eventName, callback) {
        if (typeof eventName != "string") return;
        if (typeof callback != "function") return;
        this.#eventPipe.on(eventName, callback);
        return callback;
    }


    /**
     * 一度だけ任意のイベントを受け取る
     * @template {keyof import("./event").GUI_APP_EventMap} T
     * 
     * @param {T} eventName 
     * @param {import("./event").GUI_APP_EventMap[T]} callback 
     * @returns 
     */
    once(eventName, callback) {
        if (typeof eventName != "string") return;
        if (typeof callback != "function") return;
        this.#eventPipe.once(eventName, callback);
        return callback;
    }


    /**
     * 任意のイベントを送信
     * @template {keyof import("./event").GUI_APP_EventMap} T
     * 
     * @param {T} eventName 
     * @param {...any} args 
     * @returns 
     */
    #emit(eventName, ...args) {
        this.#eventPipe.emit(eventName, ...args);
    }




    delete() {
    }
}


exports.GUI_APP_Launcher = GUI_APP_Launcher;