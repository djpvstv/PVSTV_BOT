const RuleBase = require("./RuleBase");
const Utility = require("../../../Utility");

class StringRuleBase extends RuleBase {
    static inputRequiresEventListener = true;
    static isSingleton = true;
    static allowsMultipleOptions = true;
    static hasDeleteableMiniRules = true;
    static miniRuleSelectCSS = "div.id-box-container";
    static usesTooltips = true;

    constructor (option) {
        super(option);
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

    static validateInputForMainInput (newVal, listDiv) {
        let isValid = false;
        const obj = listDiv.querySelector(`option[value="${newVal}"]`);
        if (obj !== null) {
            isValid = true;
        }
        return isValid;
    }

    getHTMLForInputOnExistingRule (i, charTarget) {
        let imageDiv = ``;
        let j = 0;
        this.option.forEach(f => {
            let preFix = `${j+1}: `;
            if (j === 0) {
                preFix = "Start: ";
            } else if (j === this.option.length-1) {
                preFix = "End: ";
            }
            imageDiv = `${imageDiv}
            <div class="id-box-container" value="${f}">
                <div class="id-box" data-toggle="tooltip_filterModal" data-placement="top" title="${Utility.getActionNameFromID(f, charTarget)}" id="form-${i}-input" disabled>${preFix}${f}</div>
                <svg class="x">
                    <image href="./../Bootstrap/svg/x.svg" heigth="20" width="20">
                </svg>
            </div>`;
            j++;
        });

        return`
        <div class="flex form-control inner-addon left-addon replace-input-width" flavor="${this.getFlavorType()}" id="form-${i}-input">
            ${imageDiv}
        </div>`;
    }
}

module.exports = StringRuleBase;