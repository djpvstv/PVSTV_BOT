const ParseViewBase = require('./PanelViewBase');
const { AccordionView, AccordionTypes } = require("./Components/AccordionView");
const Utility = require("../Utility");

class FindComboView extends ParseViewBase {

    #foundCombosAccordion = null;
    #controller = null;
    #selectorRow = null;
    #currentFlavor = 4;
    #currentCharacter = null;
    #appState = null;
    #fileNum = 0;

    constructor (controller, spinnerController, settingsController, multiTagController, panelDivID, appState) {
        super(controller, spinnerController, settingsController, multiTagController);
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

        const formDiv = this.createImportFromDirectory(this.idMap.get("b1"), this.idMap.get("i1"), this.idMap.get("b2"), "Find Combos", this.idMap.get("sb1"));

        inputRow.appendChild(formDiv);

        this.#foundCombosAccordion = new AccordionView(AccordionTypes.FINDCOMBOS, this.#appState, this.#controller);
        const accordDiv = this.#foundCombosAccordion.createAccordionForCombos();
        accordRow.appendChild(accordDiv);
        accordRow.innerHTML = `
            <div class="col-12">
                <div class="d-flex flex-column h-100">
                    <div class="row flex-grow-1 position-relative">
                        <div class="menu accordion-overflow accordion fifty-fifty-column-split" id="${this.idMap.get("a1")}">
                        </div>
                    </div>
                    <div class="context-wrapper hidden-context" id="${this.idMap.get("c1")}">
                        <div class="content">
                            <ul class="context-menu">
                                <li class="context-item" id="${this.idMap.get("c1l1")}">
                                    <svg class="icon">
                                        <image xlink:href="./../Bootstrap/svg/play.svg" width="28" height="28" y="-2"/>
                                    </svg>
                                    <span>Play this combo</span>
                                </li>
                                <li class="context-item" id="${this.idMap.get("c1l2")}">
                                    <svg class="icon">
                                        <image xlink:href="./../Bootstrap/svg/pencil-square.svg" width="20" height="20" x="4" y="2"/>
                                    </svg>
                                    <option value="1">Open notes</option>
                                </li>
                                <li class="context-item" id="${this.idMap.get("c1l3")}">
                                    <svg class="icon">
                                        <image xlink:href="./../Bootstrap/svg/x.svg" width="30" height="30" x="-2" y="-2"/>
                                    </svg>
                                    <option value="2">remove this combo</option>
                                </li>
                                <li class="context-item" id="${this.idMap.get("c1l4")}">
                                    <svg class="icon">
                                        <image xlink:href="./../Bootstrap/svg/arrow-counterclockwise.svg" width="28" height="28" y="-2"/>
                                    </svg>
                                    <option value="2">restore all combos</option>
                                </li>
                            </ul>
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
        this.#foundCombosAccordion.attachBottomButtons({bShowAll: false});
        this.#foundCombosAccordion.attachBottomButtonCallbacks();

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
        this.idMap.set("i3b1", "comboSlippi_input_targetTag_multiTargetEdit");
        this.idMap.set("i4", "comboSlippi_input_targetCharacter");
        this.idMap.set("i4b1", "comboSlippi_input_targetCharacter_dropdownbutton");
        this.idMap.set("i5", "comboSlippi_input_targetColor");
        this.idMap.set("i5b1", "comboSlippi_input_targetColor_dropdownbutton");
        this.idMap.set("p1", "comboSlippi_pagination_div");
        this.idMap.set("c1", "comboSlippi_context_menu");
        this.idMap.set("c1l1", "comboSlippi_context_play_combo");
        this.idMap.set("c1l2", "comboSlippi_context_edit_combo");
        this.idMap.set("c1l3", "comboSlippi_context_delete_combo");
        this.idMap.set("c1l4", "comboSlippi_context_undelete_combos");
        this.idMap.set("sb1", "comboSlippi_settings_button");

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
        const batchNum = this.#appState.getBatchSize();
        params.batchNum = Math.min(batchNum, this.getFileNum());

        // Flavor
        const flavor = this.getFlavor();
        params.flavor = flavor;

        // Tag
        if (flavor === 1 || flavor === 4 || flavor === 5) {
            const inputDiv = this.getElementById("i3");
            // Multi Tag Target
            if (inputDiv.getAttribute("multiple-tags") === '') {
                let catValue = inputDiv.value;
                params.targetTag = catValue.split(',');
            } else {
            // Single Tag target
                params.targetTag = inputDiv.value;
            }
        }

        // Character
        if (flavor === 2 || flavor === 3 || flavor == 4 || flavor === 5) {
            params.targetChar = parseInt(this.getElementById("i4b1").value);
        }

        // Color
        if (flavor === 3 || flavor === 5) {
            params.targetColor = parseInt(this.getElementById("i5b1").value);
        }

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

        document.getElementById("comboSlippi_combos_outmostAccordion").addEventListener("contextmenu", (evt) => {
            if (evt.ctrlKey) return;
            this.#controller.cb_handleRightClick(evt);
        });

        document.addEventListener("click", (evt) => {
            this.#controller.cb_hideContextMenu(evt, false);
        });

        this.getElementById("c1l1").addEventListener("click", async() => {
            this.#controller.cb_playCombo();
        });

        this.getElementById("c1l2").addEventListener("click", async () => {
            await this.#controller.cb_editCombo();
        });

        this.getElementById("c1l3").addEventListener("click", async () => {
            await this.#controller.cb_removeCombo();
        });

        this.getElementById("c1l4").addEventListener("click", async () => {
            await this.#controller.cb_restoreAllCombos();
        });

        this.getElementById("sb1").addEventListener("click", async () => {
            this.settingsController.showSpinner();
        });

        this.getElementById("i3b1").addEventListener("click", async () => {
            const params = this.getParamsForRequest();
            params.foundTagHTML = this.getHTMLForFoundTagsDataList();
            this.multiTagController.showSpinner(params);
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

        controlDiv = this.getElementById("i4");
        if (controlDiv) {
            controlDiv.addEventListener("click", (evt) => {
                this.validateInput("i4", evt);
            });
        }

        this._addColorDropdownCallback();
    }

    _addColorDropdownCallback () {
        const controlDiv = this.getElementById("i5");
        if (controlDiv) {
            controlDiv.addEventListener("click", (evt) => {
                this.validateInput("i5", evt);
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
        let isValid, selectedItem;
        switch (tag) {
            case "i3":
                const newTag = evt.target.value;
                isValid = this.getController().cb_validateTargetTab(newTag);
                if (isValid) {
                    controlDiv.value = newTag.toUpperCase();
                    if (this.getController().validateAllWidgetsForBigButton()) {
                        this.getButtonDivTwo().removeAttribute("disabled");
                    }
                }
                break;
            case "i4":
                selectedItem = evt.srcElement.closest(".dropdown-item");
                if (selectedItem) {
                    const newChar = selectedItem.value;
                    isValid = this.getController().cb_validateTargetChar(newChar);
                    if (isValid) {
                        // set inner html for char selector
                        this.#currentCharacter = newChar;
                        this.renderColorOptions(newChar);
                        this._addColorDropdownCallback();
                        this.getElementById("i4b1").value = newChar;
                        this.getElementById("i4b1").innerHTML = controlDiv.children[newChar + 1].innerHTML;
                        if (this.getController().validateAllWidgetsForBigButton()) {
                            this.getButtonDivTwo().removeAttribute("disabled");
                        }
                    }
                }
                break;
            case "i5":
                selectedItem = evt.srcElement.closest(".dropdown-item");
                if (selectedItem) {
                    const newColor = selectedItem.value;
                    const currentChar = this.#currentCharacter;
                    isValid = this.getController().cb_validateTargetColor(newColor, currentChar);
                    if (isValid) {
                        // set inner html for color selector
                        this.getElementById("i5b1").value = newColor;
                        this.getElementById("i5b1").innerHTML = controlDiv.children[newColor + 1].innerHTML;
                        if (this.getController().validateAllWidgetsForBigButton()) {
                            this.getButtonDivTwo().removeAttribute("disabled");
                        }
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
                    ${this.getTargetColor(-1)}
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
                    ${this.getTargetColor(-1)}
                `;
                break;
        }
        return html;
    }

    updateTagSelectionAutofills () {
        if ([1,4,5].includes(this.getFlavor())) {
            let foundTagHTML = ``;
            const foundTags = this.#appState.getFoundTags();
            foundTags.forEach(tag => {
                foundTagHTML = `
                    ${foundTagHTML}
                    <option value="${tag}">
                `;
            });

            this.getElementById("i3d1").innerHTML = foundTagHTML;
        }
    }

    getTargetType (flavor) {
        return `
        <div class="col-md">
            <label for="${this.idMap.get("i2")}" class="form-label">Target Type</label>
            <select class="form-select-sm w-100 target-border select" id="${this.idMap.get("i2")}">
                <option ${flavor == 1 ? 'selected' : ''} value="1" id="${this.idMap.get("i2s1")}">By Tag</option>
                <option ${flavor == 2 ? 'selected' : ''} value="2" id="${this.idMap.get("i2s2")}">By Character</option>
                <option ${flavor == 3 ? 'selected' : ''} value="3" id="${this.idMap.get("i2s3")}">By Character and Color</option>
                <option ${flavor == 4 ? 'selected' : ''} value="4" id="${this.idMap.get("i2s4")}">By Tag and Character</option>
                <option ${flavor == 5 ? 'selected' : ''} value="5" id="${this.idMap.get("i2s5")}">By Tag, Character, and Color</option>
            </select>
        </div>
    
        `;
    }
    getHTMLForFoundTagsDataList () {
        let foundTagHTML = ``;
        const foundTags = this.#appState.getFoundTags();
        foundTags.forEach(tag => {
            foundTagHTML = `
                ${foundTagHTML}
                <option value="${tag}">
            `;
        });
    }

    getTargetTag () {
        const foundTagHTML = this.getHTMLForFoundTagsDataList();

        return `
        <div class="col-md">
            <div class="form-group d-flex align-items-center">
                <div class="has-validation input-group-match-select flex-grow-1">
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
                <svg class="big-icon" id="${this.idMap.get("i3b1")}">
                    <image xlink:href="./../Bootstrap/svg/plus-circle.svg" width="35" height="35" y="3"/>
                </svg>
            </div>
        </div>`;
    }

    updateMultipleTargetTags (validTagList) {
        const inputDiv = this.getElementById("i3");
        if (validTagList.length > 1) {
            inputDiv.setAttribute("disabled","");
            inputDiv.setAttribute("multiple-tags","");
            inputDiv.value = validTagList.join(',');
        } else {
            inputDiv.removeAttribute("disabled","");
            inputDiv.removeAttribute("multiple-tags","");
            inputDiv.value = validTagList[0];
        }
    }

    getTargetCharacter () {
        this.#currentCharacter = -1;
        return `
        <div class="col-md">
            <div class="dropdown">
                <button class="btn dropdown-toggle target-dropdown w-100" value="null" type="button" id="${this.idMap.get("i4b1")}" data-bs-toggle="dropdown" aria-expanded="false">
                    Choose Character:
                </button>
                <ul class="has-validation dropdown-menu dropdown-scroll" aria-labeledby="${this.idMap.get("i4b1")}" id="${this.idMap.get("i4")}"">
                    <li selected><h6 class="dropdown-header">Choose Character:</h6></li>
                    <li class="dropdown-item" value="0">
                        <img src="./../img/si_0.png" width="20" height="20">
                        Captain Falcon
                    </li>
                    <li class="dropdown-item" value="1">
                        <img src="./../img/si_1.png" width="20" height="20">
                        DK
                    </li>
                    <li class="dropdown-item" value="2">
                        <img src="./../img/si_2.png" width="20" height="20">
                        Fox
                    </li>
                    <li class="dropdown-item" value="3">
                        <img src="./../img/si_3.png" width="20" height="20">
                        Game and Watch
                    </li>
                    <li class="dropdown-item" value="4">
                        <img src="./../img/si_4.png" width="20" height="20">
                        Kirby
                    </li>
                    <li class="dropdown-item" value="5">
                        <img src="./../img/si_5.png" width="20" height="20">
                        Bowser
                    </li>
                    <li class="dropdown-item" value="6">
                        <img src="./../img/si_6.png" width="20" height="20">
                        Link
                    </li>
                    <li class="dropdown-item" value="7">
                        <img src="./../img/si_7.png" width="20" height="20">
                        Luigi
                    </li>
                    <li class="dropdown-item" value="8">
                        <img src="./../img/si_8.png" width="20" height="20">
                        Mario
                    </li>
                    <li class="dropdown-item" value="9">
                        <img src="./../img/si_9.png" width="20" height="20">
                        Marth
                    </li>
                    <li class="dropdown-item" value="10">
                        <img src="./../img/si_10.png" width="20" height="20">
                        Mewtwo
                    </li>
                    <li class="dropdown-item" value="11">
                        <img src="./../img/si_11.png" width="20" height="20">
                        Ness
                    </li>
                    <li class="dropdown-item" value="12">
                        <img src="./../img/si_12.png" width="20" height="20">
                        Peach
                    </li>
                    <li class="dropdown-item" value="13">
                        <img src="./../img/si_13.png" width="20" height="20">
                        Pikachu
                    </li>
                    <li class="dropdown-item" value="14">
                        <img src="./../img/si_14.png" width="20" height="20">
                        Ice Climbers
                    </li>
                    <li class="dropdown-item" value="15">
                        <img src="./../img/si_15.png" width="20" height="20">
                        Jigglypuff
                    </li>
                    <li class="dropdown-item" value="16">
                        <img src="./../img/si_16.png" width="20" height="20">
                        Samus
                    </li>
                    <li class="dropdown-item" value="17">
                        <img src="./../img/si_17.png" width="20" height="20">
                        Yoshi
                    </li>
                    <li class="dropdown-item" value="18">
                        <img src="./../img/si_18.png" width="20" height="20">
                        Zelda
                    </li>
                    <li class="dropdown-item" value="19">
                        <img src="./../img/si_19.png" width="20" height="20">
                        Sheik
                    </li>
                    <li class="dropdown-item" value="20">
                        <img src="./../img/si_20.png" width="20" height="20">
                        Falco
                    </li>
                    <li class="dropdown-item" value="21">
                        <img src="./../img/si_21.png" width="20" height="20">
                        Young Link
                    </li>
                    <li class="dropdown-item" value="22">
                        <img src="./../img/si_22.png" width="20" height="20">
                        Dr. Mario
                    </li>
                    <li class="dropdown-item" value="23">
                        <img src="./../img/si_23.png" width="20" height="20">    
                        Roy
                    </li>
                    <li class="dropdown-item" value="24">
                        <img src="./../img/si_24.png" width="20" height="20">
                        Pichu
                    </li>
                    <li class="dropdown-item" value="25">
                        <img src="./../img/si_25.png" width="20" height="20">
                        Ganondorf
                    </li>
                    <li class="dropdown-item" value="26">
                        <img src="./../img/si_26.png" width="20" height="20">
                        Master Hand
                    </li>
                    <li class="dropdown-item" value="29">
                        <img src="./../img/si_29.png" width="20" height="20">
                        Gigabowser
                    </li>
                    <li class="dropdown-item" value="32">
                        <img src="./../img/si_32.png" width="20" height="20">
                        Popo
                    </li>
                </ul>
            </div>
        </div>
        `;
    }

    getTargetColor (charID) {
        let dropDowns = `
        <li class="dropdown-item" value="0">
            <img src="./../img/si_${charID}.png" width="20" height="20">
            - 0
        </li>
        `;

        const numAltCostumes = Utility.getMaxCostumesByCharacter(charID);
        let i = 1;
        while (i <= numAltCostumes) {
            dropDowns = `${dropDowns}
            <li class="dropdown-item" value="${i}">
                <img src="./../img/si_${charID}_${i}.png" width="20" height="20">
                - ${String(i)}
            </li>
            `;
            i++;
        }

        return `
        <div class="col-md">
            <div class="dropdown">
                <button class="btn dropdown-toggle target-dropdown w-100" value="null" type="button" id="${this.idMap.get("i5b1")}" data-bs-toggle="dropdown" aria-expanded="false">
                    Choose Color:
                </button>
                <ul class="has-validation dropdown-menu dropdown-scroll" aria-labeledby="${this.idMap.get("i5b1")}" id="${this.idMap.get("i5")}"">
                    <li selected><h6 class="dropdown-header">Choose Color:</h6></li>
                    ${dropDowns}
                </ul>
            </div>
        </div>
        `;
    }

    renderColorOptions(newChar) {
        if (document.getElementById(this.idMap.get("i5"))) {
            const targetDiv = document.getElementById(this.idMap.get("i5")).closest(".col-md");
            const innerHtml = this.getTargetColor(newChar);
            targetDiv.innerHTML = innerHtml;
        }
    }

    getInputDivOne () {
        return this.getElementById("i1");
    }

    getButtonDivTwo () {
        return this.getElementById("b2");
    }

    updateTargetType (flavor) {
        this.#selectorRow.innerHTML = this.renderSelectorRow(flavor);
        this.#currentFlavor = flavor;
        this._addDropdownCallback();
    }
}

module.exports = FindComboView;