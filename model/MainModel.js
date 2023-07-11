const { dialog } = require('electron');
const { Worker } = require('node:worker_threads');
const SlippiPlayer = require('./SlippiPlayer');

const fs = require('fs/promises');

class MainModel {

    #win = null;
    #currentFiles = [];
    #directory = '';
    #worker = null;

    #usePagination = null;
    #parseInfo = null;
    #comboInfo = null;
    #fileComboMap = null;

    #slippiPlayer = null;

    #bIsCancelled = false;

    #PAGINATION_LOWER_LIMIT = 100;

    #meleeIsoPath = "";
    #slippiPath = "";

    constructor( mainWindow ) {
        this.#meleeIsoPath = "C:\\Users\\garre\\Documents\\My Games\\Dolphin ISOs\\ANIMELEE - COMPLETE EDITION Nabooru.iso";
        this.#slippiPath = "C:\\Users\\garre\\AppData\\Roaming\\Slippi Launcher\\playback\\Slippi Dolphin.exe";
        this.#slippiPlayer = new SlippiPlayer(this.#slippiPath, this.#meleeIsoPath);
        this.#fileComboMap = new Map();
        this.#win = mainWindow;
        this.#usePagination = [false, false, false];
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

    handleProcessedSlippiParse(data) {
        const parsedData = JSON.parse(data.args.replaceAll('\\', '/').replaceAll('/"','\\\"'));
        const numPlayers = parsedData.players.length;
        const totalNumPages = Math.ceil(numPlayers / this.#PAGINATION_LOWER_LIMIT); 
        const bNeedsPagination = numPlayers > this.#PAGINATION_LOWER_LIMIT;

        const page = 1;
        
        const totalNames = [];
        let i = 0;
        while (i < numPlayers) {
            totalNames.push(Object.keys(parsedData.players[i])[0].replaceAll('＃','#').toUpperCase());
            i++
        }
        
        this.#usePagination[0] = bNeedsPagination;
        if (bNeedsPagination) {
            const startIdx = this.#PAGINATION_LOWER_LIMIT * (page-1);
            this.#parseInfo = Object.assign({}, parsedData);
            parsedData.players = parsedData.players.slice(startIdx, startIdx + this.#PAGINATION_LOWER_LIMIT);
        }

        this.#win.webContents.send("serverEvent", {
            args: parsedData,
            totalNames: totalNames,
            eventName: data.eventName,
            needsPagination: bNeedsPagination,
            page: page,
            totalPage: totalNumPages
        });
    }

    async updateParsePagination ( event, buttonID, targetPage ) {
        const numPlayers = this.#parseInfo.players.length;
        const totalNumPages = Math.ceil(numPlayers / this.#PAGINATION_LOWER_LIMIT); 
        const startIdx = this.#PAGINATION_LOWER_LIMIT * (targetPage-1);
        const parsedData = Object.assign({}, this.#parseInfo);
        parsedData.players = parsedData.players.slice(startIdx, startIdx + this.#PAGINATION_LOWER_LIMIT);
        this.#win.webContents.send("serverEvent", {
            args: parsedData,
            eventName: "updatePanelOneAccordionJustAccordion",
            needsPagination: true,
            page: targetPage,
            totalPage: totalNumPages
        });
    }

    handleProcessedComboParse (data) {
        this.#fileComboMap.clear();
        const parsedData = JSON.parse(data.args.replaceAll('\\', '/').replaceAll('/"','\\\"'));
        const files = Object.keys(parsedData);
        const numFiles = files.length;
        let numCombos = 0;
        let comboData = [];
        let i = 0, j = 0;
        while (i < numFiles) {
            j = 0;
            const currentNumCombos = parsedData[files[i]].combos.length;
            while (j < currentNumCombos) {
                comboData[numCombos + j] = {
                    combo: parsedData[files[i]].combos[j],
                    comboNum: j,
                    stage: parsedData[files[i]].stage_ID,
                    file: files[i],
                    target_tag: parsedData[files[i]].target_tag,
                    target_char: parsedData[files[i]].target_char,
                    target_color: parsedData[files[i]].target_color,
                    opponent_tag: parsedData[files[i]].opponent_tag,
                    opponent_char: parsedData[files[i]].opponent_char,
                    opponent_color: parsedData[files[i]].opponent_color
                }
                this.#fileComboMap.set(files[i].substring(files[i].lastIndexOf("/") + 1).replace(/\.[^/.]+$/,"") + "_" + String(j), numCombos + j);
                j++;
            }
            numCombos = numCombos + currentNumCombos;
            i++;
        }

        const totalNumPages = Math.ceil(numCombos / this.#PAGINATION_LOWER_LIMIT); 
        const bNeedsPagination = numCombos > this.#PAGINATION_LOWER_LIMIT;
        const page = 1;

        this.#usePagination[2] = bNeedsPagination;
        this.#comboInfo = [...comboData];
        if (bNeedsPagination) {
            const startIdx = this.#PAGINATION_LOWER_LIMIT * (page-1);
            comboData = comboData.slice(startIdx, startIdx + this.#PAGINATION_LOWER_LIMIT);
        }

        this.#win.webContents.send("findComboEvent", {
            eventName: data.eventName,
            args: {
                combos: comboData,
                totalCombos: numCombos,
                page: page,
                needsPagination: bNeedsPagination,
                totalPage: totalNumPages
            }
        });
    }

    async updateComboPagination ( event, buttonID, targetPage ) {
        const numCombos = this.#comboInfo.length;
        const totalNumPages = Math.ceil(numCombos / this.#PAGINATION_LOWER_LIMIT); 
        const startIdx = this.#PAGINATION_LOWER_LIMIT * (targetPage-1);
        let parsedData = [...this.#comboInfo];
        parsedData = parsedData.slice(startIdx, startIdx + this.#PAGINATION_LOWER_LIMIT);
        this.#win.webContents.send("findComboEvent", {
            eventName: "updatePanelThreeAccordionJustAccordion",
            args: {
                combos: parsedData,
                needsPagination: true,
                page: targetPage,
                totalPage: totalNumPages
            }
        });
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
            case 1:
                this.findCombosFromTag(event, buttonID, params.targetTag, params.batchNum);
                break;
            case 2:
                this.findCombosFromChar(event, buttonID, params.targetChar, params.batchNum);
                break;
            case 3:
                this.findCombosFromCharColor(event, buttonID, params.targetChar, params.targetColor, params.batchNum);
                break;
            case 4:
                this.findCombosFromCharTag(event, buttonID, params.targetChar, params.targetTag, params.batchNum);
                break;
            case 5:
                this.findCombosFromCharTagColor(event, buttonID, params.targetChar, params.targetTag, params.targetColor, params.batchNum);
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
    
    async findCombosFromChar(event, buttonID, char, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.#worker.postMessage({
            evt: 'processForComboChar',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            chunk: chunk
        });
    }

    async findCombosFromCharColor(event, buttonID, char, color, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.#worker.postMessage({
            evt: 'processForComboCharColor',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            color: color,
            chunk: chunk
        });
    }

