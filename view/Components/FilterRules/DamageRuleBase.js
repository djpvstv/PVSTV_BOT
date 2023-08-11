const RuleBase = require("./RuleBase");

class DamageRuleBase extends RuleBase {
    static inputRequiresEventListener = true;

    constructor (option) {
        super(option);
    }

    static isCorrectEventForMainInput (evt) {
        const bClickEvent = ((typeof evt.inputType === 'undefined') && (typeof evt.key === 'undefined'));
        const bKeyEvent = evt.key === "Enter";
        return (bClickEvent || bKeyEvent);
    }

    static getInputValFromEvent (evt) {
        return parseInt(evt.target.value);
    }

    static validateInputForMainInput (newVal, listDiv) {
        return Number.isInteger(parseFloat(newVal)) && newVal > -1;
    }

    static alterInputElementForFlavor (inputDiv, dataListDiv, dataListHTML) {
        inputDiv.setAttribute('type', "number");
        return {
            dataListDiv: dataListDiv,
            dataListHTML: dataListHTML
        };
    }

    getHTMLForInputOnExistingRule (i) {
        return `<input class="form-control" value="${this.option}" id="form-${i}-input" disabled></input>`;
    }
}

module.exports = DamageRuleBase;