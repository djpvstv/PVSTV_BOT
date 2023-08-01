class RuleBase {

    static ruleName = '';
    static optionName = '';
    static flavor = null;
    static allowsMultipleOptions = false;
    static inputRequiresEventListener = false;
    static dropdownRequiresEventListener = false;
    static isSingleton = false;
    static skipValidation = false;
    static hasDeleteableMiniRules = false;
    static dependsOnActionStates = false;

    flavorType = null;

    option = null;

    // Static Getters
    static getRuleName () {
        return this.ruleName;
    }

    static getOptionName () {
        return this.optionName;
    }

    static getFlavor () {
        return this.flavor;
    }

    static getAllowsMultipleOptions () {
        return this.allowsMultipleOptions;
    }

    static getInputRequiresEventListener () {
        return this.inputRequiresEventListener;
    }

    static getDropdownRequireEventListener () {
        return this.dropdownRequiresEventListener;
    }

    static getIsSingleton () {
        return this.isSingleton;
    }

    static getSkipValidation () {
        return this.skipValidation;
    }
    static getHasDeleteableMiniRules () {
        return this.hasDeleteableMiniRules;
    }

    static getDependsOnActionStates () {
        return this.dependsOnActionStates;
    }

    constructor (option) {
        if (option) {
            this.setOption(option);
        }
    }

    // Required Overrides:
    static getInputDataListHTML () {
        return '';
    }

    // If the input needs to be of different type, use this method
    // to change it after selecting an inut type from the dropdown
    static alterInputElementForFlavor (inputDiv, dataListDiv, dataListHTML) {
        if (dataListDiv.tagName === 'DIV') {
            const replaceList = document.createElement('datalist');
            replaceList.setAttribute('type', 'datalistOptions');
            replaceList.setAttribute('id', 'form-0-datalist');
            dataListDiv.replaceWith(replaceList);
            dataListDiv = replaceList;
        }
        return {
            dataListDiv: dataListDiv,
            dataListHTML: dataListHTML
        };
    }

    // Method to get values out of input
    static getValuesFromInputForRule () {
        return document.getElementById("form-0-input").value;
    }

    // Get the inputs for a rule from a click event
    static getInputValFromEvent () {}

    // Ensure event for entries that can auto-add
    // rules are vaidl
    static validateInputForMainInput () {}
    // Ensure that entries that can auto-add rules
    // are valid
    static isCorrectEventForMainInput () {}

    // Return formatted HTML for rules list
    getHTMLForInputOnExistingRule () {return ``;}

    // End Required Overrides

    // Class Getters / Setters
    getOption () {
        return this.option;
    }

    setOption (value) {
        this.option = value;
    }

    getFlavorType () {
        return this.flavorType;
    }

    // Optional Overrides
    applySettingsToModalInput () {}
    static applyStaticCallbacksToModalInput () {}
}

module.exports = RuleBase;