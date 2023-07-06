const FindComboController = require("./FindComboController");

const Utility = require("../Utility");
const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");



class NavBarController extends EventEmitter {

    #timeout = 250;
    #timeoutStr = '';
    events = [
        "hideSpinner",
        "updatePanelOneAccordion",
        "updatePanelOneDirectoryInput",
        "updatePanelOneFilesTable",
        "updatePanelOneAccordionJustAccordion",
        "updatePanelThreeDirectoryInput",
        "updatePanelThreeComboButton"
    ]

    #FindComboController = null;

    constructor () {
        super();
        this.#timeoutStr = `${this.#timeout/1000}s`;
        this.#FindComboController = new FindComboController();
        this.setUpListeners();
    }

    getFindComboController () {
        return this.#FindComboController;
    }

    setUpListeners () {
        const that = this;
        ipcRenderer.on("serverEvent", (evt, args) => {
            // Handle returns
            let response = args.args;
            switch (args.eventName) {
                case "parseDirectoryComplete":
                    response = {...response, ...args};
                    this.emit("updatePanelOneAccordion", response);
                    break;
                case "updatePanelOneAccordionJustAccordion":
                    response = {...response, ...args};
                    this.emit("updatePanelOneAccordionJustAccordion", response);
                    break;
                case "parseDirectoryForSlippiFiles":
                    switch (args.srcID) {
                        case "parseSlippi_input":
                        case "parseSlippi_choose_button":
                            this.cb_receiveParsedDirectoryFromSlippi(response.valid, response.files, response.srcID, response.dir, 0, response.errMsg);
                            break;
                        case "comboSlippi_input":
                        case "comboSlippi_choose_button":
                            this.cb_receiveParsedDirectoryFromSlippi(response.valid, response.files, response.srcID, response.dir, 2, response.errMsg);
                            break;
                    }
                    break;
            }
        });
    }

    getEvents () {
        return this.events;
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

    // Methods for reacting to model

    cb_receiveParsedDirectoryFromSlippi (bIsValid, files, sourceID, dir, panelID, errorMsg) {

        const eventData = {};
        eventData.isValid = bIsValid;
        eventData.dir = dir;
        eventData.errorMsg = errorMsg;
        let inputDirEventName, successEventName;
        switch (panelID) {
            case 0:
                inputDirEventName = "updatePanelOneDirectoryInput";
                successEventName = "updatePanelOneFilesTable";
                break;
            case 2:
                inputDirEventName = "updatePanelThreeDirectoryInput";
                successEventName = "updatePanelThreeComboButton";
                break;
        }
        this.emit(inputDirEventName, eventData);

        if (bIsValid) {
            eventData.sourceID = sourceID;
            eventData.files = files;
            this.emit(successEventName, eventData);
        }
    }

}

module.exports = NavBarController;