const { GUI_APP_Launcher } = require("./main");

( async () => {
    await GUI_APP_Launcher.whenReady();
    const button = new GUI_APP_Launcher();
    button.on("click", (type) => {
        if (type == "double") GUI_APP_Launcher.exitAPP();
    });
    
})();