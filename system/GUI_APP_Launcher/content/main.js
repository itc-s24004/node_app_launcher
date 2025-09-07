window.addEventListener("load", () => {

    const appWindow = document.getElementById("appWindow");
    const titleBar = document.getElementById("titleBar");
    const content = document.getElementById("content");


    const modeElements = [appWindow, titleBar, content];


    //表示モード▼
    let windowMode = true;
    ipc_client.on("GUI_APP_Launcher", (type, ...args) => {
        switch (type) {
            case "windowMode": {
                const [mode] = args;
                const appLabels = [...document.getElementsByClassName("appName")];
                if (mode == "window") {
                    modeElements.forEach(e => e.classList.add("window"));
                    appLabels.forEach(e => e.classList.add("window"));

                } else {
                    modeElements.forEach(e => e.classList.remove("window"));
                    appLabels.forEach(e => e.classList.remove("window"));

                }
                windowMode = mode == "window";
                break;

            }


            case "background": {
                const [background] = args;
                content.style.background = background;
                break;

            }


            case "titleColor": {
                const [color] = args;
                titleBar.style.backgroundColor = color;
                break;

            }


            case "windowMode": {
                const appLabels = [...document.getElementsByClassName("appName")];
                if (mode == "window") {
                    modeElements.forEach(e => e.classList.add("window"));
                    appLabels.forEach(e => e.classList.add("window"));

                } else {
                    modeElements.forEach(e => e.classList.remove("window"));
                    appLabels.forEach(e => e.classList.remove("window"));

                }
                windowMode = mode == "window";

            }


            case "addAPP": {
                const [id] = args;
                /**@type {HTMLInputElement} */
                const app = document.createElement("div");
                app.id = id;
                app.classList.add(... windowMode ? ["app", "window"] : ["app"]);
                content.append(app);


                const name = document.createElement("div");
                name.id = `${id}-name`
                name.classList.add(... windowMode ? ["appName", "window"] : ["appName"]);
                name.innerText = "test text";
                app.append(name);


                const bubble = document.createElement("div");
                bubble.id = `${id}-bubble`;
                bubble.classList.add("bubble");
                app.append(bubble);


                app.addEventListener("click", () => ipc_client.invoke("GUI_APP_Launcher", "click", id, "single"));
                app.addEventListener("dblclick", () => ipc_client.invoke("GUI_APP_Launcher", "click", id, "double"));
                
                app.ondragover = app.ondragleave = app.ondragend = () => false;

                app.ondrop = (ev) => {
                    ev.preventDefault();
                    const pathList = [...ev.dataTransfer.files].map(f => ipc_client.getFilePath(f));
                    if (pathList.length > 0) ipc_client.invoke("GUI_APP_Launcher", "inputFile", id, pathList);

                    const dataTypes = ev.dataTransfer.types.filter(type => type != "Files");
                    const dataList = dataTypes.map(type => ({type, data:ev.dataTransfer.getData(type)}));
                    if (dataList.length > 0) ipc_client.invoke("GUI_APP_Launcher", "inputData", id, dataList);

                };

                app.onpaste = ({clipboardData}) => {
                    const pathList = [...clipboardData.files].map(f => ipc_client.getFilePath(f));
                    if (pathList.length > 0) ipc_client.invoke("GUI_APP_Launcher", "inputFile", id, pathList);
                    
                    const dataTypes = clipboardData.types.filter(type => type != "Files");;
                    const dataList = dataTypes.map(type => ({type, data:clipboardData.getData(type)}));
                    if (dataList.length > 0) ipc_client.invoke("GUI_APP_Launcher", "inputData", id, dataList);
                }
                break;

            }


            case "update": {
                const [id, type, value] = args;
                const app = document.getElementById(id);
                const bubble = document.getElementById(`${id}-bubble`);
                if (!app) return;
                const appName = document.getElementById(`${id}-name`);
                if (!appName) return;

                if (type == "icon") {
                    app.style.background = value;

                } else if (type == "bubble") {
                    bubble.style.backgroundColor = value;

                } else if (type == "name") {
                    app.title = appName.innerText = value;

                } else if (type == "enable") {
                    app.disabled = !value;

                } else if (type == "visibility") {
                    app.style.display = value ? "flex" : "none";

                }
                break;

            }
        }
    });



    //アイコン更新処理▼
    /**
     * @callback updateAPP
     * @param {string} id
     * @param {"icon" | "bubble" | "name" | "enable" | "visibility"} type
     * @param {string} value
     */

    


    //^Qで終了▼
    document.body.addEventListener("keydown", (ev) => {
        if (ev.code == "KeyQ" && ev.ctrlKey) window.close();
    });
});