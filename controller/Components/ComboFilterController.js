const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");
const Utility = require("../../Utility");

const HasMoveRule = require("../../view/Components/FilterRules/HasMoveRule");
const HasActionIDRule = require("../../view/Components/FilterRules/HasActionIDRule");
const HasOpponentRule = require("../../view/Components/FilterRules/HasOpponentRule");
const HasStageRule = require("../../view/Components/FilterRules/HasStageRule");

class ComboFilterController extends EventEmitter {

    events = [
        "showFilterModal",
        "hideFilterModal",
        "changeModalInput",
        "validateModalInput"
    ]

    #flavorMap = null;

    constructor () {
        super();
        this.createFlavorMap();
        this.setUpListeners();
    }

    getFlavorMap () {
        return this.#flavorMap;
    }

    createFlavorMap () {
        this.#flavorMap = new Map();

        let i = 0;
        const rules = [HasMoveRule, HasActionIDRule, HasOpponentRule, HasStageRule];
        while (i < rules.length) {
            this.#flavorMap.set(rules[i].getFlavor(), {
                name: rules[i].getRuleName(),
                optionName: rules[i].getOptionName(),
                isSingleton: rules[i].getIsSingleton(),
                constructor: rules[i],
                allowsMultipleOptions: rules[i].getAllowsMultipleOptions(),
                skipsValidation: rules[i].getSkipValidation(),
                getInputDataListHTML: rules[i].getInputDataListHTML,
                getValuesFromInputForRule: rules[i].getValuesFromInputForRule,
                getInputValFromEvent: rules[i].getInputValFromEvent,
                dependsOnActionStates: rules[i].getDependsOnActionStates(),
                getHTMLForInputOnExistingRule: rules[i].getHTMLForInputOnExistingRule,
                hasDeleteableMiniRules: rules[i].getHasDeleteableMiniRules(),
                doesInputRequireEventListener: rules[i].getInputRequiresEventListener(),
                doesDropdownRequireEventListener: rules[i].getDropdownRequireEventListener(),
                alterInputElementForFlavor: rules[i].alterInputElementForFlavor,
                applyStaticCallbacksToModalInput: rules[i].applyStaticCallbacksToModalInput,
                validateInputForMainInput: rules[i].validateInputForMainInput,
                isCorrectEventForMainInput: rules[i].isCorrectEventForMainInput
            });
            i++;
        }
    }

    setUpListeners () {
        // Listeners from Model
        const that = this;
        ipcRenderer.on("showFilterModal", (evt, args) => {
            this.emit("showFilterModal", {
                success: args.args.success,
                path: args.args.path
            });
        });
    }

    getEvents () {
        return this.events;
    }

    cb_emitAcceptButtonEvent (success, rules) {
        if (success) {
            const data = {
                eventName: "updateComboFilterRules",
                sourceID: "slippiComboFilterApplyButton",
                val: rules
            };
            try {
                ipcRenderer.send("clientEvent", data);
            } catch (err) {
                console.log(err);
            }
        }
    }

    cb_handleRuleFlavorSelection (flavor, charID) {
        const sanitizedCharID = parseInt(charID);
        switch (parseInt(flavor)) {
            // Has Move
            case 0:
                const moveIDs = Utility.getMoveIDsForChar(sanitizedCharID);
                const moveNames = Utility.getMoveNamesForChar(sanitizedCharID);
                this.emit("changeModalInput", {
                    flavor: flavor,
                    moveNames: moveNames,
                    moveIDs: moveIDs
                });
                break;
            // Has Action State
            case 1:
            // Include / Exclude Action State on String
            case 6:
            case 7:
                const actionIDs = Utility.getActionIDsForChar(sanitizedCharID);
                const actionNames = Utility.getActionNamesForChar(sanitizedCharID);
                this.emit("changeModalInput", {
                    flavor: flavor,
                    actionNames: actionNames,
                    actionIDs: actionIDs
                });
                break;
            // Damage
            case 2:
            case 3:
                this.emit("changeModalInput", {
                    flavor: flavor
                });
                break;
            case 4:
            case 5:
                const characters = Utility.getCharacterNames();
                const characterIDs = Utility.getCharacterIDs();
                this.emit("changeModalInput", {
                    flavor: flavor,
                    charNames: characters,
                    charIDs: characterIDs
                });
                break;
        }

    }

    cb_handleInputValidation (target, listDiv, flavor) {
        const newVal = target.value;
        let isValid = false;
        let obj;
        
        switch (parseInt(flavor)) {
            case 0:
            case 1:
            case 6:
            case 7:
                obj = listDiv.querySelector(`option[value="${newVal}"]`);
                if (obj !== null) {
                    isValid = true;
                }
                break;
            case 2:
            case 3:
                // I'm not convinced you can enter an invalid string into a numeric input
                isValid = true;
                break;
            case 4:
            case 5:
                if (this.getFlavorMap().get(parseInt(flavor)).validateInputForMainInput()) isValid = true;
                break;
        }

        this.emit("validateModalInput", isValid);
    }

    cb_handleInputForMainInputValidation (newVal, listDiv, flavor) {
        let isValid = false;
        let obj;

        switch (parseInt(flavor)) {
            case 4:
            case 5:
                if (this.getFlavorMap().get(parseInt(flavor)).validateInputForMainInput()) isValid = true;
                break;
            case 6:
            case 7:
                obj = listDiv.querySelector(`option[value="${newVal}"]`);
                if (obj !== null) {
                    isValid = true;
                }
                break;
            default:
                if (this.getFlavorMap().get(parseInt(flavor)).validateInputForMainInput(listDiv, newVal)) isValid = true;
                break;
        }

        return isValid;
    }

    showModal(args) {
        const eventData = {args};
        this.emit("showFilterModal", eventData);
    }

    hideModal(args) {
        const eventData = {args};
        this.emit("hideFilterModal", eventData);
    }
}

module.exports = ComboFilterController;