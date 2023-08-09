const path = require('path');
const { join } = require('path');
const mainModulePath = path.join(__dirname, "..", "model", "MainModel");
const MainModel = require(mainModulePath);

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