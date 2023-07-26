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

    #currentRules = {
        minNumMoves: 0,
        maxNumMoves: 99,
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
            returnTemplate = `${returnTemplate}
                <div class="input-group mb-3">
                    <select name="rule" id="filter_combos_rule_${i}" class="buffer-right-slightly select" disabled>
                        <option disabled value> Rule </option>
                        <option ${rule.flavor === '0' ? 'selected ' : ''}value="0">Has Move ID</option>
                        <option ${rule.flavor === '1' ? 'selected ' : ''}value="1">Has Action ID</option>
                        <option ${rule.flavor === '2' ? 'selected ' : ''}value="2">Total Damage ><option>
                        <option ${rule.flavor === '3' ? 'selected ' : ''}value="3">Total Damage <</option>
                    </select>
                    <input class="form-control" value="${rule.option}" id="form-${i}-input" disabled>
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
                this.#currentRules.ruleList.unshift({
                    flavor: this.#inputFlavor,
                    option: document.getElementById("form-0-input").value
                });
                this.updateRulesRow();
            }
        });

        let i = 0;
        while (i < this.#currentRules.ruleList.length) {
            document.getElementById(`rule${i+1}_remove`).addEventListener("click", (evt) => {
                const index = parseInt(evt.target.closest("div").getAttribute('value'));
                this.#currentRules.ruleList.splice(index, 1);
                this.updateRulesRow();
            });
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

    
}

module.exports = {ComboFilterModal};