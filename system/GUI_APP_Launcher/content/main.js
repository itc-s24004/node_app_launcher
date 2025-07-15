window.addEventListener("load", () => {

    // document.addEventListener("paste", (ev) => {
    //     const clipboardData = ev.clipboardData;
    //     const types = clipboardData.types;
    //     const files = [...clipboardData.files];
        
    //     const pathList = files.map(f => ipc_client.getFilePath(f));
    //     console.log(pathList)

        


    //     // const t = ev.clipboardData.getData("text/plain");


    //     // console.log(ev.clipboardData.files.item(0))
    //     // console.log(t)
    // })

    const appWindow = document.getElementById("appWindow");
    const titleBar = document.getElementById("titleBar");
    const content = document.getElementById("content");


    const modeElements = [appWindow, titleBar, content];


    let windowMode = true;
    ipc_client.on("GUI_APP_Launcher-SetWindowMode", (mode) => {
        const appLabels = [...document.getElementsByClassName("appName")];
        if (mode == "window") {
            modeElements.forEach(e => e.classList.add("window"));
            appLabels.forEach(e => e.classList.add("window"));

        } else {
            modeElements.forEach(e => e.classList.remove("window"));
            appLabels.forEach(e => e.classList.remove("window"));

        }
        windowMode = mode == "window";
    });

    //色・デザイン
    ipc_client.on("GUI_APP_Launcher-SetBackground", (background) => content.style.background = background);
    ipc_client.on("GUI_APP_Launcher-SetTitleColor", (color) => titleBar.style.backgroundColor = color);

    //アプリ追加
    ipc_client.on("GUI_APP_Launcher-AddAPP", (id) => {
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
        bubble.classList.add("bubble");
        app.append(bubble);


        app.addEventListener("click", () => ipc_client.send("GUI_APP_Launcher-APP_Click", id, "single"));
        app.addEventListener("dblclick", () => ipc_client.send("GUI_APP_Launcher-APP_Click", id, "double"));
        
        app.ondragover = app.ondragleave = app.ondragend = () => false;

        app.ondrop = function (ev) {
            ev.preventDefault();
            const pathList = [...ev.dataTransfer.files].map(f => ipc_client.getFilePath(f));
            if (pathList.length > 0) ipc_client.send("GUI_APP_Launcher-InputFile", id, pathList);

            const dataTypes = ev.dataTransfer.types.filter(type => type != "Files");
            const dataList = dataTypes.map(type => ({type, data:ev.dataTransfer.getData(type)}));
            if (dataList.length > 0) ipc_client.send("GUI_APP_Launcher-InputData", id, dataList);

        };

        app.onpaste = ({clipboardData}) => {
            const pathList = [...clipboardData.files].map(f => ipc_client.getFilePath(f));
            if (pathList.length > 0) ipc_client.send("GUI_APP_Launcher-InputFile", id, pathList);
            
            const dataTypes = clipboardData.types.filter(type => type != "Files");;
            const dataList = dataTypes.map(type => ({type, data:clipboardData.getData(type)}));
            if (dataList.length > 0) ipc_client.send("GUI_APP_Launcher-InputData", id, dataList);
        }
    });

    /**
     * @callback updateAPP
     * @param {string} id
     * @param {"icon" | "name" | "enable" | "visibility"} type
     * @param {string} value
     */

    ipc_client.on("GUI_APP_Launcher-Update", /**@type {updateAPP}*/(id, type, value) => {
        // console.log(id, type, value)
        const app = document.getElementById(id);
        if (!app) return;
        const appName = document.getElementById(`${id}-name`);
        if (!appName) return;

        if (type == "icon") {
            app.style.background = value;

        } else if (type == "name") {
            app.title = appName.innerText = value;

        } else if (type == "enable") {
            app.disabled = !value;

        } else if (type == "visibility") {
            app.style.display = value ? "flex" : "none";

        }



    })
});