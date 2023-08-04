const { app } = require('electron');
const { dialog } = require('electron');
const { Worker } = require('node:worker_threads');
const SlippiPlayer = require('./SlippiPlayer');

const fs = require('fs/promises');
const { join } = require('path');

class MainModel {

    #win = null;
    #currentFiles = [];
    #directory = '';
    #worker = null;

    #usePagination = null;
    #parseInfo = null;
    #comboInfo = null;
    #fileComboMap = null;
    #comboFilterParams = null;
    #isFilterOn = null;

    #slippiPlayer = null;
    #lastCharacter = null;

    #bIsCancelled = false;

    #paginationLowerLimit = 100;
    #frameLeniency = 45;
    #batchSize = 20;

    #appDataPath = "";
    #meleeIsoPath = "";
    #slippiPath = "";
    #loggerPath = "";
    #APP_NAME = "pvstvbot.exe";

    constructor( mainWindow ) {
        this.#slippiPlayer = new SlippiPlayer(this.#APP_NAME);
        this.#fileComboMap = new Map();
        this.isFilterOn = false;
        this.#comboFilterParams = [];
        this.#win = mainWindow;
        this.#usePagination = [false, false, false];
        this.createWorker();
    }

    async checkPaths () {
        // Set Up AppData
        let actualAppDataPath, found;
        const appDataPath = join(app.getPath("appData"), this.#APP_NAME);
        try {
            await fs.access(appDataPath);
            actualAppDataPath = appDataPath;
            found = true;
        } catch {
            try {
                await fs.mkdir(appDataPath);
                actualAppDataPath = appDataPath;
                found = true;
            } catch (err) {
                console.log(err);
            }
        }

        if (!found) {
            try {
                await fs.access(appDataPath);
                actualAppDataPath = appDataPath;
                return true;
            } catch (err) {
                console.log(err);
            }
        }

        // Create appdata if it doesn't exist
        let appData;
        const appDataJSONPath = join(actualAppDataPath, "appData.json");
        this.#appDataPath = appDataJSONPath;
        try {
            await this.initiateLogger(actualAppDataPath);
        } catch (err) {
            console.log(err);
        }
        try {
            await fs.access(appDataJSONPath);
            appData = await fs.readFile(appDataJSONPath);
            appData = JSON.parse(appData.toString());
        } catch {
            try {
                // Default app data
                appData = {
                    slippiPath: "",
                    meleeISOpath: ""
                }
                await fs.writeFile(appDataJSONPath, JSON.stringify(appData, null, 2));
            } catch (err) {
                console.log(err);
            }
        }

        // Check if SLIPPI path exists
        let updateAppData = false;
        if (appData.slippiPath.length === 0) {
            appData.slippiPath = join(app.getPath("appData"), "Slippi Launcher", "playback", "Slippi Dolphin.exe");
        }

        try {
            await fs.access(appData.slippiPath);
            updateAppData = true;
        } catch {
            // send message to main window asking for slippi path
            this.#win.webContents.send("serverEvent", {
                eventName: "askForSlippiPath",
            });
        }

