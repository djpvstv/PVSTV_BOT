class ParseViewBase {

    constructor (controller, progressController, panelDiv) {
        this.controller = controller;
        this.progressController = progressController;
        this.idMap = new Map();
    }

    createImportFromDirectory ( openFolderButtonID, inputID, parseButtonID ) {
        const article = `
        <label for="id="${openFolderButtonID}">Import from Directory</label>
        <div class="input-group mb-3">
            <button class="btn btn-light rm-1" id="${openFolderButtonID}">Choose...</button>
            <input type="text" class="form-control" id="${inputID}">
            <button type="submit" class="btn btn-primary rm-1" id="${parseButtonID}" disabled>Parse Directory</button>
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

    // Helpers
    getElementById (ID) {
        return document.getElementById(this.idMap.get(ID));
    }

    onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }
}

module.exports = ParseViewBase;