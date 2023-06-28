const { dialog } = require('electron');
const { Worker } = require('node:worker_threads');

const fs = require('fs');

class MainModel {

    #win = null;
    #currentFiles = [];
    #directory = '';
    #worker = null;

    #bIsCancelled = false;

    constructor( mainWindow ) {
        this.#win = mainWindow;
        this.createWorker();
    }

    async processDirectoryForSlippiFiles ( event, buttonID ) {

        const filename = dialog.showOpenDialogSync({
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
        
        const data = {};
        data.eventName = "parseDirectoryForSlippiFiles";
        data.args = returnData;
        event.sender.send("serverEvent",data);
    }

    async processDirectoryForParse ( event, buttonID, chunk ) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.#worker.postMessage({
            evt: 'processForParse',
            dir: this.#directory,
            files: this.#currentFiles,
            chunk: chunk
        });
    }

    async cancelComputation (buttonID) {
        this.#worker.postMessage({
            evt: 'stop',
            value: true
        });
    }

    createWorker () {
        this.#worker = new Worker(__dirname + '\\SlippiParser.js',
        {
            workerData: {
                isCancelled: false
            }
        });
        this.#worker.on("message", (data) => {
            switch (data.eventName) {
                case "isCancelled":
                    console.log('are we cancelled? ' + data.value);
                    break;
                case "parseDirectoryUpdateCount":
                    this.#win.webContents.send("parseDirectoryUpdateCount", data);
                    break;
                case "parseDirectoryComplete":
                    this.#win.webContents.send("serverEvent", data);
                    break;
                case "halted":
                    console.log("horses held");
                    break;
            }
        });
      }

}

module.exports = MainModel;