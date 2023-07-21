require('v8-compile-cache');
const { env } = require('node:process');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { join } = require('path');
const mainModulePath = path.join(__dirname, 'model', 'MainModel');
const MainModel = require(mainModulePath);

// Communications from Controllers
const createModel = (win) => {
    model = new MainModel(win);
}

// App Window Functionality

const createWindow = async () => {
    console.log(path.resolve(app.getAppPath(), 'preload.js'));
    const isDebug = env.NODE_ENV === 'development';
    const isProduction = env.NODE_ENV === 'production';
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

    if (isDebug) { 
        win.loadFile('indexDebug.html');
    } else {
        win.loadFile('index.html');
    
    }
    win.setMenu(null);

    if (isDebug) {
        win.webContents.openDevTools();
    }
    const iconPath = join(__dirname, 'img', 'noodles.ico');
    win.setIcon(iconPath);
    win.setTitle("PVSTVBOT.exe");

    createModel(win);
}

app.whenReady().then(async () => {
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
            case "playCombo":
                model.playCombo(event, args.sourceID, extraData);
                break;
            case "playAllCombos":
                model.playAllCombos(event, args.sourceID);
                break;
            case "getFilterParams":
                model.getFilterParams(event, args.sourceID);
                break;
            case "checkPaths":
                model.checkPaths();
                break;
            case "findSlippiModal":
                switch (extraData.flavor) {
                    case 0:
                        model.browserForSlippiPath(event);
                        break;
                    case 1:
                        model.browserForMeleeIsoPath(event);
                        break;
                }
                break;
            case "updateSlippiPathFromClient":
                switch (extraData.flavor) {
                    case 0:
                        model.updateSlippiPath(event, extraData);
                        break;
                    case 1:
                        model.updateMeleeIsoPath(event, extraData);
                        break;
                }
                
                break;
            default:
                console.log(`Cannot match event ${args.eventName}`);
        }
    } catch (error) {
        console.log(error);
    }
});