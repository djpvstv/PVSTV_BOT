const { app, BrowserWindow, ipcMain } = require('electron');
try {
    if (require('electron-squirrel-startup')) app.quit();
} catch (err) {
    console.log(err);
}

const { env } = require('node:process');
require('v8-compile-cache');
const path = require('path');
const { join } = require('path');
const mainModulePath = path.join(__dirname, '..', 'model', 'MainModel');
const MainModel = require(mainModulePath);
let model;

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
        win.loadFile(path.join(__dirname, 'indexDebug.html'));
    } else {
        win.loadFile(path.join(__dirname, 'index.html'));
    
    }
    win.setMenu(null);
    createModel(win);

    if (isDebug) {
        win.webContents.openDevTools();
    }
    const iconPath = join(__dirname, '..', 'img', 'noodles.png');
    const appVersion = app.getVersion();
    win.setIcon(iconPath);
    win.setTitle("PVSTVBOT.exe - v" + appVersion);
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

// One Way Events
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
            case "updateComboFilterRules":
                model.updateComboFilterRules(event, args.sourceID, extraData);
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
                        model.browserForSlippiPath(event, extraData.source);
                        break;
                    case 1:
                        model.browserForMeleeIsoPath(event, extraData.source);
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
            case "updatePathsFromClient":
                model.updateBothSlippiPaths(event, extraData);
                break;
            case "updateNonPathsSettingsFromClient":
                model.updateNonPathSettings(event, extraData);
                break;
            case "saveComboNotes":
                model.saveComboNotes(event, extraData);
                break;
            case "hideCombo":
                model.hideCombo(event, extraData);
                break;
            case "restoreCombos":
                model.restoreCombos(event, extraData);
                break;
            case "showExport":
                model.showExport(event, args.sourceID);
                break;
            case "showImport":
                model.showImport(event, args.sourceID);
                break;
            default:
                console.log(`Cannot match event ${args.eventName}`);
        }
    } catch (error) {
        console.log(error);
    }
});

// Two Way Events
ipcMain.handle("clientEventInvoke", async (event, args) => {
    try {
        let result;
        let extraData = null;
        if (Object.hasOwnProperty.call(args, "val")) {
            extraData = args.val;
        }
        switch (args.eventName) {
            case "retrieveComboNotes":
                result = await model.retrieveComboNotes(event, extraData);
                break;
        }
        return result;
    } catch (err) {
        console.log("unable to handle invoke request");
        console.log(err);
    }
});