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
        eng.comboParse(chunk, tag);
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

parentPort.on('message', (message) => {
    switch (message.evt) {
        case 'processForParse':
            processDirectoryForParse(message.files, message.dir, message.chunk);
            break;
        case 'processForComboTag':
            processDirectoryForCombosByTag(message.files, message.dir, message.chunk, message.tag);
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
