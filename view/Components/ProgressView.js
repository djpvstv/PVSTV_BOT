const bootstrap = require('../../Bootstrap/js/bootstrap.bundle.min');

class ProgressView {

    #controller = null;
    #modal = null;
    #progressDiv = null;
    #modalTitle = "";

    #isShowing = false;
    #numTotalFiles = 0;
    #numCurrentFiles = 0;

    constructor ( controller ) {
        this.#controller = controller;

        const topDiv = document.createElement("div");
        topDiv.classList.add("modal", "fade");
        topDiv.setAttribute("id","progressModal");
        topDiv.setAttribute("data-bs-backdrop", "static");
        topDiv.setAttribute("tabIndex", "-1");
        topDiv.setAttribute("data-bs-keyboard", "false");
        topDiv.setAttribute("aria-labelledby","staticBackdropLabel");
        topDiv.setAttribute("aria-modal", "true");
        topDiv.setAttribute("role","dialog");
        topDiv.style.display = "none";

        this.#progressDiv = topDiv;

        this.renderDiv();
        
        document.body.appendChild(topDiv);

        this.#modal = new bootstrap.Modal(document.getElementById('progressModal'), {
            keyboard: false
        });

        document.getElementById("progressModal").addEventListener("click", async () => {
            console.log("clicked on cancel");
            try {
                await this.#controller.cb_handleCancel("progressModal");
            } catch (error) {
                console.log(error);
            }
        });

        // Correct the state of the spinner if the model is faster.
        document.getElementById("progressModal").addEventListener("shown.bs.modal", async () => {
            if (!this.#isShowing) {
                this.#modal.hide();
            }
        });

    }

    renderDiv () {
        const percValue = Math.round(this.#numCurrentFiles / this.#numTotalFiles * 100);
        this.#progressDiv.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">${this.#modalTitle}</h1>
                </div>
                <div class="modal-body">
                    <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="${percValue}" aria-valuemin="0" aria-valuemax="100" style="margin-top: 10;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${percValue}%">${percValue}%</div>
                    </div>
                    <p style="margin-top: 10;">${this.#numCurrentFiles} out of ${this.#numTotalFiles} processed</p>
                </div>
                <div class="modal-footer">
                    <button id="cancelProgress" type="button" class="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
        `;

    }

    show (args) {
        this.#isShowing = true;
        if (Object.hasOwnProperty.call(args, 'modalTitle')) {
            this.#modalTitle = args.modalTitle;
        }
        if (Object.hasOwnProperty.call(args, 'totalFiles')) {
            this.#numTotalFiles = args.totalFiles;
        }
        this.#numCurrentFiles = 0;
        this.renderDiv();
        this.#modal.show();
    }

    hide (args) {
        this.#isShowing = false;
        this.#modal.hide();
    }

    updateCount (args ) {
        this.#numCurrentFiles = args.count;
        this.renderDiv();
    }


}

module.exports = {ProgressView};