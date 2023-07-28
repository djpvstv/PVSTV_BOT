const { include } = require('node-addon-api');
const bootstrapBundleMin = require('../../Bootstrap/js/bootstrap.bundle.min');
const boostrap =require('../../Bootstrap/js/bootstrap.bundle.min');

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

    // Rules that affect other rules
    #disableIncludeCharacter = false;
    #disableExcludeCharacter = false;

    #currentRules = {
        minNumMoves: 0,
        maxNumMoves: 99,
        doesKill: false,
        ruleList: []
    };
    
    constructor (controller, appState) {
        this.#controller = controller;

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

    updateRulesRow () {
        const rulesDiv = document.getElementById(this.#ruleRowID);
        rulesDiv.innerHTML = this.renderRulesRows();

        this._applyRuleCallbacks();
    }

    renderRulesRows () {
        if (this.#currentRules.ruleList.length === 0) return this._renderDefaultRule();

        let returnTemplate = this._renderDefaultRule();
        let i = 1;
        while (i < this.#currentRules.ruleList.length + 1) {
            const rule = this.#currentRules.ruleList[i-1];
            let inputDiv = '';

            switch (parseInt(rule.flavor)) {
                case 4:
                case 5:
                    let imageDiv = ``;
                    let j = 0;
                    rule.option.forEach(f => {
                        imageDiv = `${imageDiv}
                        <div class="char-box" value="${f}">
                            <img class="gliphicon" src="./img/si_${f}.png" width="20" height="20">
                            <svg class="x">
                                <image href="./Bootstrap/svg/x.svg" heigth="20" width="20">
                            </svg>
                            <input class="gliphicon-box" value="" id="form-${i}-input" disabled></input>
                        </div>`;
                        j++;
                    });

                    inputDiv = `
                    <div class="flex form-control inner-addon left-addon replace-input-width" flavor="${rule.flavor}" id="form-${i}-input">
                        ${imageDiv}
                    </div>`;
                    break;
                default:
                    inputDiv = `<input class="form-control" value="${rule.option}" id="form-${i}-input" disabled></input>`;
                    break;
            }

            returnTemplate = `${returnTemplate}
                <div class="input-group mb-3">
                    <select name="rule" id="filter_combos_rule_${i}" class="buffer-right-slightly select" disabled>
                        <option disabled value> Rule </option>
                        <option ${rule.flavor === '0' ? 'selected ' : ''}value="0">Has Move ID</option>
                        <option ${rule.flavor === '1' ? 'selected ' : ''}value="1">Has Action ID</option>
                        <option ${rule.flavor === '4' ? 'selected ' : ''}value="4">Has Opponent</option>
                        <option ${rule.flavor === '5' ? 'selected ' : ''}value="5">Exclude Opponent</option>
                        <option ${rule.flavor === '2' ? 'selected ' : ''}value="2">Total Damage ><option>
                        <option ${rule.flavor === '3' ? 'selected ' : ''}value="3">Total Damage <</option>
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

    _renderDefaultRule () {
        return `
            <div class="input-group mb-3">
                <select name="rule" id="rule0" class="buffer-right-slightly select">
                    <option hidden disabled selected value=""> -Add Rule- </option>
                    <option value="0">Has Move ID</option>
                    <option value="1">Has Action ID</option>
                    <option value="4" ${this.#disableIncludeCharacter ? 'disabled' : ''}>Has Opponent</option>
                    <option value="5" ${this.#disableExcludeCharacter ? 'disabled' : ''}>Exclude Opponent</option>
                    <option value="2">Total Damage ></option>
                    <option value="3">Total Damage <</option>
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

        document.getElementById('doesKill').addEventListener("click", (evt) => {
            this.#currentRules.doesKill = evt.target.value === 'on';
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

        this._applyRuleCallbacks();
    }

    _applyRuleCallbacks () {
        document.getElementById("rule0").addEventListener("change", (evt) => {
            this.#controller.cb_handleRuleFlavorSelection(evt.target.value);
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

            // Handle deletion of individual characters in rule
            if ((this.#currentRules.ruleList[i].flavor == 4) || this.#currentRules.ruleList[i].flavor == 5) {
                const flavorNum = (this.#currentRules.ruleList[i].flavor == 4) ? 4 : 5;
                const ruleContainer = document.getElementById(`form-${i+1}-input`);
                ruleContainer.querySelectorAll('div.char-box').forEach(c => {
                    const value = parseInt(c.getAttribute('value'));
                    c.addEventListener("click", (evt) => {
                        const idx = this.#currentRules.ruleList.findIndex(el => {return parseInt(el.flavor) === flavorNum });
                        const currentChars = this.#currentRules.ruleList[idx].option;
                        if (currentChars.length > 1) {
                            const charIdx = currentChars.indexOf(value);
                            if (charIdx !== -1) {
                                currentChars.splice(charIdx, 1);
                            }
                            this.updateRulesRow();
                        } else {
                            this.handleRuleDeletion(idx);
                        }
                    }, value);
                });
            }
            i++;
        }
    }

    show (args) {
        this.#isShowing = true;
        this.renderDiv();
        this._applyCallbacks();
        this.#modal.show();
    }

    hide (args) {
        this.#isShowing = false;
        this.#modal.hide();
    }

    changeModalInput (args) {
        const inputDiv = document.getElementById("form-0-input");
        const dataListDiv = document.getElementById("form-0-datalist");

        inputDiv.value = '';
        inputDiv.classList.remove("is-invalid");

        let dataListHTML = ``;
        let i = 0;

        this.#inputFlavor = args.flavor;

        switch (parseInt(args.flavor)) {
            case 0:
                while (i < args.moveIDs.length) {
                    dataListHTML = `${dataListHTML}
                        <option value="${args.moveIDs[i]} - ${args.moveNames[i]}">
                    `;
                    i++;
                }
                break;
            case 1:
                while (i < args.actionIDs.length) {
                    dataListHTML = `${dataListHTML}
                        <option value="${args.actionIDs[i]} - ${args.actionNames[i]}">
                    `;
                    i++;
                }
                break;
            case 2:
            case 3:
                inputDiv.setAttribute('type', "number");
                break;
            case 4:
            case 5:
                while (i < args.charIDs.length) {
                    dataListHTML = `${dataListHTML}
                        <option value="${args.charIDs[i]} - ${args.charNames[i]}">
                    `;
                    i++;
                }
                break;
        }

        inputDiv.removeAttribute("disabled");
        dataListDiv.innerHTML = dataListHTML;
    }

    applyValidationOnModalInput (args) {
        const inputDiv = document.getElementById("form-0-input");
        const buttonDiv = document.getElementById("rule0_add");
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

    handleRuleAddition () {
        let addRule = true;
        if (this.#inputFlavor == 4) this.#disableExcludeCharacter = true;
        if (this.#inputFlavor == 5) this.#disableIncludeCharacter = true;

        let option = document.getElementById("form-0-input").value;
        if ((this.#inputFlavor == 4) || (this.#inputFlavor == 5)) {
            option = [parseInt(option.split('-')[0])];
        }
        

        if (this.#inputFlavor == 4) {
            const includeCharList = this.#currentRules.ruleList.filter(r => r.flavor == 4);
            if (includeCharList.length > 0) {
                if (!includeCharList[0].option.includes(option[0])) {
                    includeCharList[0].option.push(option[0]);
                }
                addRule = false;
            }
        }

        if (this.#inputFlavor == 5) {
            const includeCharList = this.#currentRules.ruleList.filter(r => r.flavor == 5);
            if (includeCharList.length > 0) {
                if (!includeCharList[0].option.includes(option[0])) {
                    includeCharList[0].option.push(option[0]);
                }
                addRule = false;
            }
        }

        if (addRule) {
            this.#currentRules.ruleList.unshift({
                flavor: this.#inputFlavor,
                option: option
            });
        }

        this.updateRulesRow();
    }

    handleRuleDeletion (index) {
        const flavor = this.#currentRules.ruleList[index].flavor;
        if (flavor == 4) this.#disableExcludeCharacter = false;
        if (flavor == 5) this.#disableIncludeCharacter = false;
        this.#currentRules.ruleList.splice(index, 1);
        this.updateRulesRow();
    }

    
}

module.exports = {ComboFilterModal};