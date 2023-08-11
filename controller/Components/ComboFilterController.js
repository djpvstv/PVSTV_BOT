const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");
const Utility = require("../../Utility");

const HasMoveRule = require("../../view/Components/FilterRules/HasMoveRule");
const HasActionIDRule = require("../../view/Components/FilterRules/HasActionIDRule");
const HasOpponentRule = require("../../view/Components/FilterRules/HasOpponentRule");
const HasStageRule = require("../../view/Components/FilterRules/HasStageRule");
const HasMinDamageRule = require("../../view/Components/FilterRules/HasMinDamageRule");
const HasMaxDamageRule = require("../../view/Components/FilterRules/HasMaxDamageRule");
const HasActionIDStringRule = require("../../view/Components/FilterRules/HasActionIDStringRule");
const ExcludeActionIDStringRule = require("../../view/Components/FilterRules/ExcludeActionIDStringRule");
const HasMaxDamageTakenRule = require("../../view/Components/FilterRules/HasMaxDamageTakenRule");
const HasMaxPercentStartRule = require("../../view/Components/FilterRules/HasMaxPercentStartRule");

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
        const rules = [HasMoveRule, HasActionIDRule, HasOpponentRule, HasStageRule, HasMinDamageRule, HasMaxDamageRule, HasActionIDStringRule,
            ExcludeActionIDStringRule, HasMaxDamageTakenRule, HasMaxPercentStartRule];
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
                usesTooltips: rules[i].getUsesTooltips(),
                doesInputRequireEventListener: rules[i].getInputRequiresEventListener(),
                doesDropdownRequireEventListener: rules[i].getDropdownRequireEventListener(),
                miniRuleSelectCSS: rules[i].getMiniRuleSelectCSS(),
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
                args: {
                    params: args.args.params,
                    lastChar: args.args.lastChar
                }
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
            case 8:
            case 9:
                this.emit("changeModalInput", {
                    flavor: flavor
                });
                break;
            // Has Characters
            case 4:
                const characters = Utility.getCharacterNames();
                const characterIDs = Utility.getCharacterIDs();
                this.emit("changeModalInput", {
                    flavor: flavor,
                    charNames: characters,
                    charIDs: characterIDs
                });
                break;
            // Has Stage
            case 5:
                const stages = Utility.getAllStages();
                this.emit("changeModalInput", {
                    flavor: flavor,
                    stageNames: stages.names,
                    stageIDs: stages.IDs
                })
                break;
        }

    }

    cb_handleInputValidation (target, listDiv, flavor) {
        const newVal = target.value;
        if (flavor) {
            const isValid = this.getFlavorMap().get(parseInt(flavor)).validateInputForMainInput(newVal, listDiv);
            this.emit("validateModalInput", isValid);
        }
    }

    cb_handleInputForMainInputValidation (newVal, listDiv, flavor) {
        return this.getFlavorMap().get(parseInt(flavor)).validateInputForMainInput(newVal, listDiv);
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