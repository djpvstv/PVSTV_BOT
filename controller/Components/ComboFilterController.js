const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");
const Utility = require("../../Utility");

class ComboFilterController extends EventEmitter {

    events = [
        "showFilterModal",
        "hideFilterModal",
        "changeModalInput",
        "validateModalInput"
    ]

    constructor () {
        super();
        this.setUpListeners();
    }

    setUpListeners () {
        // Listeners from Model
        const that = this;
        ipcRenderer.on("showFilterModal", (evt, args) => {
            this.emit("showFilterModal", {
                success: args.args.success,
                path: args.args.path
            });
        });
    }

    getEvents () {
        return this.events;
    }

    cb_emitAcceptButtonEvent (success, rules) {
        if (success) {
            const data = {
                eventName: "updateComboFilterRules",
                sourceID: "slippiComboFilterApplyButton",
                val: rules
            };
            try {
                ipcRenderer.send("clientEvent", data);
            } catch (err) {
                console.log(err);
            }
        }
    }

    cb_handleRuleFlavorSelection (flavor) {
        switch (parseInt(flavor)) {
            // Has Move
            case 0:
                const moveIDs = Utility.getMoveIDsForChar(23);
                const moveNames = Utility.getMoveNamesForChar(23);
                this.emit("changeModalInput", {
                    flavor: flavor,
                    moveNames: moveNames,
                    moveIDs: moveIDs
                });
                break;
            // Has Action State
            case 1:
                const actionIDs = Utility.getActionIDsForChar(23);
                const actionNames = Utility.getActionNamesForChar(23);
                this.emit("changeModalInput", {
                    flavor: flavor,
                    actionNames: actionNames,
                    actionIDs: actionIDs
                });
                break;
            // Damage
            case 2:
            case 3:
                this.emit("changeModalInput", {
                    flavor: flavor
                });
                break;
        }

    }

    cb_handleInputValidation (target, listDiv, flavor) {
        const newVal = target.value;
        let isValid = false;
        let obj;
        
        switch (parseInt(flavor)) {
            case 0:
            case 1:
                obj = listDiv.querySelector(`option[value="${newVal}"]`);
                if (obj !== null) {
                    isValid = true;
                }
                break;
            case 2:
                break;
        }

        this.emit("validateModalInput", isValid);
    }

    showModal(args) {
        const eventData = {args};
        this.emit("showFilterModal", eventData);
    }

    hideModal(args) {
        const eventData = {args};
        this.emit("hideFilterModal", eventData);
    }
}

module.exports = ComboFilterController;