class ParseViewBase {

    fileList = [];

    constructor (controller, progressController) {
        this.controller = controller;
        this.progressController = progressController;
        this.idMap = new Map();
    }

    createImportFromDirectory ( openFolderButtonID, inputID, parseButtonID, parseButtonLabel ) {
        const article = `
        <div class="batchInputWrapper">
            <label for="${openFolderButtonID}_batchButton">Batch Size</label>
            <input type="number" class="form-control batchInput" id="${parseButtonID}_batchInput" placeholder="20">
        </div>
        <label for="${openFolderButtonID}" class="dropped-label">Import from Directory</label>
        <div class="input-group mb-3">
            <button class="btn btn-light rm-1" id="${openFolderButtonID}">Choose...</button>
            <input type="text" class="form-control" id="${inputID}">
            <button type="submit" class="btn btn-primary rm-1" id="${parseButtonID}" disabled>${parseButtonLabel}</button>
            <div class="invalid-feedback">
                Please enter a directory with Slippi (.slp) replays.
            </div>
            <div class="valid-feedback">
                Valid directory
            </div>
        </div>`;
        const articleDiv = document.createElement("article");
        articleDiv.innerHTML = article;
        return articleDiv;
    }

    // Check to see if the folder path is OK
    updateValidationStateForInputOne (isValid, dir, doValidation, errorMsg) {

        const inputDiv = this.getInputDivOne();
        const parseDiv = this.getButtonDivTwo();

        if (dir) {
            inputDiv.setAttribute("value", dir);
        }

        if (!isValid) {
            inputDiv.classList.remove("is-valid");
            parseDiv.setAttribute("disabled","");

            if (typeof dir === 'undefined') {
                inputDiv.classList.remove("is-invalid");
                inputDiv.setAttribute("value","");
                // Early return - closed or cancelled UI
                return;
            }
            
            inputDiv.classList.add("is-invalid");
            console.log("Error from Server: " + errorMsg);

            
            // Early return - Invalid directory
            return;
        }

        if (doValidation) {
            parseDiv.removeAttribute("disabled");
        }
        inputDiv.classList.remove("is-invalid");
        inputDiv.classList.add("is-valid");
    }

    // Helpers
    getElementById (ID) {
        return document.getElementById(this.idMap.get(ID));
    }

    // Override these methods
    getInputDivOne () {
    }

    getButtonDivTwo () {
    }
    //

    onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }
}

module.exports = ParseViewBase;