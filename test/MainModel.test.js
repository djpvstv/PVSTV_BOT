const path = require('path');
const { join } = require('path');
const test = require('node:test');
const mainModulePath = path.join(__dirname, "..", "model", "MainModel");
const MainModel = require(mainModulePath);
const fs = require('fs/promises');
const comboTestDataJSONPath = path.join(__dirname, "testFiles", "comboTestData.json");
const test = require("node:test");

const model = new MainModel({});

test("Validate Consecutive Subset Method", () => {
    // Setup - Basic
    let mainArray = [1, 2, 3, 4, 5, 6];
    let targetArray = [2, 3];

    // Call, validate
    expect(model._hasConsecutiveSubset(mainArray, targetArray)).toBe(true);

    // Setup - Skip 
    targetArray = [2, 4];

    // Call, validate
    expect(model._hasConsecutiveSubset(mainArray, targetArray)).toBe(false);
});

test("Check Minimum Moves Filter", async () => {
    // Setup
    const comboData = await fs.readFile(comboTestDataJSONPath);
    model.setComboInfo(JSON.parse(comboData.toString()));

    const minNumMoves = 3;

    // Add minimum moves filter
    model.setComboFilterParams({
        minNumMoves: minNumMoves,
        maxNumMoves: 99,
        doesKill: false,
        is_manually_hidden: false,
        ruleList: []
    });

    // Call
    const filteredData = model.getFileredCombosFromAll();

    // Verify We Filtered Correctly
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].combo.moves.length).toBeGreaterThanOrEqual(minNumMoves);

});

test("Check Maximum Moves Filter", async () => {
    // Setup
    const comboData = await fs.readFile(comboTestDataJSONPath);
    model.setComboInfo(JSON.parse(comboData.toString()));

    const maxNumMoves = 3;

    // Add maximum moves filter
    model.setComboFilterParams({
        minNumMoves: 0,
        maxNumMoves: maxNumMoves,
        doesKill: false,
        is_manually_hidden: false,
        ruleList: []
    });

    // Call
    const filteredData = model.getFileredCombosFromAll();

    // Verify We Filtered Correctly
    expect(filteredData.length).toBe(8);
    expect(filteredData[0].combo.moves.length).toBeLessThanOrEqual(maxNumMoves);

});

test("Check Character Filter", async () => {
    // Setup
    const comboData = await fs.readFile(comboTestDataJSONPath);
    model.setComboInfo(JSON.parse(comboData.toString()));

    const hasCharacter = "1";

    // Add character filter
    model.setComboFilterParams({
        minNumMoves: 0,
        maxNumMoves: 99,
        doesKill: false,
        is_manually_hidden: false,
        ruleList: [{
            flavorType: 4,
            option: hasCharacter
        }]
    });

    // Call
    const filteredData = model.getFileredCombosFromAll();

    // Verify We Filtered Correctly
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].opponent_char).toBe(hasCharacter);
});


// This test is useless in that it can't await the results
// But it will plot an actual output, so run it anyway
test("Tag and Character Search on Replay", async () => {
    // Setup
    const comboPath = path.join(__dirname, "testFiles");

    const targetChar = 23; // Roy
    const targetTag = "PVSTV#1"; // Roy's tag

    // Set up test worker
    let data;
    const worker = model.createWorkerForTest();
    const e = worker.once("message", async (workerData) => {
        console.log(workerData);
        data = workerData;
    });

    // Call
    model.setDirectory(comboPath);
    model.setCurrentFiles(["Game_1.slp"]);
    model.findCombosFromCharTag(null, null, targetChar, targetTag, 1, false);
});