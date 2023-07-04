// const Utility = require("../Utility");
const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");

class ProgressController extends EventEmitter {

    events = [
        "showSpinner",
        "hideSpinner",
        "updateSpinnerCount"
    ]

    constructor () {
        super();
        this.setUpListeners();
    }

    setUpListeners () {
        // Listeners from Model
        const that = this;
        ipcRenderer.on("parseDirectoryUpdateCount", (evt, args) => {
            that.emit("updateSpinnerCount", args);
        });
        ipcRenderer.on("findCombosUpdateCount", (evt, args) => {
            that.emit("updateSpinnerCount", args);
        });
    }

    getEvents () {
        return this.events;
    }

    // Handle cancel here
    async cb_handleCancel(evt) {
        const data = {};
        data.sourceID = evt;
        data.eventName = "cancelComputation";
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (err) {
            console.log(err);
        }
    }

    showSpinner(args) {
        const eventData = {args};
        this.emit("showSpinner", eventData);
    }

    hideSpinner(args) {
        const eventData = {args};
        this.emit("hideSpinner", eventData);
    }
}

module.exports = ProgressController;