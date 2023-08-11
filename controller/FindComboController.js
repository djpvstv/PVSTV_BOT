const { EventEmitter } = require("events");
const {ipcRenderer} = require("electron");
const Utility = require("../Utility");

class FindComboController extends EventEmitter {
    events = [
        "updatecombotarget",
        "updatePanelTwoAccordion",
        "hideSpinner",
        "showNotesModal"
    ];
    #idMap = null;
    #contextShowing = null;
    #charUpperLimit = 26;
    #currentPage = null;
    #contextSelect = {
        game: null,
        combo: null
    };

    constructor () {
        super();
        this.setUpListeners();
        this.#contextShowing = false;
    }

    setUpListeners () {
        const that = this;
        ipcRenderer.on("findComboEvent", (evt, args) => {
            let response = args.args;
            this.#currentPage = response.page;
            if (args.eventName === "findCombosComplete") {
                this.emit("updatePanelTwoAccordion", response);
                this.emit("hideSpinner");
            } else if (args.eventName === "updatePanelTwoAccordionJustAccordion") {
                this.emit("updatePanelTwoAccordion", response);
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

    cb_setSelectedComboFromClick(event) {
        const closestParent = event.srcElement.closest(".outer-accordion-item");
        if (!(closestParent)) return;

        const gameAndCombo = closestParent.querySelector(".outer-accordion-header").id.replace("combo_","").replace("_heading","");
        const parts = gameAndCombo.split("").reverse().join("").split("_");
        const comboNum = parseInt(parts.shift().split("").reverse().join(""));
        const game = parts.join("_").split("").reverse().join("");

        this.#contextSelect.combo = comboNum;
        this.#contextSelect.game = game;
    }

    cb_handleRightClick (event) {
        this.#contextShowing = true;
        const closestParent = event.srcElement.closest(".outer-accordion-item");
        if (!(closestParent)) return;

        const gameAndCombo = closestParent.querySelector(".outer-accordion-header").id.replace("combo_","").replace("_heading","");
        const parts = gameAndCombo.split("").reverse().join("").split("_");
        const comboNum = parseInt(parts.shift().split("").reverse().join(""));
        const game = parts.join("_").split("").reverse().join("");

        const contextDiv = document.getElementById(this.idMap.get("c1"));

        let xPos = event.clientX + window.scrollX;
        let yPos = event.clientY + window.scrollY;

        xPos = window.innerWidth < xPos + 250 ? xPos - 250 : xPos;
        yPos = window.innerHeight < yPos + 198 ? yPos - 198 : yPos;

        contextDiv.style.left = xPos;
        contextDiv.style.top = yPos;
        contextDiv.classList.remove("hidden-context");
        contextDiv.classList.add("show-context");

        this.#contextSelect.combo = comboNum;
        this.#contextSelect.game = game;
    }

    cb_hideContextMenu (event, forceClose) {
        if (this.#contextShowing) {
            // don't close if clicking on context menu
            if (!forceClose) {
                if (event.srcElement.closest(".context-wrapper")) return;
            }
                
            const contextDiv = document.getElementById(this.idMap.get("c1"));
            contextDiv.classList.add("hidden-context");
            contextDiv.classList.remove("show-context");
            this.#contextShowing = false;
            if (event) event.stopPropagation();
        }
    }

    isContextShowing () {
        return this.#contextShowing;
    }

    cb_playCombo () {
        this.cb_hideContextMenu(null, true);
        const sendData = {
            game: this.#contextSelect.game,
            combo: this.#contextSelect.combo
        };
        this.cb_emitButtonEvent(this.idMap.get("c1l1"), "playCombo", sendData);
    }

    async cb_editCombo (){
        this.cb_hideContextMenu(null, true);
        const comboNotes = await this.cb_getNotesForCombo(this.#contextSelect.combo);
        const sendData = {
            args: {
                notes: comboNotes,
                comboNum: this.#contextSelect.combo
            }
        };
        this.emit("showNotesModal", sendData);
    }

    async cb_getNotesForCombo (comboNum) {
        let notes = '';
        const eventName = "retrieveComboNotes";

        const data = {
            eventName: eventName,
            val: comboNum
        };
        try {
            notes = await ipcRenderer.invoke("clientEventInvoke", data);
        } catch (error) {
            console.log(error);
        }

        return notes;
    }

    cb_removeCombo () {
        this.cb_hideContextMenu(null, true);

        const sendData = {
            page: this.#currentPage,
            game: this.#contextSelect.game,
            combo: this.#contextSelect.combo
        };

        this.cb_emitButtonEvent(this.idMap.get("c1l3"), "hideCombo", sendData);
    }

    cb_restoreAllCombos () {
        this.cb_hideContextMenu(null, true);

        const sendData = {
            page: this.#currentPage
        };

        this.cb_emitButtonEvent(this.idMap.get("c1l4"), "restoreCombos", sendData);
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

    cb_validateTargetChar (newChar) {
        return Number.isInteger(newChar) && newChar >= 0 && newChar < this.#charUpperLimit;
    }

    cb_validateTargetColor (newColor, currentChar) {
        return Number.isInteger(newColor) && newColor <= Utility.getMaxCostumesByCharacter(currentChar);
    }

    validateAllWidgetsForBigButton () {
        const flavor = parseInt(this.getElementById("i2").value);

        const isTagValid = this.getElementById("i3") ? /^[A-Z]{1,10}#\d{1,3}$/.test(this.getElementById("i3").value) : false;
        const isDirInputValid = this.getElementById("i1").classList.contains("is-valid");
        const charValue = this.getElementById("i4b1") ? parseInt(this.getElementById("i4b1").value) : null;
        const isCharValid = this.getElementById("i4b1") ? charValue >= 0 && charValue < this.#charUpperLimit : false;
        const isColorValid = this.getElementById("i5b1") ? parseInt(this.getElementById("i5b1").value) <= Utility.getMaxCostumesByCharacter(charValue) : false;

        switch (flavor) {
            case 1: // TAG
                return isTagValid && isDirInputValid;
            case 2: // CHAR
                return isCharValid && isDirInputValid;
            case 3: // CHAR_COLOR
                return isCharValid && isColorValid && isDirInputValid;
            case 4: // CHAR_TAG
                return isTagValid && isCharValid && isDirInputValid;
            case 5: // CHAR_TAG_COLOR
                return isTagValid && isCharValid && isColorValid && isDirInputValid;
        }
    }

    getElementById (ID) {
        return document.getElementById(this.idMap.get(ID));
    }
}

module.exports = FindComboController;