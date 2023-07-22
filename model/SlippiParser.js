const eng = require('./../build/Release/v8engine');
require('nan');

const { parentPort, workerData } = require('worker_threads');

let shouldStop = false;

function shouldWorkerStop() {
    return shouldStop;
}

// Recursively call this to allow a stop in-between loops
function processParseChunk(i, chunkSize, argFiles) {
    if (shouldWorkerStop()) {
        parentPort.postMessage({
            eventName: 'halted'
        });
    } else {
        const chunk = argFiles.slice(i, i + chunkSize);
        // Just Parse
        eng.simpleParse(chunk);
        const numCompleted = i + chunk.length;
        const data = {};
        data.eventName = "parseDirectoryUpdateCount";
        data.count = numCompleted;
        parentPort.postMessage(data);
        if (i + chunkSize < argFiles.length) {
            setImmediate(processParseChunk, i+chunkSize, chunkSize, argFiles);
        } else {
            // Finish loop
            const retData = eng.simplePrint();
            let jsonStr = retData.replaceAll(`\\\\\\\\`, `\\`);
            const data = {};
            data.eventName = "parseDirectoryComplete";
            data.args = jsonStr;
            parentPort.postMessage(data);
        }
    }
}

function processDirectoryForParse (files, dir, chunkSize) {
    if (files.length > 0) {
        eng.resetParse();

        const argFiles = [];
        files.forEach((file) => {
            argFiles.push(dir + '\\\\' + file);
        });

        processParseChunk(0, chunkSize, argFiles);
    }
    return null;
}

// Recursively call this to allow a stop in-between loops
function processComboByTagChunk (i, chunkSize, argFiles, tag) {
    if (shouldWorkerStop()) {
        parentPort.postMessage({
            eventName: 'halted'
        });
    } else {
        const chunk = argFiles.slice(i, i + chunkSize);
        // Find Combos by Tag
        eng.comboParseByTag(chunk, tag);
        const numCompleted = i + chunk.length;
        const data = {};
        data.eventName = "findCombosUpdateCount";
        data.count = numCompleted;
        parentPort.postMessage(data);
        if (i + chunkSize < argFiles.length) {
            setImmediate(processComboByTagChunk, i+chunkSize, chunkSize, argFiles, tag);
        } else {
            // Finish loop
            const retData = eng.comboPrint();
            let jsonStr = retData.replaceAll(`\\\\\\\\`, `\\`);
            const data = {};
            data.eventName = "findCombosComplete";
            data.args = jsonStr;
            parentPort.postMessage(data);
        }
    }
}

function processDirectoryForCombosByTag (files, dir, chunkSize, tag) {
    if (files.length > 0) {
        eng.resetCombo();

        const argFiles = [];
        files.forEach((file) => {
            argFiles.push(dir + '\\\\' + file);
        });

        processComboByTagChunk(0, chunkSize, argFiles, tag);
    }
}

// Recursively call this to allow a stop in-between loops
function processComboByCharChunk (i, chunkSize, argFiles, char) {
    if (shouldWorkerStop()) {
        parentPort.postMessage({
            eventName: 'halted'
        });
    } else {
        const chunk = argFiles.slice(i, i + chunkSize);
        // Find Combos by Tag
        eng.comboParseByChar(chunk, char);
        const numCompleted = i + chunk.length;
        const data = {};
        data.eventName = "findCombosUpdateCount";
        data.count = numCompleted;
        parentPort.postMessage(data);
        if (i + chunkSize < argFiles.length) {
            setImmediate(processComboByCharChunk, i+chunkSize, chunkSize, argFiles, char);
        } else {
            // Finish loop
            const retData = eng.comboPrint();
            let jsonStr = retData.replaceAll(`\\\\\\\\`, `\\`);
            const data = {};
            data.eventName = "findCombosComplete";
            data.args = jsonStr;
            parentPort.postMessage(data);
        }
    }
}

function processDirectoryForCombosByChar (files, dir, chunkSize, char) {
    if (files.length > 0) {
        eng.resetCombo();

        const argFiles = [];
        files.forEach((file) => {
            argFiles.push(dir + '\\\\' + file);
        });

        processComboByCharChunk(0, chunkSize, argFiles, char);
    }
}

// Recursively call this to allow a stop in-between loops
function processComboByCharColorChunk (i, chunkSize, argFiles, char, color) {
    if (shouldWorkerStop()) {
        parentPort.postMessage({
            eventName: 'halted'
        });
    } else {
        const chunk = argFiles.slice(i, i + chunkSize);
        // Find Combos by Tag
        eng.comboParseByCharColor(chunk, char, color);
        const numCompleted = i + chunk.length;
        const data = {};
        data.eventName = "findCombosUpdateCount";
        data.count = numCompleted;
        parentPort.postMessage(data);
        if (i + chunkSize < argFiles.length) {
            setImmediate(processComboByCharColorChunk, i+chunkSize, chunkSize, argFiles, char, color);
        } else {
            // Finish loop
            const retData = eng.comboPrint();
            let jsonStr = retData.replaceAll(`\\\\\\\\`, `\\`);
            const data = {};
            data.eventName = "findCombosComplete";
            data.args = jsonStr;
            parentPort.postMessage(data);
        }
    }
}

