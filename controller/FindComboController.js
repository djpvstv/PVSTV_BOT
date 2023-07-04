const { EventEmitter } = require("events");
const {ipcRenderer} = require("electron");

class FindComboController extends EventEmitter {
    events = [
        "updatecombotarget",
        "updatePanelThreeAccordion",
        "hideSpinner"
    ];
    #idMap = null;

    constructor () {
        super();
        this.setUpListeners();
    }

    setUpListeners () {
        const that = this;
        ipcRenderer.on("findComboEvent", (evt, args) => {
            const response = args.args;
            if (args.eventName === "findCombosComplete") {
                const parsedData = JSON.parse(response.replaceAll('\\', '/'));
                this.emit("updatePanelThreeAccordion", parsedData);
                this.emit("hideSpinner");
            }
        });
    }

    setIDMap (map) {
        this.idMap = map;
    }

    getEvents () {
        return this.events;
    }

    cb_selectTargetTypeDropdown (type) {

        this.emit("updatecombotarget", {
            flavor: parseInt(type)
        });
    }

    async cb_emitButtonEvent (sourceID, eventName, evtData) {
        const data = {};
        data.sourceID = sourceID;
        data.eventName = eventName;
        if (evtData) {
            data.val = evtData;
        }
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (error) {
            console.log(error);
        }
    }

    // Validation Methods 
    cb_validateTargetTab (newTab) {
        // Three uppercase letters (1-10), #, 1-3 numbers
        const isValid = /^[A-Z]{1,10}#\d{1,3}$/.test(newTab.toUpperCase());

        const inputDiv = this.getElementById("i3");
        inputDiv.classList.remove("is-valid");
        inputDiv.classList.remove("is-invalid");
        
        if (isValid) {
            inputDiv.classList.add("is-valid");
        } else {
            inputDiv.classList.add("is-invalid");
        }
        if (newTab.length === 0) {
            inputDiv.classList.remove("is-invalid");
        }
        return isValid;
    }

    validateAllWidgetsForBigButton () {
        const flavor = parseInt(this.getElementById("i2").value);

        const isTagValid = /^[A-Z]{1,10}#\d{1,3}$/.test(this.getElementById("i3").value);
        const isDirInputValid = this.getElementById("i1").classList.contains("is-valid");
        const isCharValid = false;
        const isColorValid = false;

        switch (flavor) {
            case 1:
                return isTagValid && isDirInputValid;
            case 2:
                return isCharValid && isDirInputValid;
            case 3:
                return isCharValid && isColorValid && isDirInputValid;
            case 4:
                return isTagValid && isCharValid && isDirInputValid;
            case 5:
                return isTagValid && isCharValid && isColorValid && isDirInputValid;
        }
    }

    getElementById (ID) {
        return document.getElementById(this.idMap.get(ID));
    }
}

module.exports = FindComboController;