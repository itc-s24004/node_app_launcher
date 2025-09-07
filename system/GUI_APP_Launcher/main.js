const { EventEmitter } = require("events");
const { createWindow } = require("../Electron/main");
const path = require("path");
const { ipcMain, session, app } = require("electron");


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

    static exitAPP() {
        this.#launcher.close();
    }

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
        this.#send("background", value);
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
        this.#send("titleColor", value);
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
        //!!!t バックスラッシュが取得時にエスケープとして誤認されるため変更済み 修正され次第こちらも修正▼
        this.#launcher?.webContents.send("GUI_APP_Launcher", event, ...args.map(arg => typeof arg == "string" ? arg.replaceAll("\\", "\\\\") : arg));
    }


    /**
     * 
     * @param {string} id 
     * @param {"icon" | "bubble" | "name" | "enable" | "visibility"} type
     * @param {string | boolean} value 
     */
    static #update(id, type, value) {
        this.#send("update", id, type, value);
    }


    /**
     * 
     * @param {string} id 
     */
    static #addAPP(id) {
        this.#send("addAPP", id);
    }




    static {

        this.#launcher.addListener("closed", () => {
            this.#launcher = null;
            // session.defaultSession.clearCache();
            exitCalls.forEach(call => call());
            app.quit();
            process.exit();
        });


        this.#launcher.webContents.openDevTools()
        ipcMain.handle("GUI_APP_Launcher", async (ev, EventName, ...args) => {
            if (this.#launcher.webContents != ev.sender) return;

            switch (EventName) {
                case "click": {
                    const [id, type] = args;
                    const APP = this.#apps.find(app => app.#id == id);
                    if (APP) APP.#emit("click", type);
                    break

                }

                case "inputFile": {
                    const [id, pathList] = args;
                    const APP = this.#apps.find(app => app.#id == id);
                    if (APP) APP.#emit("inputFile", pathList);
                    break

                }

                case "inputData": {
                    const [id, dataList] = args;
                    const APP = this.#apps.find(app => app.#id == id);
                    if (APP) APP.#emit("inputData", dataList);
                    break

                }
            }
        });

        this.#launcher.loadFile(path.join(__dirname, "content/index.html"));
        this.#launcher.webContents.once("did-finish-load", () => {
            this.#ready = true;
            this.#leadyCalls.forEach(c => c());

        });



        GUI_APP_Launcher.whenReady().then(() => {
            this.background = `center / cover no-repeat url(${path.join(__dirname, "content/background.png")})`;
            this.titleBarColor = "rgb(35, 35, 35)";




            //終了ボタン▼
            const power = new GUI_APP_Launcher();
            power.name = "終了";
            power.icon = `rgb(109, 109, 109) url(${path.join(__dirname, "icons/power.png")}) center / 70% no-repeat `;
            power.on("click", (type) => {
                if (type == "double") GUI_APP_Launcher.exitAPP();
            });


            //表示モード切り替え▼
            const mode_sitch = new GUI_APP_Launcher();
            mode_sitch.name = "表示切り替え";

            let isWindowMode = true;
            const switchMode = () => {
                isWindowMode = !isWindowMode;

                this.#send("windowMode", isWindowMode ? "window" : "floathing");
                mode_sitch.icon = `rgb(109, 109, 109) url(${path.join(__dirname, `icons/mode_${isWindowMode ? "floating" : "window"}.png`)}) center / 70% no-repeat `;

                const size = isWindowMode ? [896, 504] : [500, 70];

                this.#launcher.setResizable(true);
                this.#launcher.setSize(...size);
                this.#launcher.setResizable(false);

                this.#launcher.setAlwaysOnTop(!isWindowMode);
            }
            switchMode();
            mode_sitch.on("click", switchMode);

        });

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

    #bubble = "red";
    get bubble() {
        return this.#bubble;
    }

    set bubble(value) {
        if (typeof value != "string") return;
        this.#bubble = value;
        GUI_APP_Launcher.#update(this.#id, "bubble", value);
    }


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



// require("./button_power");