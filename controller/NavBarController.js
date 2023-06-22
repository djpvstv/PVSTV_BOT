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
        "updatePanelOneFilesTable"
    ]

    constructor () {
        super();
        this.#timeoutStr = `${this.#timeout/1000}s`;
        this.setUpListeners();
    }

    setUpListeners () {
        const that = this;
        ipcRenderer.on("serverEvent", (evt, args) => {
            // Handle returns
            const response = args.args;
            if (args.eventName === "parseDirectoryComplete") {
                const parsedData = JSON.parse(response.replaceAll('\\', '/'));
                this.emit("updatePanelOneAccordion", parsedData);
                this.emit("hideSpinner");
            } else if (args.eventName === "parseDirectoryForSlippiFiles") {
                this.cb_receiveParsedDirectoryFromSlippi(response.valid, response.files, response.srcID, response.dir);
            }
        });
    }

    getEvents () {
        return this.events;
    }

    async cb_navbarSkeletonOnClick (args)  {
        const targetNav = args.target;
        const panelOwner = document.getElementById("navpanel_skeleton").querySelector(".panel-owner");
        const targetID = targetNav.getAttribute("aria-controls");
        const targetDiv = document.getElementById(targetID);
        const firstDiv = panelOwner.children[0];

        const activeNav = targetNav.parentElement.parentElement.querySelector(".active");
        activeNav.classList.remove("active");
        activeNav.setAttribute("aria-selected", "false");

        targetNav.classList.add("active");
        targetNav.setAttribute("aria-selected","true");

        if (firstDiv.id !== targetDiv.id) {
            firstDiv.classList.remove("active", "show", "h-100");
            // firstDiv.classList.add("h-0");

            firstDiv.style.transition = this.#timeoutStr;
            firstDiv.style.opacity = '0';
            firstDiv.style.visibility = 'hidden';

            await Utility.waitTimeout(this.#timeout);

            panelOwner.insertBefore(targetDiv, firstDiv);
            
            firstDiv.removeAttribute("style");
            targetDiv.classList.add("active", "show", "h-100");
            // targetDiv.classList.remove("h-0");
            
            targetDiv.style.transition = this.timeoutStr;
            targetDiv.style.opacity = '0';

            await Utility.waitTimeout(this.#timeout);
            targetDiv.style.opacity = '1';

            await Utility.waitTimeout(this.#timeout);

            targetDiv.removeAttribute("style");
        }
    }

    async cb_emitButtonEvent (sourceID, eventName) {
        const data = {};
        data.sourceID = sourceID;
        data.eventName = eventName;
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (error) {
            console.log(error);
        }
    }

    // Methods for reacting to model

    cb_receiveParsedDirectoryFromSlippi (bIsValid, files, sourceID, dir) {

        const eventData = {};
        eventData.isValid = bIsValid;
        eventData.dir = dir;
        this.emit("updatePanelOneDirectoryInput", eventData);

        if (bIsValid) {
            eventData.sourceID = sourceID;
            eventData.files = files;
            this.emit("updatePanelOneFilesTable", eventData);
        }
    }

}

module.exports = NavBarController;