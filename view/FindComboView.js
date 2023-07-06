const ParseViewBase = require('./PanelViewBase');
const { AccordionView, AccordionTypes } = require("./Components/AccordionView");

class FindComboView extends ParseViewBase {

    #foundCombosAccordion = null;
    #controller = null;
    #selectorRow = null;
    #currentFlavor = 4;
    #appState = null;
    #fileNum = 0;

    constructor (controller, spinnerController, panelDivID, appState) {
        super(controller, spinnerController);
        this.#appState = appState;
        this.#controller = controller.getFindComboController();

        this.createIDMap();

        // Add rows for 
        // 1 Selector Labels & widgets
        // 2. Input Directory
        // 3. Combo Directory
        // 4. Play buttons

        this.#selectorRow = document.createElement("div");
        const inputRow = document.createElement("div");
        const accordRow = document.createElement("div");

        this.#selectorRow.classList.add("row");
        inputRow.classList.add("row");
        accordRow.classList.add("row", "flex-grow-1");

        this.#selectorRow.innerHTML = this.renderSelectorRow(this.getFlavor());

        const panelDiv = document.getElementById(panelDivID);
        panelDiv.appendChild(this.#selectorRow);
        panelDiv.appendChild(inputRow);

        const formDiv = this.createImportFromDirectory(this.idMap.get("b1"), this.idMap.get("i1"), this.idMap.get("b2"), "Find Combos");

        inputRow.appendChild(formDiv);

        this.#foundCombosAccordion = new AccordionView(AccordionTypes.FINDCOMBOS, this.#appState, this.#controller);
        const accordDiv = this.#foundCombosAccordion.createAccordionForCombos();
        accordRow.appendChild(accordDiv);
        accordRow.innerHTML = `
            <div class="col-12">
                <div class="d-flex flex-column h-100">
                    <div class="row flex-grow-1 position-relative">
                        <div class="menu accordion-overflow accordion" id="${this.idMap.get("a1")}">
                        </div>
                    </div>
                    <div id="${this.idMap.get("p1")}" class="row bottom-pagination">
                    </div>
                </div>
            </div>
        `;
        accordRow.querySelector(`#${this.idMap.get("a1")}`).appendChild(accordDiv);
        panelDiv.appendChild(accordRow);

        const buttonRow = document.createElement("div");
        buttonRow.classList.add("row");
        panelDiv.appendChild(buttonRow);

        this.attachCallbacks();
    }

    createIDMap () {
        // Create input for directory, save ids
        this.idMap.set("b1", "comboSlippi_choose_button");
        this.idMap.set("i1", "comboSlippi_input");
        this.idMap.set("b2", "comboSlippi_combo_button");
        this.idMap.set("a1", "comboSlippi_combos_outmostAccordion");
        this.idMap.set("i2", "comboSlippi_input_targetType");
        this.idMap.set("i2s1", "comboSlippi_input_targetType_tag");
        this.idMap.set("i2s2", "comboSlippi_input_targetType_character");
        this.idMap.set("i2s3", "comboSlippi_input_targetType_character_color");
        this.idMap.set("i2s4", "comboSlippi_input_targetType_tag_character");
        this.idMap.set("i2s5", "comboSlippi_input_targetType_tag_character_color");
        this.idMap.set("i3", "comboSlippi_input_targetTag");
        this.idMap.set("i3d1", "comboSlippi_input_targetTag_dataList");
        this.idMap.set("i4", "comboSlippi_input_targetCharacter");
        this.idMap.set("i5", "comboSlippi_input_targetColor");
        this.idMap.set("p1", "comboSlippi_pagination_div");

        this.getController().setIDMap(this.idMap);
    }

    getController () {
        return this.#controller;
    }

    getFlavor () {
        return this.#currentFlavor;
    }

    setFileNum (val) {
        this.#fileNum = val;
    }

    getFileNum (val) {
        return this.#fileNum;
    }

    getParamsForRequest () {
        const params = {};
        // Batch size
        const batchDiv = document.getElementById(this.idMap.get("b2")+"_batchInput");
        const batchNum = batchDiv.value === '' ? 20 :  parseInt(batchDiv.value);
        params.batchNum = Math.min(batchNum, this.getFileNum());

        // Flavor
        params.flavor = this.getFlavor();

        // Tag
        params.targetTag = this.getElementById("i3").value;

        return params;
    }

    attachCallbacks () {
        this.getElementById("b1").addEventListener("click", async () => {
            await this.controller.cb_emitButtonEvent(this.idMap.get("b1"), "parseDirectoryForSlippiFilesByButton");
        });

        this.getElementById("i1").addEventListener("change", async () => {
            const fileName = this.getElementById("i1").value;
            await this.controller.cb_emitButtonEvent(this.idMap.get("i1"),"parseDirectoryForSlippiFilesByInput",fileName);
        });

        this.getElementById("b2").addEventListener("click", async () => {
            this.progressController.showSpinner({
                modalTitle: "Finding Combos",
                totalFiles: this.getFileNum()
            });
            const params = this.getParamsForRequest();
            await this.controller.cb_emitButtonEvent(this.idMap.get("b2"), "findCombos", params);
        });

        this._addDropdownCallback();
    }

    _addDropdownCallback () {
        let controlDiv = this.getElementById("i2");
        if (controlDiv) {
            controlDiv.addEventListener("change", (evt) => {
                this.getController().cb_selectTargetTypeDropdown(evt.target.value);
            });
        }

        controlDiv = this.getElementById("i3");
        if (controlDiv) {
            controlDiv.addEventListener("change", (evt) => {
                this.validateInput("i3", evt);
            });
        }
    }

    getPanelAccordion () {
        return this.#foundCombosAccordion;
    }

    updateValidationStateForInputOne (isValid, dir, doValidation, errorMsg) {
        super.updateValidationStateForInputOne(isValid, dir, doValidation, errorMsg);
        // Handle enabling of find combo button here:
        if (this.getController().validateAllWidgetsForBigButton()) {
            this.getButtonDivTwo().removeAttribute("disabled");
        } else {
            this.getButtonDivTwo().setAttribute("disabled","");
        }
    }

    validateInput (tag, evt) {
        this.getButtonDivTwo().setAttribute("disabled","");
        const controlDiv = this.getElementById(tag);
        switch (tag) {
            case "i3":
                const newTag = evt.target.value;
                const isValid = this.getController().cb_validateTargetTab(newTag);
                if (isValid) {
                    controlDiv.value = newTag.toUpperCase();
                    if (this.getController().validateAllWidgetsForBigButton()) {
                        this.getButtonDivTwo().removeAttribute("disabled");
                    }
                }
                break;
        }
    }

    renderSelectorRow (flavor) {
        let html = ``;
        switch (flavor) {
            case 1:
                html = `
                    ${this.getTargetType(flavor)}
                    ${this.getTargetTag()}
                `;
                break;
            case 2:
                html = `
                    ${this.getTargetType(flavor)}
                    ${this.getTargetCharacter()}
                `;
                break;
            case 3:
                html = `
                    ${this.getTargetType(flavor)}
                    ${this.getTargetCharacter()}
                    ${this.getTargetColor()}
                `;
                break;
            case 4:
                html = `
                    ${this.getTargetType(flavor)}
                    ${this.getTargetTag()}
                    ${this.getTargetCharacter()}
                `;
                break;
            case 5:
                html = `
                    ${this.getTargetType(flavor)}
                    ${this.getTargetTag()}
                    ${this.getTargetCharacter()}
                    ${this.getTargetColor()}
                `;
                break;
        }
        return html;
    }

    getTargetType (flavor) {
        return `
        <div class="col-md">
            <label for="${this.idMap.get("i2")}" class="form-label">Target Type</label>
            <select class="form-select-sm w-100" id="${this.idMap.get("i2")}">
                <option ${flavor == 1 ? 'selected' : ''} value="1" id="${this.idMap.get("i2s1")}">By Tag</option>
                <option ${flavor == 2 ? 'selected' : ''} value="2" id="${this.idMap.get("i2s2")}">By Character</option>
                <option ${flavor == 3 ? 'selected' : ''} value="3" id="${this.idMap.get("i2s3")}">By Character and Color</option>
                <option ${flavor == 4 ? 'selected' : ''} value="4" id="${this.idMap.get("i2s4")}">By Tag and Character</option>
                <option ${flavor == 5 ? 'selected' : ''} value="5" id="${this.idMap.get("i2s5")}">By Tag, Character, and Color</option>
            </select>
        </div>
    
        `;
    }

    getTargetTag () {
        let foundTagHTML = ``;
        const foundTags = this.#appState.getFoundTags();
        foundTags.forEach(tag => {
            foundTagHTML = `
                ${foundTagHTML}
                <option value="${tag}">
            `;
        });

        return `
        <div class="col-md">
            <div class="form-group">
            <div class="has-validation input-group-match-select">
                <div class="form-floating">
                    <input class="form-control" list="${this.idMap.get("i3d1")}" id="${this.idMap.get("i3")}" placeholder="tag" pattern="^[A-Z]{1,10}#\d{1,3}" required>
                    <datalist type="datalistOptions" id="${this.idMap.get("i3d1")}">
                        ${foundTagHTML}
                    </datalist>
                    <div class="invalid-feedback">
                        Incorrect tag format
                    </div>
                    <label for="${this.idMap.get("i3")}">Tag</label>
                </div>
            </div>
            </div>
        </div>`;
    }

    getTargetCharacter () {
        return `
        <div class="col-md">
            <div class="input-group has-validation input-group-match-select">
                <div class="form-floating">
                    <input type="text" class="form-control" id="${this.idMap.get("i4")}" placeholder="Character">
                    <label for="${this.idMap.get("i4")}">Character</label>
                </div>
            </div>
        </div>`;
    }

    getTargetColor () {
        return `
        <div class="col-md">
            <div class="input-group has-validation input-group-match-select">
                <div class="form-floating">
                    <input type="text" class="form-control" id="${this.idMap.get("i5")}" placeholder="Color">
                    <label for="${this.idMap.get("i5")}">Color</label>
                </div>
            </div>
        </div>`;
    }

    getInputDivOne () {
        return this.getElementById("i1");
    }

    getButtonDivTwo () {
        return this.getElementById("b2");
    }

    updateTargetType (flavor) {
        this.#selectorRow.innerHTML = this.renderSelectorRow(flavor);
        this.currentFlavor = flavor;
        this._addDropdownCallback();
    }
}

module.exports = FindComboView;