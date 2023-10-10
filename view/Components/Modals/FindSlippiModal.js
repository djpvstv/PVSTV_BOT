const bootstrap = require('../../../Bootstrap/js/bootstrap.bundle.min');

class FindSlippiModal {

    #controller = null;
    #modal = null;
    #modalDiv = null;
    #modalTitle = "";
    #flavor = null;

    #isShowing = false;
    #inputID = "";
    #findButtonID = "";
    #findButtonLabel = "";

    constructor ( controller, appState ) {
        this.#controller = controller;
        this.#flavor = 0;

        const topDiv = document.createElement("div");
        topDiv.classList.add("modal", "fade");
        topDiv.setAttribute("id","findSlippiModal");
        topDiv.setAttribute("data-bs-backdrop", "static");
        topDiv.setAttribute("tabIndex", "-1");
        topDiv.setAttribute("data-bs-keyboard", "false");
        topDiv.setAttribute("aria-labelledby","staticBackdropLabel");
        topDiv.setAttribute("aria-modal", "true");
        topDiv.setAttribute("role","dialog");
        topDiv.setAttribute("data-bs-theme", "dark");
        topDiv.style.display = "none";

        this.#modalDiv = topDiv;
        this.#inputID = "slippiModalInput";
        this.#findButtonID = "slippiModalFindButton";
        this.#findButtonLabel = "slippiModalFindButtonLabel";

        this.renderDiv();
        
        document.body.appendChild(topDiv);

        this.#modal = new bootstrap.Modal(document.getElementById('findSlippiModal'), {
            keyboard: false
        });

        this._applyCallbacks();
    }

    renderDiv () {
        const buttonLabel = this.#flavor === 0 ? `"Slippi Dolphin" Location` : `Melee ISO Location`;
        this.#modalDiv.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">${this.#modalTitle}</h1>
                </div>
                <div class="modal-body">
                    <label for="findSlippiModalButton" class="dropped-label">${buttonLabel}</label>
                    <div class="input-group mb-3">
                        <button class="btn btn-dark btn-left rm-1" id="findSlippiModalButton">Choose...</button>
                        <input type="text" class="form-control" id="${this.#inputID}">
                        <div class="invalid-feedback">
                            Please enter a valid Slippi Dolphin application.
                        </div>
                        <div class="valid-feedback">
                            Valid file
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="confirmFile" type="button" class="btn btn-primary" data-bs-dismiss="modal" disabled>Confirm</button>
                    <button id="cancelFile" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
        `;
    }

    _applyCallbacks () {
        const flavor = this.#flavor;
        document.getElementById("findSlippiModalButton").addEventListener("click", async () => {
            await this.#controller.cb_emitChooseButtonEvent(flavor);
        });

        document.getElementById("confirmFile").addEventListener("click", async () => {
            const inputDiv = document.getElementById(this.#inputID);
            await this.#controller.cb_emitAcceptButtonEvent(flavor, true, inputDiv.value);
        });

        document.getElementById("cancelFile").addEventListener("click", async () => {
            await this.#controller.cb_emitAcceptButtonEvent(flavor, false);
        });
    }

    show (args) {
        this.#isShowing = true;
        this.#flavor = args.flavor;
        if (Object.hasOwnProperty.call(args, 'modalTitle')) {
            this.#modalTitle = args.modalTitle;
        }
        this.renderDiv();
        this._applyCallbacks();
        this.#modal.show();
    }

    hide (args) {
        this.#isShowing = false;
        this.#modal.hide();
    }

    newPath (args) {
        const inputDiv = document.getElementById(this.#inputID);
        const confirmDiv = document.getElementById("confirmFile");
        if (args.success) {
            inputDiv.classList.add("is-valid");
            inputDiv.classList.remove("is-invalid");
            inputDiv.value = args.path
            confirmDiv.disabled = false;
        } else {
            inputDiv.classList.remove("is-valid");
            confirmDiv.disabled = true;
        }

    }
}

module.exports = FindSlippiModal;