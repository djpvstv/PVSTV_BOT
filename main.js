require('v8-compile-cache');

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const MainModel = require('./model/MainModel');

// Communications from Controllers
const createModel = (win) => {
    model = new MainModel(win);
}

// App Window Functionality

const createWindow = async () => {
    console.log(path.resolve(app.getAppPath(), 'preload.js'));
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 416,
        minHeight: 359,
        webPreferences: {
            preload: path.resolve(app.getAppPath(), 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    win.setMenu(null);

    win.webContents.openDevTools();
    win.setTitle("PVSTVBOT.exe");

    createModel(win);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on("clientEvent", async (event, args) => {
    try {
        let extraData = null;
        if (Object.hasOwnProperty.call(args, "val")) {
            extraData = args.val;
        }
        switch (args.eventName) {
            case "parseDirectoryForSlippiFilesByButton":
                model.processDirectoryForSlippiFilesWithUI(event, args.sourceID);
                break;
            case "parseDirectoryForSlippiFilesByInput":
                model.processDirectoryForSlippiFilesWithoutUI(event, args.sourceID, extraData);
                break;
            case "parseDirectory":
                model.processDirectoryForParse(event, args.sourceID, extraData).catch(err => console.error(err));
                break;
            case "updateParsePagination":
                model.updateParsePagination(event, args.sourceID, extraData);
                break;
            case "updateComboPagination":
                model.updateComboPagination(event, args.sourceID, extraData);
                break;
            case "cancelComputation":
                model.cancelComputation(event, args.sourceID);
                break;
            case "findCombos":
                model.findCombos(event, args.sourceID, extraData).catch(err => (console.error(err)));
                break;
            default:
                console.log(`Cannot match event ${args.eventName}`);
        }
    } catch (error) {
        console.log(error);
    }
});