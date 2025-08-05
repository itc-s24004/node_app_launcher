import { BrowserWindow, BrowserWindowConstructorOptions, WebContentsView, WebContentsViewConstructorOptions } from "electron";
import { GitHub_API_Client } from "../GitHubAPI/main";
import { createWindow } from "../Electron/main";
import { ModuleReposiory } from "./main";
import { GUI_APP_Launcher } from "../GUI_APP_Launcher/main";
import { NodeManager } from "../LocalNode/main";
import { JsonConfig } from "../JsonConfig/main";

export type rep = {
    ModuleRepository: typeof ModuleReposiory;

    /**プリロード・カスタムスクリプトを含むBrowserWindowを作成します */
    createWindow: (option: BrowserWindowConstructorOptions, securePreload?: boolean) => BrowserWindow;
    /**プリロード・カスタムスクリプトを含むWebContentsViewを作成します */
    createWebContentsView: (option: WebContentsViewConstructorOptions, securePreload?: boolean) => WebContentsView;
    
    preload_origin: string;
    ipc_client: string;
    LOCAL_CONTENT_ROOT: string;

    JsonConfig: typeof JsonConfig;

    GUI_APP_Launcher: typeof GUI_APP_Launcher;
    

    GitHub_API_Client: typeof GitHub_API_Client;


    NodeManager: typeof NodeManager


    addExitCall: (callback: () => void) => void;
}
