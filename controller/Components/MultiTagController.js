const path = require("path");

const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");
const Utility = require(path.join(__dirname, "..", "..", "Utility"));

class MultiTagController extends EventEmitter {

    events = [
        "showMultiTagModal",
        "hideMultiTagModal",
        "updateMultipleSearchTags"
    ]

    constructor () {
        super();
    }

    getEvents () {
        return this.events;
    }

    showSpinner(args) {
        const eventData = {args};
        this.emit("showMultiTagModal", eventData);
    }

    hideSpinner(args) {
        const eventData = {args};
        this.emit("hideMultiTagModal", eventData);
    }

    getOkButton() {
        return document.getElementById("okMultiTag");
    }

    validateInput (tag, evt, numValidNames) {
        this.getOkButton().setAttribute("disabled","");
        const controlDiv = document.getElementById(tag);
        let isValid;
        const newTag = evt.target.value;
        isValid = Utility.validateTargetTab(newTag, document.getElementById(tag));
        if (isValid) {
            controlDiv.value = newTag.toUpperCase();
            if (this.areAllInputsValid(numValidNames)) {
                this.getOkButton().removeAttribute("disabled");
            }
        }
        if (isValid) {
            return newTag.toUpperCase();
        }
        return false;
    }

    areAllInputsValid (numValidNames) {
        let areAllValid = true;
        for (let i = 0; i < numValidNames; ++i) {
            const inputID = `multiTagInput${i}`;
            const controlDiv = document.getElementById(inputID);
            const isValid = Utility.validateTargetTab(controlDiv.value, document.getElementById(inputID));
            areAllValid = areAllValid && isValid;
        }
        return areAllValid;
    }

    cb_updateMultipleSearchTags (args) {
        this.emit("updateMultipleSearchTags", args);
    }

}

module.exports = MultiTagController;