    async findCombosFromCharTag(event, buttonID, char, tag, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.#worker.postMessage({
            evt: 'processForComboCharTag',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            tag: tag,
            chunk: chunk
        });
    }

    async findCombosFromCharTagColor(event, buttonID, char, tag, color, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.#worker.postMessage({
            evt: 'processForComboCharTagColor',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            tag: tag,
            color: color,
            chunk: chunk
        });
    }

    async playCombo (event, sourceID, gameAndCombo) {
        const game = gameAndCombo.game;
        const comboNum = gameAndCombo.combo;
        const comboIndex = this.#fileComboMap.get(game + "_" + comboNum);

        const combos = [{
            startFrame: parseInt(this.#comboInfo[comboIndex].combo.startFrame),
            endFrame: parseInt(this.#comboInfo[comboIndex].combo.endFrame),
            filePath: this.#comboInfo[comboIndex].file
        }];
    
        await this.#slippiPlayer.playCombos(combos);
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
                    this.handleProcessedSlippiParse(data);
                    break;
                case "halted":
                    console.log("horses held");
                    break;
                case "findCombosUpdateCount":
                    this.#win.webContents.send("findCombosUpdateCount", data);
                    break;
                case "findCombosComplete":
                    this.handleProcessedComboParse(data);
                    break;
            }
        });
      }

}

module.exports = MainModel;