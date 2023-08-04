const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");

class SettingsController extends EventEmitter {

    events = [
        "showSettingsModal",
        "hideSettingsModal",
        "updateAppData",
        "newSlippiPath"
    ]

    constructor () {
        super();
        this.setUpListeners();
    }

    setUpListeners () {
        // Listeners from Model
        const that = this;
        ipcRenderer.on("updateAppData", (evt, args) => {
            that.emit("updateAppData", args);
        });
        ipcRenderer.on("receiveSlippiPathForSettings", (evt, args) => {
            that.emit("newSlippiPath", {
                success: args.args.success,
                path: args.args.path,
                src: "settingsModal"
            });
        });
    }

    cb_emitChooseButtonEvent (isSlippiPath) {
        const data = {};
        data.eventName = "findSlippiModal";
        data.val = {
            flavor: isSlippiPath,
            source: "settings"
        };
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (err) {
            console.log(err);
        }
    }

    cb_updateServerPaths (slippiLocation, meleeIso) {
        const data = {
            eventName: "updatePathsFromClient",
            val: {
                slippiPath: slippiLocation,
                isoPath: meleeIso
            }
        };
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (err) {
            console.log(err);
        }
    }

    cb_updateNonPathSettings (settings) {
        const data = {
            eventName: "updateNonPathsSettingsFromClient",
            val: settings
        };
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (err) {
            console.log(err);
        }
    }

    getEvents () {
        return this.events;
    }

    showSpinner(args) {
        const eventData = {args};
        this.emit("showSettingsModal", eventData);
    }

    hideSpinner(args) {
        const eventData = {args};
        this.emit("hideSettingsModal", eventData);
    }

}

module.exports = SettingsController;