const { include } = require('node-addon-api');
const bootstrapBundleMin = require('../../Bootstrap/js/bootstrap.bundle.min');
const boostrap =require('../../Bootstrap/js/bootstrap.bundle.min');
const Utility = require("../../Utility");

class ComboFilterModal {

    #controller = null;
    #modal = null;
    #modalDiv = null;

    #inputFlavor = null;
    #modalID = null;
    #ruleRowID = null;
    #inputID = null;
    #applyButtonID = null;
    #isShowing = false;
    #handleForHandleInputForMainInput = null;
    #tooltipList = null;
    #currentCharTarget = null;
    #flavorMap = null;
    #flavorOrder = null;

    #currentRules = {
        minNumMoves: 0,
        maxNumMoves: 99,
        doesKill: false,
        ruleList: []
    };
    
    constructor (controller, appState) {
        this.#controller = controller;
        this.#currentCharTarget = 23;

        this.#handleForHandleInputForMainInput = this.handleInputForMainInput.bind(this);
        this.createFlavorMap();

        this.#modalID = "filterComboModal";
        this.#ruleRowID = "filterComboRulesRow";

        const topDiv = document.createElement("div");
        topDiv.classList.add("modal", "fade");
        topDiv.setAttribute("id",this.#modalID);
        topDiv.setAttribute("data-bs-backdrop", "static");
        topDiv.setAttribute("tabIndex", "-1");
        topDiv.setAttribute("data-bs-keyboard", "false");
        topDiv.setAttribute("aria-labelledby","staticBackdropLabel");
        topDiv.setAttribute("aria-modal", "true");
        topDiv.setAttribute("role","dialog");
        topDiv.style.display = "none";

        this.#modalDiv = topDiv;
        this.#inputID = "slippiComboFilterInput";
        this.#applyButtonID = "slippiComboFilterApplyButton";

        this.renderDiv();

        document.body.appendChild(topDiv);

        this.#modal = new bootstrapBundleMin.Modal(document.getElementById(this.#modalID), {
            keyboard: false
        });

        this._applyCallbacks();
    }

    getFlavor () {
        return parseInt(this.#inputFlavor);
    }

    setFlavor (val) {
        this.#inputFlavor = val;
    }

    // Called once to initialize the flavors we have for filtering
    createFlavorMap () {
        this.#flavorMap = this.#controller.getFlavorMap();

        this.#flavorOrder = [0, 1, 4, 5, 6, 7, 2, 3];
    }

    getFlavorOrder () {
        return this.#flavorOrder;
    }

    getFromFlavorMap (flavor) {
        return this.#flavorMap.get(parseInt(flavor));
    }

    getOptionNameFromFlavorMap (flavor) {
        return this.getFromFlavorMap(flavor) ? this.getFromFlavorMap(flavor).optionName : '';
    }

    doesFlavorAllowMultipleOptions (flavor) {
        return this.getFromFlavorMap(flavor) ? this.getFromFlavorMap(flavor).allowsMultipleOptions : false;
    }

    isThereExistingRuleFlavor (flavor) {
        const validRules = this.#currentRules.ruleList.filter(r => r.getFlavorType() === flavor);
        return this.#currentRules.ruleList.indexOf(validRules[0]);
    }

    // Provide HTML for main panel with options
    renderDiv () {
        const buttonLabel = "Filter Combo Results";
        this.#modalDiv.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Filter Combo Results</h1>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="form-col col-md-6">
                                <label for="minNumMoves" class="dropped-label">Minimum Num. Moves</label>
                                <input type="number" class="form-control" id="minNumMoves" ${ Number.isInteger(this.#currentRules.minNumMoves) ? `value="${this.#currentRules.minNumMoves}"` : 'placeholder="0" value="0"'} min="0" max="99">
                            </div>
                            <div class="form-col col-md-6">
                                <label for="maxNumMoves" class="dropped-label">Maximum Num. Moves</label>
                                <input type="number" class="form-control" id="maxNumMoves" ${ Number.isInteger(this.#currentRules.maxNumMoves) ? `value="${this.#currentRules.maxNumMoves}"` : 'placeholder="99" value="99"'} min="0" max="99">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 dropped-label">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="doesKill">
                                    <label class="form-check-label" for="doesKill">Combos must Kill</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                ${this.getCharacterSelectionDropdownHTML()}
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-col col-md-12">
                                <label class="dropped-label">Filters</label>
                                <div id=${this.#ruleRowID} class="row">
                                    ${this.renderRulesRows()}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="${this.#applyButtonID}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Apply</button>
                    <button id="cancelFile" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
        `;
    }

    getCharacterSelectionDropdownHTML () {
        const characters = Utility.getCharacterNames();
        const characterIDs = Utility.getCharacterIDs();
        let dropdownHTML = `<li selected=""><h6 class="dropdown-header">Choose Character:</h6></li>`;
        let i = 0;
        while (i < characterIDs.length) {
            dropdownHTML = `${dropdownHTML}
                <li class="dropdown-item" value="${i}">
                    <img src="./img/si_${i}.png" width="20" height="20">
                    ${characters[i]}
                </li>
            `;
            i++;
        }

        return `<div class="dropdown">
            <button class="btn dropdown-toggle target-dropdown w-100" value="${this.#currentCharTarget}" type="button" id="filterComboSlippiModal_input_targetCharacter_dropdownbutton" data-bs-toggle="dropdown" aria-expanded="false">
                ${this.#currentCharTarget ? `<img src="./img/si_${this.#currentCharTarget}.png" width="20" height="20"> ${Utility.getCharacterNames()[this.#currentCharTarget]}` : 'Choose Character:'}
            </button>
            <ul class="has-validation dropdown-menu dropdown-scroll" aria-labeledby="filterComboSlippiModal_input_targetCharacter_dropdownbutton" id="filterComboSlippiModali_input_targetCharacter" "="">
                ${dropdownHTML}
            </ul>
        </div>`
    }

    updateRulesRow () {
        const rulesDiv = document.getElementById(this.#ruleRowID);
        rulesDiv.innerHTML = this.renderRulesRows();

        this._applyRuleCallbacks();
        document.getElementById('form-0-input').focus();
        document.getElementById('form-0-input').select();
    }

    renderRulesRows () {
        if (this.#currentRules.ruleList.length === 0) return this._renderDefaultRule();

        let returnTemplate = this._renderDefaultRule();
        let i = 1;
        while (i < this.#currentRules.ruleList.length + 1) {
            const rule = this.#currentRules.ruleList[i-1];
            let inputDiv = rule.getHTMLForInputOnExistingRule(i, this.#currentCharTarget);

            let dropdownHTML = ``;
            this.getFlavorOrder().forEach(f => {
                dropdownHTML = `${dropdownHTML}<option ${rule.getFlavorType() === f ? 'selected ' : ''}value="${f}">${this.getOptionNameFromFlavorMap(f)}</option>
                `;
            });

            returnTemplate = `${returnTemplate}
                <div class="input-group mb-3">
                    <select name="rule" id="filter_combos_rule_${i}" class="buffer-right-slightly select" disabled>
                        <option disabled value> Rule </option>
                        ${dropdownHTML}
                    </select>
                    ${inputDiv}
                    <div id="rule${i}_remove" class="enabled-icon" value="${i-1}">
                        <svg class="add-rule-icon">
                            <image xlink:href="./Bootstrap/svg/dash-circle.svg" width="34" height="34"/>
                        </svg>
                    </div>
                </div>
            `;
            i++;
        }

        return returnTemplate;
    }

    _getMainDropdownHTML () {
        let dropdownHTML = ``;
        this.getFlavorOrder().forEach(f => {
            dropdownHTML = `${dropdownHTML}
                <option ${this.getFlavor() === f ? 'selected ' : ''}value="${f}">${this.getOptionNameFromFlavorMap(f)}</option>
            `;
        });

        return dropdownHTML;
    }

    _renderDefaultRule () {
        return `
            <div class="input-group mb-3">
                <select name="rule" id="rule0" class="buffer-right-slightly select">
                    <option ${this.#inputFlavor === null ? 'selected ' : ''}hidden disabled value=""> -Add Rule- </option>
                    ${this._getMainDropdownHTML()}
                </select>
                <input class="form-control" list="form-0-datalist" id="form-0-input" disabled>
                <datalist type="datalistOptions" id="form-0-datalist"></datalist>
                <div id="rule0_add" class="disabled-icon">
                    <svg class="add-rule-icon">
                        <image xlink:href="./Bootstrap/svg/plus-circle.svg" width="34" height="34"/>
                    </svg>
                </div>
            </div>
        `;
    }

    _applyCallbacks () {
        document.getElementById(this.#applyButtonID).addEventListener("click", async () => {
            await this.#controller.cb_emitAcceptButtonEvent(true, this.#currentRules);
        });

        document.getElementById('doesKill').checked = this.#currentRules.doesKill;

        document.getElementById('doesKill').addEventListener("click", (evt) => {
            this.#currentRules.doesKill = evt.target.checked;
        });

        document.getElementById('minNumMoves').addEventListener("change", (evt) => {
            const newVal = parseInt(evt.target.value);
            if (newVal >= this.#currentRules.maxNumMoves) {
                document.getElementById('minNumMoves').value = String(this.#currentRules.minNumMoves);
            } else {
                this.#currentRules.minNumMoves = parseInt(evt.target.value);
            }
        });

        document.getElementById('maxNumMoves').addEventListener("change", (evt) => {
            const newVal = parseInt(evt.target.value);
            if (newVal <= this.#currentRules.minNumMoves) {
                document.getElementById('maxNumMoves').value = String(this.#currentRules.maxNumMoves);
            } else {
                this.#currentRules.maxNumMoves = parseInt(evt.target.value);
            }
        });

        document.getElementById("filterComboSlippiModali_input_targetCharacter").addEventListener("click", evt => {
            const selectedItem = evt.srcElement.closest(".dropdown-item");
            const newChar = parseInt(selectedItem.value);
            // set inner html for char selector
            this.#currentCharTarget = newChar;
            const controlDiv = document.getElementById("filterComboSlippiModali_input_targetCharacter");
            document.getElementById("filterComboSlippiModal_input_targetCharacter_dropdownbutton").value = newChar;
            document.getElementById("filterComboSlippiModal_input_targetCharacter_dropdownbutton").innerHTML = controlDiv.children[newChar + 1].innerHTML;

            // In the case we have existing rules that depend on character action IDs, we need to kill them
            const newRules = this.#currentRules.ruleList.filter(r => !this.getFromFlavorMap(r.getFlavorType()).dependsOnActionStates);
            this.#currentRules.ruleList = newRules;
            this.updateRulesRow();
        });

        this._applyRuleCallbacks();
    }

    _applyRuleCallbacks () {
        document.getElementById("rule0").addEventListener("change", (evt) => {
            this.#controller.cb_handleRuleFlavorSelection(evt.target.value, this.#currentCharTarget);
        });

        document.getElementById("form-0-input").addEventListener("change", (evt) => {
            this.#controller.cb_handleInputValidation(evt.target, document.getElementById("form-0-datalist"), this.#inputFlavor);
        });

        document.getElementById("rule0_add").addEventListener("click", (evt) => {
            if (evt.target.closest("div").classList.contains("enabled-icon")) {
                this.handleRuleAddition();
            }
        });

        let i = 0;
        while (i < this.#currentRules.ruleList.length) {
            document.getElementById(`rule${i+1}_remove`).addEventListener("click", (evt) => {
                const index = parseInt(evt.target.closest("div").getAttribute('value'));
                this.handleRuleDeletion(index);
            });

            // Apply selection callback for dropdown menu rules
            const rule = this.#currentRules.ruleList[i];
            const ruleObj = this.getFromFlavorMap(rule.getFlavorType());

            // Handle deletion of individual characters in rule
            if (ruleObj.hasDeleteableMiniRules) {
                const ruleContainer = document.getElementById(`form-${i+1}-input`);
                ruleContainer.querySelectorAll(ruleObj.miniRuleSelectCSS).forEach(c => {
                    const value = parseInt(c.getAttribute('value'));
                    c.addEventListener("click", (evt) => {
                        const ruleRow = evt.target.closest('div.input-group');
                        const ruleIdx = Array.prototype.indexOf.call(ruleRow.parentNode.children, ruleRow) - 1;
                        // const flavorNum = this.#currentRules.ruleList[ruleIdx].getFlavorType();
                        const currentOptions = this.#currentRules.ruleList[ruleIdx].option;
                        const ruleObj = this.getFromFlavorMap(this.#currentRules.ruleList[ruleIdx].getFlavorType());
                        const optionIdx = currentOptions.indexOf(value);
                        if (ruleObj.usesTooltips) {
                            const tooltip = this.#tooltipList[optionIdx];
                            tooltip.dispose();
                            this.#tooltipList.splice(optionIdx, 1);
                        }
                        if (currentOptions.length > 1) {
                            if (optionIdx !== -1) {
                                currentOptions.splice(optionIdx, 1);
                            }
                            this.updateRulesRow();
                            this.#controller.cb_handleRuleFlavorSelection(this.#inputFlavor, this.#currentCharTarget);
                        } else {
                            this.setFlavor(null);
                            this.handleRuleDeletion(ruleIdx);
                        }
                    }, value);
                });
            }
            i++;
        }

        // For all tooltips that exist, initialize
        const tooltipTargets = document.querySelectorAll('[data-toggle="tooltip"]');
        if (tooltipTargets.length > 0) {
            // Also need to kill previous list
            this.#tooltipList = [...tooltipTargets].map(tooltipTriggerEl => new bootstrapBundleMin.Tooltip(tooltipTriggerEl));
        }
    }

    show (args) {
        this.#isShowing = true;
        if (args.lastChar) {
            this.#currentCharTarget = parseInt(args.lastChar);
        }
        if (args.params) {
            if (Object.hasOwnProperty.call(args.params, 'minNumMoves')) {
                this.#currentRules.minNumMoves = args.params.minNumMoves;
            }
            if (Object.hasOwnProperty.call(args.params, 'maxNumMoves')) {
                this.#currentRules.maxNumMoves = args.params.maxNumMoves;
            }
            if (Object.hasOwnProperty.call(args.params, 'doesKill')) {
                this.#currentRules.doesKill = args.params.doesKill;
            }
            if (Object.hasOwnProperty.call(args.params, 'ruleList')) {
                this.#currentRules.ruleList = [];
                args.params.ruleList.forEach(r => {
                    const constructor = this.getFromFlavorMap(r.flavorType).constructor;
                    const newRule = new constructor(r.option);
                    this.#currentRules.ruleList.unshift(newRule);
                });
            }
        }
        this.renderDiv();
        this._applyCallbacks();
        this.#modal.show();
    }

    hide (args) {
        this.#isShowing = false;
        this.#modal.hide();
    }

    changeModalInput (args) {
        const newFlavor = parseInt(args.flavor);
        let inputDiv = document.getElementById("form-0-input");
        let dataListDiv = document.getElementById("form-0-datalist");

        const isExistingRuleFlavor = this.isThereExistingRuleFlavor(newFlavor);

        inputDiv.value = '';
        inputDiv.classList.remove("is-invalid");

        const ruleObj = this.getFromFlavorMap(newFlavor);
        let dataListHTML = ruleObj.getInputDataListHTML(args);

        this.setFlavor(newFlavor);
        inputDiv.classList.remove('hide');
        const altAttributes = ruleObj.alterInputElementForFlavor(inputDiv, dataListDiv, dataListHTML);
        dataListDiv = altAttributes.dataListDiv;
        dataListHTML = altAttributes.dataListHTML;

        inputDiv.removeAttribute("disabled");
        dataListDiv.innerHTML = dataListHTML;
        const bIsActionFlavor = (parseInt(args.flavor) === 6) || (parseInt(args.flavor) === 7);
        const bIsCharFlavor = (parseInt(args.flavor) === 4) || (parseInt(args.flavor) === 5);
        
        if (ruleObj.doesInputRequireEventListener) {
            inputDiv.removeEventListener('input', this.#handleForHandleInputForMainInput, false);
            inputDiv.addEventListener('input', this.#handleForHandleInputForMainInput, false);
            inputDiv.removeEventListener('keypress', this.#handleForHandleInputForMainInput, false);
            inputDiv.addEventListener('keypress', this.#handleForHandleInputForMainInput, false);
        }

        if (ruleObj.doesDropdownRequireEventListener) {
            dataListDiv.removeEventListener('hide.bs.dropdown', this.#handleForHandleInputForMainInput, false);
            dataListDiv.addEventListener('hide.bs.dropdown', this.#handleForHandleInputForMainInput, false);
            // Add callback for selections of each individual checkbox
            dataListDiv.querySelectorAll('li').forEach(d => {
                d.addEventListener('click', (evt) => {
                    if (evt.target.nodeName !== "INPUT") {
                        const parent = evt.target.closest('li');
                        const input = parent.querySelector('input');
                        if (input) {
                            input.checked = !input.checked;
                        }
                    }
                });
            });
        }

        if (ruleObj.isSingleton) {
            ruleObj.applyStaticCallbacksToModalInput(dataListDiv);
            if (isExistingRuleFlavor !== -1) {
                const rule = this.#currentRules.ruleList[isExistingRuleFlavor];
                rule.applySettingsToModalInput(dataListDiv);
            }
        }

        inputDiv.focus();
        inputDiv.select();
    }

    handleInputForMainInput (evt) {
        const ruleObj = this.getFromFlavorMap(this.getFlavor());
        const bIsValid = ruleObj.isCorrectEventForMainInput(evt);
        if (bIsValid) {
            const inputVal = ruleObj.getInputValFromEvent(evt);

            const isValid = this.#controller.cb_handleInputForMainInputValidation(inputVal, document.getElementById("form-0-datalist"), this.#inputFlavor);
            if (isValid) {
                this.handleRuleAddition();
                this.#controller.cb_handleRuleFlavorSelection(this.#inputFlavor, this.#currentCharTarget);
            }
        }
    }

    applyValidationOnModalInput (args) {
        const inputDiv = document.getElementById("form-0-input");
        const buttonDiv = document.getElementById("rule0_add");
        // Depending on flavor, validation is done elsewhere
        const bNeedsValidation = [0, 1, 2, 3].includes(this.#inputFlavor);

        if (bNeedsValidation) {
            if (args) {
                inputDiv.classList.add("is-valid");
                inputDiv.classList.remove("is-invalid");

                buttonDiv.classList.remove("disabled-icon");
                buttonDiv.classList.add("enabled-icon");
            } else {
                inputDiv.classList.add("is-invalid");
                inputDiv.classList.remove("invalid");

                buttonDiv.classList.remove("enabled-icon");
                buttonDiv.classList.add("disabled-icon");
            }
        }
    }

    handleRuleAddition () {
        let addRule = true;
        let resetMainDropdown = true;
        const flavor = this.getFlavor();
        const ruleObj = this.getFromFlavorMap(flavor);

        let option = this.getFromFlavorMap(flavor).getValuesFromInputForRule();
        if (this.doesFlavorAllowMultipleOptions(flavor)) {
            option = [parseInt(option.split('-')[0])];

            // This only operates on the most frontest rule, so for 7
            // Need to be careful to only add to the last rule
            const includeList = this.#currentRules.ruleList.filter(r => r.getFlavorType() == flavor);
            if (includeList.length > 0) {
                const bRequiresNoDuplicates = [4, 5].includes(flavor);
                if (!(bRequiresNoDuplicates && includeList[0].option.includes(option[0]))) {
                    includeList[0].option.push(option[0]);
                }
                addRule = false;
            }
            resetMainDropdown = false;
        }

        if (addRule) {
            const isExistingRuleFlavor = this.isThereExistingRuleFlavor(flavor);
            if ((ruleObj.isSingleton) && (isExistingRuleFlavor !== -1)) {
                const rule = this.#currentRules.ruleList[isExistingRuleFlavor];
                rule.setOption(option);
            } else {
                const constructor = this.getFromFlavorMap(flavor).constructor;
                const newRule = new constructor(option);
                this.#currentRules.ruleList.unshift(newRule);
            }
        }
        if (resetMainDropdown) {
            this.setFlavor(null);
        }

        this.updateRulesRow();
    }

    handleRuleDeletion (index) {
        this.#currentRules.ruleList.splice(index, 1);
        this.setFlavor(null);
        this.updateRulesRow();
    }

    
}

module.exports = {ComboFilterModal};