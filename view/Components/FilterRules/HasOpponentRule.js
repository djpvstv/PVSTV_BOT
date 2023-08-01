const RuleBase = require("./RuleBase");

class HasOpponentRule extends RuleBase {
    static ruleName = 'has one or more opponents by external ID';
    static optionName = 'Has Opponent';
    static flavor = 4;
    static isSingleton = true;
    static dropdownRequiresEventListener = true;
    static hasDeleteableMiniRules = true;

    constructor (option) {
        super(option);
        this.flavorType = 4;
    }

    static getInputDataListHTML (args) {
        let i = 0;
        let dataListHTML = `<li class="dropdown-item" value="-1" selectValue="off">Select All</li><li selected><h6 class="dropdown-header">Choose Character:</h6></li><li><hr class="dropdown-divider"></li>`;
        while (i < args.charIDs.length) {
            dataListHTML = `${dataListHTML}
                <li class="dropdown-item" value="${i}">
                    <input type="checkbox">
                    <img src="./img/si_${args.charIDs[i]}.png" width="20" height="20">
                    ${args.charNames[i]}
                </li>
            `;
            i++;
        }
        return dataListHTML;
    }

    static alterInputElementForFlavor (inputDiv, dataListDiv, dataListHTML) {
        inputDiv.classList.add('hide');
        const dropdownDiv = document.createElement('div');
        dropdownDiv.setAttribute('id', 'form-0-datalist');
        dropdownDiv.classList.add('replace-input-width','dropdown');
        dataListHTML = `
            <button class="btn dropdown-toggle target-dropdown w-100" value="null" type="button" id="choose_character_dropdown_button" data-bs-toggle="dropdown" data-bs-auto-close="outside"></button>
            <ul class="dropdown-menu dropdown-scroll" aria-labeledby="choose_character_dropdown_button" id="choose_character_dropdown_dropdown" data-popper-placement="bottom-start">
                ${dataListHTML}
            </ul>
        `;
        dataListDiv.replaceWith(dropdownDiv);

        return {
            dataListDiv: dropdownDiv,
            dataListHTML: dataListHTML
        };
    }

    static applyStaticCallbacksToModalInput (dataListDiv) {
        // Handle select all
        dataListDiv.querySelector('[value="-1"]').addEventListener("click", evt => {
            const oldState = evt.srcElement.getAttribute('selectValue');
            const newState = oldState === 'off' ? 'on' : 'off';
            evt.srcElement.setAttribute('selectValue', newState);
            let bNewVal = newState === 'on' ? true : false;
           
            const checkList = evt.srcElement.parentNode.querySelectorAll('input');
            checkList.forEach(i => {
                i.checked = bNewVal;
            })
        });
    }

    static getValuesFromInputForRule () {
        let options = [];
        document.getElementById("form-0-datalist").querySelectorAll('ul>li').forEach(li => {
            const input = li.querySelector('input');
            if (input && input.checked) {
                options.push(li.value);
            }
        });
        return options;
    }

    static isCorrectEventForMainInput (evt) {
        return true;
    }

    static validateInputForMainInput (evt) {
        return true;
    }

    getHTMLForInputOnExistingRule (ruleNum) {
        let imageDiv = ``;
        let j = 0;
        this.option.forEach(f => {
            imageDiv = `${imageDiv}
            <div class="char-box" value="${f}">
                <img class="gliphicon" src="./img/si_${f}.png" width="20" height="20">
                <svg class="x">
                    <image href="./Bootstrap/svg/x.svg" heigth="20" width="20">
                </svg>
                <input class="gliphicon-box" value="" id="form-${ruleNum}-input" disabled></input>
            </div>`;
            j++;
        });

        return `
        <div class="form-control inner-addon left-addon replace-input-width" flavor="${this.getFlavorType()}" id="form-${ruleNum}-input">
            ${imageDiv}
        </div>`;
    }

    applySettingsToModalInput (dataListDiv) {
        this.option.forEach(r => {
            const li = dataListDiv.querySelector(`li[value="${r}"]`);
            li.querySelector('input').checked = true;
        });
    }
}

module.exports = HasOpponentRule;