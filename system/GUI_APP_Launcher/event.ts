type appClickEventCallback = (type: "double" | "single") => void;
type appInputFileEventCallback = (input: string[]) => void;
type appInputDataEventCallback = (input: {type: string, data: string}[]) => void;


export type GUI_APP_EventMap = {
    click: appClickEventCallback;
    inputFile: appInputFileEventCallback;
    inputData: appInputDataEventCallback;
}