function processDirectoryForCombosByCharColor (files, dir, chunkSize, char, color) {
    if (files.length > 0) {
        eng.resetCombo();

        const argFiles = [];
        files.forEach((file) => {
            argFiles.push(dir + '\\\\' + file);
        });

        processComboByCharColorChunk(0, chunkSize, argFiles, char, color);
    }
}

// Recursively call this to allow a stop in-between loops
function processComboByCharTagChunk (i, chunkSize, argFiles, char, tag) {
    if (shouldWorkerStop()) {
        parentPort.postMessage({
            eventName: 'halted'
        });
    } else {
        const chunk = argFiles.slice(i, i + chunkSize);
        // Find Combos by Tag
        eng.comboParseByCharTag(chunk, char, tag);
        const numCompleted = i + chunk.length;
        const data = {};
        data.eventName = "findCombosUpdateCount";
        data.count = numCompleted;
        parentPort.postMessage(data);
        if (i + chunkSize < argFiles.length) {
            setImmediate(processComboByCharTagChunk, i+chunkSize, chunkSize, argFiles, char, tag);
        } else {
            // Finish loop
            const retData = eng.comboPrint();
            let jsonStr = retData.replaceAll(`\\\\\\\\`, `\\`);
            const data = {};
            data.eventName = "findCombosComplete";
            data.args = jsonStr;
            parentPort.postMessage(data);
        }
    }
}

function processDirectoryForCombosByCharTag (files, dir, chunkSize, char, tag) {
    if (files.length > 0) {
        eng.resetCombo();

        const argFiles = [];
        files.forEach((file) => {
            argFiles.push(dir + '\\\\' + file);
        });

        processComboByCharTagChunk(0, chunkSize, argFiles, char, tag);
    }
}

// Recursively call this to allow a stop in-between loops
function processComboByCharTagColorChunk (i, chunkSize, argFiles, char, tag, color) {
    if (shouldWorkerStop()) {
        parentPort.postMessage({
            eventName: 'halted'
        });
    } else {
        const chunk = argFiles.slice(i, i + chunkSize);
        // Find Combos by Tag
        eng.comboParseByCharTagColor(chunk, char, tag, color);
        const numCompleted = i + chunk.length;
        const data = {};
        data.eventName = "findCombosUpdateCount";
        data.count = numCompleted;
        parentPort.postMessage(data);
        if (i + chunkSize < argFiles.length) {
            setImmediate(processComboByCharTagColorChunk, i+chunkSize, chunkSize, argFiles, char, tag, color);
        } else {
            // Finish loop
            const retData = eng.comboPrint();
            let jsonStr = retData.replaceAll(`\\\\\\\\`, `\\`);
            const data = {};
            data.eventName = "findCombosComplete";
            data.args = jsonStr;
            parentPort.postMessage(data);
        }
    }
}

function processDirectoryForCombosByCharTagColor (files, dir, chunkSize, char, tag, color) {
    if (files.length > 0) {
        eng.resetCombo();

        const argFiles = [];
        files.forEach((file) => {
            argFiles.push(dir + '\\\\' + file);
        });

        processComboByCharTagColorChunk(0, chunkSize, argFiles, char, tag, color);
    }
}

parentPort.on('message', (message) => {
    switch (message.evt) {
        case 'processForParse':
            processDirectoryForParse(message.files, message.dir, message.chunk);
            break;
        case 'processForComboTag':
            processDirectoryForCombosByTag(message.files, message.dir, message.chunk, message.tag);
            break;
        case 'processForComboChar':
            processDirectoryForCombosByChar(message.files, message.dir, message.chunk, message.char);
            break;
        case 'processForComboCharColor':
            processDirectoryForCombosByCharColor(message.files, message.dir, message.chunk, message.char, message.color);
            break;
        case 'processForComboCharTag':
            processDirectoryForCombosByCharTag(message.files, message.dir, message.chunk, message.char, message.tag);
            break;
        case 'processForComboCharTagColor':
            processDirectoryForCombosByCharTagColor(message.files, message.dir, message.chunk, message.char, message.tag, message.color);
            break;
        case 'isCancelled':
            parentPort.postMessage({
                evtName: 'isCancelled',
                value: workerData.isCancelled
            });
            break;
        case 'stop':
            shouldStop = message.value;
            break;
    }
});
