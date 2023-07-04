const { dialog } = require('electron');
const { Worker } = require('node:worker_threads');

const fs = require('fs/promises');

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

    async processDirectoryForSlippiFilesWithUI ( event, buttonID ) {

        const filename = dialog.showOpenDialogSync({
            properties: [
                "openDirectory"
            ]
        });
    
        this.processDirectoryForSlippiFiles(event, buttonID, filename);
    }

    async processDirectoryForSlippiFilesWithoutUI (event, buttonID, fileName) {
        this.processDirectoryForSlippiFiles(event, buttonID, [fileName]);
    }

    async processDirectoryForSlippiFiles(event, buttonID, filename) {
        let bIsValid = false;
        const returnData = {};
        returnData.valid = bIsValid;
        let files = [];
        let directoryToCheck;
 
        if (typeof filename !== 'undefined') {
            directoryToCheck = filename[0];
            
            try {
                const dirFiles = await fs.readdir(directoryToCheck);
                dirFiles.forEach(file => {
                    if (file) {
                        const matches = file.match(/\.[0-9a-z]+$/i);
                        if (matches) {
                            const fileType = matches[0];
                            if (fileType === '.slp') {
                                files.push(file);
                            }
                        }
                    }
                })
            } catch (err) {
                returnData.errMsg = err;
            }

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
        data.srcID = buttonID;
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

    async findCombos (event, buttonID, params) {
        console.log(params);

        switch (params.flavor) {
            case 4:
                this.findCombosFromTag(event, buttonID, params.targetTag, params.batchNum);
                break;
        }
    }

    async findCombosFromTag (event, buttonID, tag, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.#worker.postMessage({
            evt: 'processForComboTag',
            dir: this.#directory,
            files: this.#currentFiles,
            tag: tag,
            chunk: chunk
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
                case "findCombosUpdateCount":
                    this.#win.webContents.send("findCombosUpdateCount", data);
                    break;
                case "findCombosComplete":
                    this.#win.webContents.send("findComboEvent", data);
                    break;
            }
        });
      }

}

module.exports = MainModel;