        if (updateAppData) {
            // Check if Melee ISO exists
            try {
                await fs.access(appData.meleeISOpath);
            } catch {
                // Send message to main window asking for melee iso path
                this.#win.webContents.send("serverEvent", {
                    eventName: "askForMeleeIsoPath",
                });
            }
        }

        if (updateAppData) this.updateAppData(appData);

        // Debug: uncomment to show filter window immediately
        // this.#lastCharacter = 23;
        // this.getFilterParams();
    }

    async initiateLogger (actualAppDataPath) {
        const logPath = join(actualAppDataPath, "log.txt");
        const logHeader = "Log starting at: " + JSON.stringify(new Date().toJSON()) + "\n\n";
        await fs.writeFile(logPath, logHeader);
        this.#loggerPath = logPath;
        this.#slippiPlayer.setLoggerPath(logPath);
    }

    async updateAppData (appData) {
        try {
            await fs.writeFile(this.#appDataPath, JSON.stringify(appData, null, 2));
            this.#slippiPath = appData.slippiPath;
            this.#meleeIsoPath = appData.meleeISOpath;
            this.#slippiPlayer.setSlippiPath(this.#slippiPath);
            this.#slippiPlayer.setIsoPath(this.#meleeIsoPath);
            // Optional arguments
            if (Object.hasOwnProperty.call(appData, 'paginationSize')) {
                this.#paginationLowerLimit = appData.paginationSize;
            }
            if (Object.hasOwnProperty.call(appData, 'frameLeniency')) {
                this.#frameLeniency = appData.frameLeniency;
            }
            if (Object.hasOwnProperty.call(appData, 'batchSize')) {
                this.#batchSize = appData.batchSize;
            }

        } catch (err) {
            console.log("could not write to appData: " + err);
        }
        this.updateClientAppData();
    }

    updateClientAppData () {
        // send appData to app window
        this.#win.webContents.send("updateAppData", {
            eventName: "updateAppData",
            args: {
                slippiPath: this.#slippiPath,
                meleePath: this.#meleeIsoPath,
                batchSize: this.#batchSize,
                frameLeniency: this.#frameLeniency,
                paginationLowerLimit: this.#paginationLowerLimit
            }
        });
    }

    async browserForSlippiPath (event, source) {
        const appDataPath = app.getPath("appData");
        const filename = await dialog.showOpenDialog({
            defaultPath: appDataPath,
            properties: [
                "openFile"
            ],
            filters: [
                {name: 'Executables', extensions: ['exe']},
                {name: 'All Files', extensions: ['*'] }
            ]
        });

        let success = false;
        if (!filename.canceled) {
            success = true;
        }

        let evtName = "receiveSlippiPath";
        if (source === "settings") evtName = "receiveSlippiPathForSettings";
        event.sender.send(evtName,{
            eventName: evtName,
            args: {
                success: success,
                path: filename.filePaths[0]
            }
        });
    }

    async browserForMeleeIsoPath (event, source) {
        const appDataPath = app.getPath("appData");
        const documentsPath = app.getPath("documents");
        const filename = await dialog.showOpenDialog({
            defaultPath: documentsPath,
            properties: [
                "openFile"
            ],
            filters: [
                {name: 'ISO files', extensions: ['iso']},
                {name: 'All Files', extensions: ['*'] }
            ]
        });

        let success = false;
        if (!filename.canceled) {
            success = true;
        }

        let evtName = "receiveSlippiPath";
        if (source === "settings") evtName = "receiveSlippiPathForSettings";
        event.sender.send(evtName,{
            eventName: evtName,
            args: {
                success: success,
                path: filename.filePaths[0]
            }
        });
    } 

    async updateSlippiPath (event, args) {
        let appData;
        if (args.success) {
            try {
                await fs.access(this.#appDataPath);
                appData = await fs.readFile(this.#appDataPath);
                appData = JSON.parse(appData.toString());
            } catch (err) {
                console.log("could not update slippi path: " + err);
            }
            try {
                appData.slippiPath = args.path;
                await fs.writeFile(this.#appDataPath, JSON.stringify(appData, null, 2));
                this.#slippiPath = args.path;
                this.#slippiPlayer.setSlippiPath(this.#slippiPath);

                // Check if Melee ISO exists
                try {
                    await fs.access(appData.meleeISOpath);
                } catch {
                    // Send message to main window asking for melee iso path
                    this.#win.webContents.send("serverEvent", {
                        eventName: "askForMeleeIsoPath",
                    });
                }
            } catch (err) {
                console.log(err);
            }

        }
    }

    async updateMeleeIsoPath (event, args) {
        let appData;
        if (args.success) {
            try {
                await fs.access(this.#appDataPath);
                appData = await fs.readFile(this.#appDataPath);
                appData = JSON.parse(appData.toString());
            } catch (err) {
                console.log("could not update melee ISO: " + err);
            }
            try {
                appData.meleeISOpath = args.path;
                await fs.writeFile(this.#appDataPath, JSON.stringify(appData, null, 2));
                this.#meleeIsoPath = args.path;
                this.#slippiPlayer.setIsoPath(this.#meleeIsoPath);
            } catch (err) {
                console.log(err);
            }
        }
    }

    async updateBothSlippiPaths (event, args) {
        try {
            let appData = await fs.readFile(this.#appDataPath);
            appData = JSON.parse(appData.toString());

            appData.slippiPath = args.slippiPath;
            appData.meleeISOpath = args.isoPath;
            this.updateAppData(appData);
        } catch (err) {
            console.log("could not update appdata from client");
            console.log(err);
        }
    }

    async updateNonPathSettings (event, args) {
        try {
            let appData = await fs.readFile(this.#appDataPath);
            appData = JSON.parse(appData.toString());

            const bUpdatePagination = appData.paginationSize !== args.paginationSize;

            appData.batchSize = args.batchSize;
            appData.frameLeniency = args.frameLeniency;
            appData.paginationSize = args.paginationSize;

            await this.updateAppData(appData);

            if (bUpdatePagination) {
                this.updateParsePagination(null, null, 1);
                this.updateComboPagination(null, null, 1);
            }
        } catch (err) {
            console.log("could not update appdata from client");
            console.log(err);
        }
    }

    async processDirectoryForSlippiFilesWithUI ( event, buttonID ) {

        const file = await dialog.showOpenDialog({
            properties: [
                "openDirectory"
            ]
        });
        
        if (!file.canceled) {
            this.processDirectoryForSlippiFiles(event, buttonID, file.filePaths);
        }
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
        const totalNumPages = Math.ceil(numPlayers / this.#paginationLowerLimit); 
        const bNeedsPagination = numPlayers > this.#paginationLowerLimit;

        const page = 1;
        
        const totalNames = [];
        let i = 0;
        while (i < numPlayers) {
            totalNames.push(Object.keys(parsedData.players[i])[0].replaceAll('＃','#').toUpperCase());
            i++
        }
        
        this.#usePagination[0] = bNeedsPagination;
        if (bNeedsPagination) {
            const startIdx = this.#paginationLowerLimit * (page-1);
            this.#parseInfo = Object.assign({}, parsedData);
            parsedData.players = parsedData.players.slice(startIdx, startIdx + this.#paginationLowerLimit);
        }

        this.#win.webContents.send("serverEvent", {
            args: parsedData,
            totalNames: totalNames,
            eventName: data.eventName,
            needsPagination: bNeedsPagination,
            page: page,
            totalPage: totalNumPages,
            hitsThisPage: parsedData.length,
            hitsTotal: numPlayers
        });
    }

    async updateParsePagination ( event, buttonID, targetPage ) {
        if (this.#parseInfo && this.#parseInfo.players) {
            const numPlayers = this.#parseInfo.players.length;
                if (numPlayers > 0) {
                const totalNumPages = Math.ceil(numPlayers / this.#paginationLowerLimit); 
                const startIdx = this.#paginationLowerLimit * (targetPage-1);
                const parsedData = Object.assign({}, this.#parseInfo);
                parsedData.players = parsedData.players.slice(startIdx, startIdx + this.#paginationLowerLimit);
                this.#win.webContents.send("serverEvent", {
                    args: parsedData,
                    eventName: "updatePanelOneAccordionJustAccordion",
                    needsPagination: true,
                    page: targetPage,
                    totalPage: totalNumPages,
                    hitsThisPage: parsedData.length,
                    hitsTotal: numPlayers
                });
            }
        }
    }

    handleProcessedComboParse (data) {
        this.#comboFilterParams = [];
        this.#isFilterOn = false;
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
                    opponent_color: parsedData[files[i]].opponent_color,
                    is_manually_hidden: false,
                    notes: ''
                }
                this.#fileComboMap.set(files[i].substring(files[i].lastIndexOf("/") + 1).replace(/\.[^/.]+$/,"") + "_" + String(j), numCombos + j);
                j++;
            }
            numCombos = numCombos + currentNumCombos;
            i++;
        }

        this.processedComboParse(numCombos, comboData, true, data.eventName);
    }

    async updateComboFilterRules ( event, buttonID, rules ) {
        this.#isFilterOn = true;
        this.#comboFilterParams = rules;

        const tempCombos = this.getFileredCombosFromAll();
        const numCombos = tempCombos.length;

        this.processedComboParse(numCombos, tempCombos, false, "findCombosComplete");
    }

    processedComboParse (numCombos, comboData, updateComboInfo, eventName) {
        const totalNumPages = Math.ceil(numCombos / this.#paginationLowerLimit); 
        const bNeedsPagination = numCombos > this.#paginationLowerLimit;
        const page = 1;

        this.#usePagination[2] = bNeedsPagination;
        if (updateComboInfo) this.#comboInfo = [...comboData];
        if (bNeedsPagination) {
            const startIdx = this.#paginationLowerLimit * (page-1);
            comboData = comboData.slice(startIdx, startIdx + this.#paginationLowerLimit);
        }

        this.#win.webContents.send("findComboEvent", {
            eventName: eventName,
            args: {
                combos: comboData,
                totalCombos: numCombos,
                page: page,
                needsPagination: bNeedsPagination,
                totalPage: totalNumPages,
                hitsThisPage: comboData.length,
                hitsTotal: numCombos
            }
        });
    }

    getFileredCombosFromAll () {
        const allCombos = [...this.#comboInfo];
        const rules = this.#comboFilterParams;
        const tempCombos = allCombos.filter((combo) => {
            let isValid = true;
            if (rules.minNumMoves > combo.combo.moves.length) isValid = false;
            
            if (rules.maxNumMoves < combo.combo.moves.length) isValid = false;

            if (rules.doesKill && (combo.combo.didKill === 'false')) isValid = false;

            if (combo.is_manually_hidden) isValid = false;

            const comboDamage = parseFloat(combo.combo.endPercent) - parseFloat(combo.combo.startPercent);

            if (isValid) {
                let i = 0;
                while (i < rules.ruleList.length) {
                    const option = rules.ruleList[i].option;
                    let id, comboActionIDs;
                    if (!Array.isArray(option)) {
                        id = option.replace(/(^\d+)(.+$)/i,'$1');
                    }

                    switch (parseInt(rules.ruleList[i].flavorType)) {
                        case 0:
                            if (combo.combo.moves.filter(m => m.moveID === id).length === 0) isValid = false;
                            break;
                        case 1:
                            if (combo.combo.moves.filter(m => m.actionID === id).length === 0) isValid = false;
                            break;
                        case 2:
                            // Total Damage > X
                            if (comboDamage <= parseFloat(option)) isValid = false;
                            break;
                        case 3:
                            // Total Damage < X
                            if (comboDamage >= parseFloat(option)) isValid = false;
                            break;
                        case 4:
                            if (!option.includes(parseInt(combo.opponent_char))) isValid = false;
                            break;
                        case 5:
                            if (!(option.includes(parseInt(combo.stage)))) isValid = false;
                            break;
                        case 6:
                            comboActionIDs = combo.combo.moves.map(a => parseInt(a.actionID));
                            if (!(this._hasConsecutiveSubset(comboActionIDs, option))) isValid = false;
                            break;
                        case 7:
                            comboActionIDs = combo.combo.moves.map(a => parseInt(a.actionID));
                            if ((this._hasConsecutiveSubset(comboActionIDs, option))) isValid = false;
                            break;
                    }
                    i++;
                }
            }

            return isValid;
        });

        return tempCombos;
    }

    _hasConsecutiveSubset (mainArray, targetArray) {
        let mainIdx = 0;
        const filteredArray = mainArray.filter(e => {
            if (e === targetArray[mainIdx]) {
                mainIdx++;
                return true;
            }
            return false;
        });
        return filteredArray.length === targetArray.length;
    }

    async updateComboPagination ( event, buttonID, targetPage ) {
        if (this.#comboInfo && this.#comboInfo.length > 0) {
            let parsedData;
            if (this.#isFilterOn) {
                parsedData = this.getFileredCombosFromAll();
            } else {
                parsedData = [...this.#comboInfo];
            }

            parsedData = parsedData.filter(c => {return !c.is_manually_hidden});

            const numCombos = parsedData.length;
            const totalNumPages = Math.ceil(numCombos / this.#paginationLowerLimit); 
            const startIdx = this.#paginationLowerLimit * (targetPage-1);

            parsedData = parsedData.slice(startIdx, startIdx + this.#paginationLowerLimit);
            this.#win.webContents.send("findComboEvent", {
                eventName: "updatePanelTwoAccordionJustAccordion",
                args: {
                    combos: parsedData,
                    needsPagination: true,
                    page: targetPage,
                    totalPage: totalNumPages,
                    hitsThisPage: parsedData.length,
                    hitsTotal: numCombos
                }
            });
        }
    }

    async processDirectoryForParse ( event, buttonID, chunk ) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.writeWorkerLog("Process for Parse", JSON.stringify({
            dir: this.#directory,
            files: this.#currentFiles,
            chunk: chunk
        }));

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

        this.writeWorkerLog("Process for Combos, Tag", JSON.stringify({
            tag: tag,
            chunk: chunk
        }));

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

        this.writeWorkerLog("Process for Combos, Char", JSON.stringify({
            char: char,
            chunk: chunk
        }));

        this.#worker.postMessage({
            evt: 'processForComboChar',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            chunk: chunk
        });
        this.#lastCharacter = char;
    }

    async findCombosFromCharColor(event, buttonID, char, color, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.writeWorkerLog("Process for Combos, Char, Color", JSON.stringify({
            char: char,
            color: color,
            chunk: chunk
        }));

        this.#worker.postMessage({
            evt: 'processForComboCharColor',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            color: color,
            chunk: chunk
        });
        this.#lastCharacter = char;
    }

    async findCombosFromCharTag(event, buttonID, char, tag, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.writeWorkerLog("Process for Combos, Char, Tag", JSON.stringify({
            char: char,
            tag: tag,
            chunk: chunk
        }));

        this.#worker.postMessage({
            evt: 'processForComboCharTag',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            tag: tag,
            chunk: chunk
        });
        this.#lastCharacter = char;
    }

    async findCombosFromCharTagColor(event, buttonID, char, tag, color, chunk) {
        this.#worker.postMessage({
            evt: 'stop',
            value: false
        });

        this.writeWorkerLog("Process for Combos, Char, Tag, Color", JSON.stringify({
            char: char,
            tag: tag,
            color: color,
            chunk: chunk
        }));

        this.#worker.postMessage({
            evt: 'processForComboCharTagColor',
            dir: this.#directory,
            files: this.#currentFiles,
            char: char,
            tag: tag,
            color: color,
            chunk: chunk
        });
        this.#lastCharacter = char;
    }

    async playCombo (event, sourceID, gameAndCombo) {
        const game = gameAndCombo.game;
        const comboNum = gameAndCombo.combo;
        const comboIndex = this.#fileComboMap.get(game + "_" + comboNum);
        const bDidKill = this.#comboInfo[comboIndex].combo.didKill === 'true';
        const endFrame = parseInt(this.#comboInfo[comboIndex].combo.endFrame);

        const combos = [{
            startFrame: parseInt(this.#comboInfo[comboIndex].combo.startFrame) - 120, // buffering for more time
            endFrame: bDidKill ? endFrame + 240 : endFrame,
            filePath: this.#comboInfo[comboIndex].file
        }];
    
        await this.#slippiPlayer.playCombos(combos);
    }

    async playAllCombos (event, sourceID) {
        const combos = [];
        let i = 0;
        while (i < this.#comboInfo.length) {
            combos.push({
                startFrame: parseInt(this.#comboInfo[i].combo.startFrame) - 120,
                endFrame: parseInt(this.#comboInfo[i].combo.endFrame),
                filePath: this.#comboInfo[i].file
            });
            i++;
        }

        await this.#slippiPlayer.playCombos(combos);
    }

    async getFilterParams (event, sourceID) {
        this.#win.webContents.send("showFilterModal", {
            eventName: "showFilterModal",
            args: {
                params: this.#comboFilterParams,
                lastChar: this.#lastCharacter
            }
        });
    }

    async retrieveComboNotes (event, comboNum) {
        if (this.#comboInfo[comboNum]) return this.#comboInfo[comboNum].notes;
        return '';
    }

    saveComboNotes (event, args) {
        const comboNum = args.comboNum;
        let notes = args.notes;

        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
            "`": '&#x96;'
        };

        notes = notes.replace(/[&<>"'/`]/ig, (n)=>(map[n]));

        if (this.#comboInfo[comboNum]) this.#comboInfo[comboNum].notes = notes;
    }

    hideCombo (event, args) {
        const game = args.game;
        const comboNum = args.combo;
        const comboIndex = this.#fileComboMap.get(game + "_" + comboNum);
        if (this.#comboInfo[comboIndex]) {
            const currPage = args.page;
            this.#comboInfo[comboIndex].is_manually_hidden = true;
            this.updateComboPagination(event, null, currPage);
        }
    }

    restoreCombos (event, args) {
        const currPage = args.page;
        if (this.#comboInfo) {
            let i = 0;
            while (i < this.#comboInfo.length) {
                this.#comboInfo[i].is_manually_hidden = false;
                i++;
            }
            this.updateComboPagination(event, null, currPage);
        }

    }

    async writeWorkerLog (commandHeader, command) {
        try {
            const commandLine = " [" + command + "]\n\n";
            await fs.appendFile(this.#loggerPath, `${commandHeader}:\n`);
            await fs.appendFile(this.#loggerPath, commandLine);
        } catch (err) {
            console.log("could not write to logger: " + err);
        }
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