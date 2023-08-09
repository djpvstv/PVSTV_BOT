const bootstrap = require('../../Bootstrap/js/bootstrap.bundle.min');

class NotesModal {

    #controller = null;
    #appState = null;
    #isShowing = false;
    #modal = null;
    #modalDiv = null;
    #idMap = null;
    #comboNum = null;

    #modalTitle = 'Combo Notes';

    constructor ( controller, appState ) {
        this.#controller = controller;
        this.#appState = appState;
        this.setKeys();

        const topDiv = document.createElement("div");
        topDiv.classList.add("modal", "fade");
        topDiv.setAttribute("id","notesModal");
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

        this.#modal = new bootstrap.Modal(document.getElementById('notesModal'), {
            keyboard: false
        });
    }

    setKeys () {
        this.#idMap = new Map();
        this.#idMap.set("i1", "notesModal_notes_input");
        this.#idMap.set("c1", "notessModal_confirm_button");
        this.#idMap.set("c2", "notesModal_cancel_button");
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
                            <label for="findSlippiModalButton" class="dropped-label">Your notes:</label>
                            <div class="input-group mb-3">
                                <textarea class="form-control" id="${this.#idMap.get("i1")}"></textarea>
                                <div class="invalid-feedback">
                                    Please enter a valid Slippi Dolphin application.
                                </div>
                                <div class="valid-feedback">
                                    Valid file
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="${this.#idMap.get("c1")}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
                        <button id="${this.#idMap.get("c2")}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>`;
    }

    _applyCallbacks () {
        this.getElementById("c1").addEventListener("click", () => {
            const notes = this.getElementById("i1").value;
            this.#controller.cb_applyNotes(notes, this.#comboNum);
        });
    }

    show (args) {
        this.#isShowing = true;
        this.#comboNum = args.comboNum;

        this.renderDiv();
        this._applyCallbacks();
        if (args.notes) this.getElementById("i1").value = this.#controller.unsanitizeNotes(args.notes);
        this.#modal.show();
    }

    hide (args) {
        this.#isShowing = false;
        this.#modal.hide();
    }
}

module.exports = NotesModal;