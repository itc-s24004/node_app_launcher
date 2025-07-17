import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { GitHub_API_Client } from "../GitHubAPI/main";
import { createWindow } from "../Electron/main";
import { ModuleReposiory } from "./main";
import { GUI_APP_Launcher } from "../GUI_APP_Launcher/main";
import { NodeManager } from "../LocalNode/main";

export type rep = {
    ModuleRepository: typeof ModuleReposiory;

    /**プリロード・カスタムスクリプトを含むBrowserWindowを作成します */
    createWindow: (option: BrowserWindowConstructorOptions, securePreload?: boolean) => BrowserWindow;
    /**createWindowで使用されるプリロードスクリプトのパス */
    defoult_preload: string;

    GUI_APP_Launcher: typeof GUI_APP_Launcher;
    

    GitHub_API_Client: typeof GitHub_API_Client;


    NodeManager: typeof NodeManager


    addExitCall: (callback: () => void) => void;
}
