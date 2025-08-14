window.addEventListener("DOMContentLoaded", () => {
    /**@type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");


    canvas.toBlob( async (blob) => {
        const buff = await blob.arrayBuffer();
        const now = new Date().getTime();
        ipc_client.invoke("APP_Template", "save", buff, `${now}.png`);
    }, "image/png", 0.7);
});