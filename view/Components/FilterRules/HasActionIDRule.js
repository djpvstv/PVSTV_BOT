const RuleBase = require("./RuleBase");

class HasActionIDRule extends RuleBase {
    static ruleName = 'has one action ID';
    static optionName = 'Has Action ID';
    static flavor = 1;
    static inputRequiresEventListener = true;
    static dependsOnActionStates = true;

    constructor (option) {
        super(option);
        this.flavorType = 1;
    }

    static getInputDataListHTML (args) {
        let dataListHTML = ``;
        let i = 0;
        while (i < args.actionIDs.length) {
            dataListHTML = `${dataListHTML}
                <option value="${args.actionIDs[i]} - ${args.actionNames[i]}">
            `;
            i++;
        }
        return dataListHTML;
    }

    static isCorrectEventForMainInput (evt) {
        const bClickEvent = ((typeof evt.inputType === 'undefined') && (typeof evt.key === 'undefined'));
        const bKeyEvent = evt.key === "," || evt.key === "Enter";
        return (bClickEvent || bKeyEvent);
    }

    static getInputValFromEvent (evt) {
        let inputVal = evt.target.value;
        if (evt.data === ",") {
            inputVal = inputVal.split(',')[0];
        }
        return inputVal;
    }

    static validateInputForMainInput (listDiv, newVal) {
        let isValid = false;
        const obj = listDiv.querySelector(`option[value="${newVal}"]`);
        if (obj !== null) {
            isValid = true;
        }
        return isValid;
    }

    getHTMLForInputOnExistingRule (i) {
        return `<input class="form-control" value="${this.option}" id="form-${i}-input" disabled></input>`;
    }
}

module.exports = HasActionIDRule;