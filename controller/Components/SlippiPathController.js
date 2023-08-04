const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");

class SlippiPathController extends EventEmitter {

    events = [
        "showSpinner",
        "hideSpinner",
        "newSlippiPath"
    ]

    constructor () {
        super();
        this.setUpListeners();
    }

    setUpListeners () {
        // Listeners from Model
        const that = this;
        ipcRenderer.on("receiveSlippiPath", (evt, args) => {
            this.emit("newSlippiPath", {
                success: args.args.success,
                path: args.args.path,
                src: "pathModal"
            });
        });
    }

    getEvents () {
        return this.events;
    }

    cb_emitChooseButtonEvent (flavor) {
        const data = {};
        data.eventName = "findSlippiModal";
        data.val = {
            flavor: flavor,
            source: "pathModal"
        };
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (err) {
            console.log(err);
        }
    }

    cb_emitAcceptButtonEvent (flavor, success, path) {
        const data = {
            eventName: "updateSlippiPathFromClient",
            val: {
                flavor: flavor,
                success: success,
                path: path
            }
        };
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (err) {
            console.log(err);
        }
    }

    showModal(args) {
        const eventData = {args};
        this.emit("showSpinner", eventData);
    }

    hideModal(args) {
        const eventData = {args};
        this.emit("hideSpinner", eventData);
    }
}

module.exports = SlippiPathController;