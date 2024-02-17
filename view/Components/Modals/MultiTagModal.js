const path = require('path');

const bootstrap = require(path.join(__dirname, '..', '..', '..', 'Bootstrap', 'js', 'bootstrap.bundle.min'));

class MultiTagModal {

    #controller = null;
    #modal = null;
    #multiTagDiv = null;
    #modalTitle = "Search for Multiple Tags";

    #isShowing = false;
    #validNames = [];
    #foundTagHTML = null;

    constructor ( controller ) {
        this.#controller = controller;

        const topDiv = document.createElement("div");
        topDiv.classList.add("modal", "fade");
        topDiv.setAttribute("id","multiTagModal");
        topDiv.setAttribute("data-bs-backdrop", "static");
        topDiv.setAttribute("tabIndex", "-1");
        topDiv.setAttribute("data-bs-keyboard", "false");
        topDiv.setAttribute("aria-labelledby","staticBackdropLabel");
        topDiv.setAttribute("aria-modal", "true");
        topDiv.setAttribute("role","dialog");
        topDiv.setAttribute("data-bs-theme", "dark");
        topDiv.style.display = "none";

        this.#multiTagDiv = topDiv;

        this.renderDiv();
        
        document.body.appendChild(topDiv);

        this.#modal = new bootstrap.Modal(document.getElementById('multiTagModal'), {
            keyboard: false
        });

    }

    renderDiv () {
        this.#multiTagDiv.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">${this.#modalTitle}</h1>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-col col-md-12">
                            <label class="dropped-label">Tags</label>
                            <div class="has-validation">
                                <div class="form-floating">
                                    ${this.getInputElementsByValidList()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="okMultiTag" type="button" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
                    <button id="cancelMultiTag" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
        `;

        this.setInputCallbacks();

    }

    getInputElementsByValidList () {
        let idx = 0;
        let inputElements = ``;

        this.#validNames.forEach(validName => {
            inputElements = `${inputElements}
                <div class="input-group has-validation mb-3 flex-grow-1">
                    <input class="form-control buffer-right-slightly" list="multiTagInput${idx}_list" id="multiTagInput${idx}" value="${validName}" placeholder="Slippi Tag" pattern="^[A-Z]{1,10}#\d{1,3}" required>
                    <datalist type="datalistOptions" id="multiTagInput${idx}_list">
                        ${this.#foundTagHTML}
                    </datalist>
                    <div class="invalid-feedback">
                        Incorrect tag format
                    </div>
                    <svg class="big-icon" id="multiTagInput${idx}_icon">
                        <image xlink:href="./../Bootstrap/svg/dash-circle.svg" width="35" height="35" y="3"/>
                    </svg>
                </div>
            `;
        idx++;
        });

        inputElements = `${inputElements}
            <div class="input-group mb-3 flex-grow-1">
                <input class="form-control buffer-right-slightly" list="multiTagInput${idx}_list" id="multiTagInput${idx}" placeholder="Slippi Tag" pattern="^[A-Z]{1,10}#\d{1,3}" required>
                <datalist type="datalistOptions" id="multiTagInput${idx}_list">
                    ${this.#foundTagHTML}
                </datalist>
                <div class="invalid-feedback">
                    Incorrect tag format
                </div>
                <svg class="big-icon disabled-icon" id="multiTagInput${idx}_icon">
                    <image xlink:href="./../Bootstrap/svg/plus-circle.svg" width="35" height="35" y="3"/>
                </svg>
            </div>
        `;

        return inputElements;
    }

    setInputCallbacks () {
        // Accept Callback
        let okButton = document.getElementById("okMultiTag");
        if (okButton) {
            okButton.addEventListener("click", async() => {
                this.#controller.cb_updateMultipleSearchTags({
                    validTagList: this.#validNames
                });
            });
        }

        // Edit Callbacks for text inputs
        let controlDiv, isValid;
        const numValidNames = this.#validNames.length;
        for (let i = 0; i < numValidNames; ++i) {
            const inputID = `multiTagInput${i}`;
            controlDiv = document.getElementById(inputID);
            if (controlDiv) {
                controlDiv.addEventListener("change", (evt) => {
                    isValid = this.#controller.validateInput(inputID, evt, numValidNames);
                    if (isValid) {
                        this.#validNames[i] = isValid;
                    }
                });
            }
        }

        // Callbacks for minus button
        for (let i = 0; i < numValidNames; ++i) {
            const inputID = `multiTagInput${i}_icon`;
            controlDiv = document.getElementById(inputID);
            if (controlDiv) {
                controlDiv.addEventListener("click", (evt) => {
                    this.#validNames.splice(i, 1);
                    this.renderDiv();
                });
            }
        }

        // Edit callback for last text input
        const inputID = `multiTagInput${numValidNames}`;
        controlDiv = document.getElementById(inputID);
        if (controlDiv) {
            controlDiv.addEventListener("change", (evt) => {
                isValid = this.#controller.validateInput(inputID, evt, numValidNames);
                if (isValid) {
                    const iconID = `multiTagInput${numValidNames}_icon`;
                    document.getElementById(iconID).classList.remove("disabled-icon");
                    this.#validNames.push(isValid);
                    this.renderDiv();
                }
            });
        }
    }

    show (args) {
        this.#isShowing = true;
        if (args.targetTag && args.targetTag.length > 2) {
            if (this.#validNames.indexOf(args.targetTag) < 0) {
                this.#validNames.push(args.targetTag);
            }
        }
        if (args.foundTagHTML) {
            this.#foundTagHTML = args.foundTagHTML;
        }
        this.renderDiv();
        this.#modal.show();
    }

    hide (args) {
        this.#isShowing = false;
        this.#validNames = [];
        this.#modal.hide();
    }

}

module.exports = MultiTagModal;