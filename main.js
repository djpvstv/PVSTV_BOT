const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const MainModel = require('./model/MainModel');

// Communications from Controllers
const createModel = (win) => {
    model = new MainModel(win);

    ipcMain.on('buttonPressed', async (event, args) => {

        switch (args.eventName) {
            case "parseDirectoryForSlippiFiles":
                model.processDirectoryForSlippiFiles(args.sourceID);
                break;
            case "parseDirectory":
                model.processDirectoryForParse(args.sourceID);
                break;
            default:
                console.log(`Cannot match event ${args}`);
        }

        
    });
}

// Logger in case the app crashes and the console is wiped


// App Window Functionality

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 416,
        minHeight: 359,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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