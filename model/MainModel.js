const {dialog} = require('electron');
require('nan');
const fs = require('fs');
const { resourceUsage } = require('process');
const { parseSimple } = require('./../build/Release/v8engine.node');

class MainModel {

    #win = null;
    #currentFiles = [];
    #directory = '';

    constructor( mainWindow ) {
        this.#win = mainWindow;
    }

    async processDirectoryForSlippiFiles ( buttonID ) {

        const filename = await dialog.showOpenDialogSync({
            properties: [
                "openDirectory"
            ]
        });
    
        let bIsValid = false;
        const returnData = {};
        returnData.valid = bIsValid;
        let files = [];
        let directoryToCheck;

        if (typeof filename !== 'undefined') {
            directoryToCheck = filename[0];
            
        
            fs.readdirSync(directoryToCheck).forEach(file => {
                if (file) {
                    const matches = file.match(/\.[0-9a-z]+$/i);
                    if (matches) {
                        const fileType = matches[0];
                        if (fileType === '.slp') {
                            files.push(file);
                        }
                    }
                }
            });

            bIsValid = files.length > 0;

            returnData.valid = bIsValid;
            returnData.dir = directoryToCheck;
        }

        if (bIsValid) {
            this.#currentFiles = files;
            this.#directory = directoryToCheck.replaceAll('\\','\\\\');
            returnData.files = files;
            returnData.srcID = buttonID;
        }
        this.#win.webContents.send("parseDirectoryForSlippiFilesReturn", returnData);
    }

    async processDirectoryForParse ( buttonID ) {
        if (this.#currentFiles.length > 0) {
            console.log(buttonID);
            const argFiles = [];
            this.#currentFiles.forEach((file) => {
                argFiles.push(this.#directory + '\\\\' + file);
            });
            // call cpp code here
            const cPlusPlusTimer = "simpleParse";
            console.time(cPlusPlusTimer);
            const retData = parseSimple(argFiles);
            console.timeEnd(cPlusPlusTimer);

            // Return JSON
            let jsonStr = retData.JSON.replaceAll(`\\\\\\\\`, `\\`);
            this.#win.webContents.send("parseDirectorySimpleReturn", jsonStr);
        }
    }
}

module.exports = MainModel;