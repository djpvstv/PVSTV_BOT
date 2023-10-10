const bootstrap = require('../../../Bootstrap/js/bootstrap.bundle.min');

class SettingsModalView {

    #controller = null;
    #appState = null;
    #isShowing = false;
    #modal = null;
    #modalDiv = null;
    #progressDiv = null;
    #idMap = null;
    #modalTitle = "Settings";

    #MAX_FRAME_LENIENCY = 120;
    #MAX_FRAME_PRE_POST_COMBO = 300;

    constructor ( controller, appState ) {
        this.#controller = controller;
        this.#appState = appState;
        this.setKeys();

        const topDiv = document.createElement("div");
        topDiv.classList.add("modal", "fade");
        topDiv.setAttribute("id","settingsModal");
        topDiv.setAttribute("data-bs-backdrop", "static");
        topDiv.setAttribute("tabIndex", "-1");
        topDiv.setAttribute("data-bs-keyboard", "false");
        topDiv.setAttribute("aria-labelledby","staticBackdropLabel");
        topDiv.setAttribute("aria-modal", "true");
        topDiv.setAttribute("role","dialog");
        topDiv.setAttribute("data-bs-theme", "dark");
        topDiv.style.display = "none";

        this.#modalDiv = topDiv;

        this.renderDiv();
        
        document.body.appendChild(topDiv);

        this.#modal = new bootstrap.Modal(document.getElementById('settingsModal'), {
            keyboard: false
        });

        this._applyCallbacks();
    }

    setKeys () {
        this.#idMap = new Map();
        this.#idMap.set("b1", "settingsModal_slippi_button");
        this.#idMap.set("b1i", "settingsModal_slippi_input")
        this.#idMap.set("b2", "settingsModal_iso_button");
        this.#idMap.set("b2i", "settingsModal_iso_input");
        this.#idMap.set("i1", "settingsModal_batch_size_input");
        this.#idMap.set("i2", "settingsModal_frame_leniency_input");
        this.#idMap.set("i3", "settingsModal_pagination_button");
        this.#idMap.set("i4", "settingsModal_preReplay_frames_input");
        this.#idMap.set("i5", "settingsModal_postReplay_frame_input");
        this.#idMap.set("i3d", "settingsModal_pagination_dropdown");
        this.#idMap.set("c1", "settingsModal_confirm_button");
        this.#idMap.set("c2", "settingsModal_cancel_button");
    }

    getElementById (val) {
        return document.getElementById(this.#idMap.get(val));
    }

    renderDiv () {
        this.#modalDiv.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">${this.#modalTitle}</h1>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <label for="findSlippiModalButton" class="dropped-label">Slippi Dolphin Location</label>
                            <div class="input-group mb-3">
                                <button class="btn btn-dark btn-left rm-1" id="${this.#idMap.get("b1")}">Choose...</button>
                                <input disabled type="text" class="form-control" id="${this.#idMap.get("b1i")}">
                                <div class="invalid-feedback">
                                    Please enter a valid Slippi Dolphin application.
                                </div>
                                <div class="valid-feedback">
                                    Valid file
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <label for="findSlippiModalButton" class="label">Melee ISO Location</label>
                            <div class="input-group mb-3">
                                <button class="btn btn-dark btn-left rm-1" id="${this.#idMap.get("b2")}">Choose...</button>
                                <input disabled type="text" class="form-control" id="${this.#idMap.get("b2i")}">
                                <div class="invalid-feedback">
                                    Please enter a valid Melee ISO.
                                </div>
                                <div class="valid-feedback">
                                    Valid file
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="settingsInputWrapper">
                                    <label for="${this.#idMap.get("i1")}">Batch Size</label>
                                    <input type="number" class="form-control settingsInput" id="${this.#idMap.get("i1")}" value="${this.#appState.getBatchSize()}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="settingsInputWrapper">
                                    <label for="${this.#idMap.get("i2")}">Frame Leniency</label>
                                    <input type="number" class="form-control settingsInput" id="${this.#idMap.get("i2")}" value="${this.#appState.getFrameLeniency()}" min="0" max="${this.#MAX_FRAME_LENIENCY}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="settingsInputWrapper">
                                    <button class="btn dropdown-toggle target-dropdown settingsInput" value="${this.#appState.getHitsPerPage()}" type="button" id="${this.#idMap.get("i3")}" data-bs-toggle="dropdown" aria-expanded="false">
                                        Pagination Size: ${this.#appState.getHitsPerPage()}
                                    </button>
                                    <ul class="has-validation dropdown-menu dropdown-scroll" aria-labeledby="${this.#idMap.get("i3")}" id="${this.#idMap.get("i3d")}"">
                                        <li class="dropdown-item" value="10">10</li>
                                        <li class="dropdown-item" value="20">20</li>
                                        <li class="dropdown-item" value="50">50</li>
                                        <li class="dropdown-item" value="100">100</li>
                                        <li class="dropdown-item" value="200">200</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2"></div>
                            <div class="col-md-4">
                                <div class="settingsInputWrapper">
                                    <label for="${this.#idMap.get("i4")}">Pre-Replay Frames</label>
                                    <input type="number" class="form-control settingsInput" id="${this.#idMap.get("i4")}" value="${this.#appState.getPreReplayFrames()}" min="0" max="${this.#MAX_FRAME_PRE_POST_COMBO}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="settingsInputWrapper">
                                    <label for="${this.#idMap.get("i5")}">Post-Replay Frames</label>
                                    <input type="number" class="form-control settingsInput" id="${this.#idMap.get("i5")}" value="${this.#appState.getPostReplayFrames()}" min="0" max="${this.#MAX_FRAME_PRE_POST_COMBO}">
                                </div>
                            </div>
                            <div class="col-md-2"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="${this.#idMap.get("c1")}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
                        <button id="${this.#idMap.get("c2")}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>`;


        this.updateSettingsWidgets();
    }

    _applyCallbacks () {
        this.getElementById("b1").addEventListener("click", async () => {
            await this.#controller.cb_emitChooseButtonEvent(0);
        });

        this.getElementById("b2").addEventListener("click", async () => {
            await this.#controller.cb_emitChooseButtonEvent(1);
        });

        this.getElementById("i3d").addEventListener("click", async (event) => {
            const dropdownButton = this.getElementById("i3");
            const newValue = parseInt(event.target.value);
            dropdownButton.innerHTML = `Pagination Size: ${newValue}`;
            dropdownButton.setAttribute("value", newValue);
        });

        this.getElementById("c1").addEventListener("click", async () => {
            const meleeIso = this.getElementById("b2i").value;
            const slippiPath = this.getElementById("b1i").value;
            this.#appState.setIsoPath(meleeIso);
            this.#appState.setSlippiPath(slippiPath);

            const batchSize = parseInt(this.getElementById("i1").value);
            const frameLeniency = parseInt(this.getElementById("i2").value);
            const paginationSize = parseInt(this.getElementById("i3").value);
            const preFrames = parseInt(this.getElementById("i4").value);
            const postFrames = parseInt(this.getElementById("i5").value);

            if (batchSize > 0) this.#appState.setBatchSize(batchSize);
            if (frameLeniency >= 0 && frameLeniency <= this.#MAX_FRAME_LENIENCY) this.#appState.setFrameLeniency(frameLeniency);
            if (paginationSize > 9 && paginationSize <= 200) this.#appState.setHitsPerPage(paginationSize);
            if (preFrames >= 0 && preFrames <= this.#MAX_FRAME_PRE_POST_COMBO) this.#appState.setPreReplayFrames(preFrames);
            if (postFrames >= 0 && postFrames <= this.#MAX_FRAME_PRE_POST_COMBO) this.#appState.setPostReplayFrames(postFrames);

            this.#controller.cb_updateNonPathSettings({
                batchSize: this.#appState.getBatchSize(),
                frameLeniency: this.#appState.getFrameLeniency(),
                paginationSize: this.#appState.getHitsPerPage(),
                preReplayFrames: this.#appState.getPreReplayFrames(),
                postReplayFrames: this.#appState.getPostReplayFrames()
            });
        });

        this.getElementById("c2").addEventListener("click", async () => {
            const meleeIso = this.#appState.getIsoPath();
            const slippiLocation = this.#appState.getSlippiPath();
            this.#controller.cb_updateServerPaths(slippiLocation, meleeIso);
        });
    }

    updateSettingsWidgets () {
        if (this.#isShowing) {
            const slippiLocation = this.#appState.getSlippiPath();
            this.getElementById("b1i").value = slippiLocation;

            const meleeLocation = this.#appState.getIsoPath();
            this.getElementById("b2i").value = meleeLocation;
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

    newPath (args) {
        const fileType = /(?:\.([^.]+))?$/.exec(args.path)[1];
        let inputDiv = this.getElementById("b1i");
        if (fileType === 'iso' || fileType === 'ISO') inputDiv = this.getElementById("b2i");
        const confirmDiv = this.getElementById("c1");
        if (args.success) {
            inputDiv.classList.add("is-valid");
            inputDiv.classList.remove("is-invalid");
            inputDiv.value = args.path
            confirmDiv.disabled = false;
        }

    }
}

module.exports = SettingsModalView;