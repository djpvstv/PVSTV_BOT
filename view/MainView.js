const NavBarView = require("./NavBarView");
const {EventEmitter} = require("events");
const ProgressView = require("./Components/ProgressView");
const {FindSlippiModal} = require("./Components/FindSlippiModal");
const {ComboFilterModal} = require("./Components/ComboFilterModal");
const SettingsModal = require("./Components/SettingsModal");

class MainView extends EventEmitter {

    #appState = null;
    #NavBar = null;
    #Spinner = null;
    #SlippiPathSpinner = null;
    #ComboFilterModal = null;
    #SettingsModal = null;
    #controllers = null;

    constructor( controllers, appState ) {
        super();
        this.#appState = appState;
        this.#controllers = controllers;
        this.createNavBar( controllers.getNavBarController(), controllers.getProgressController(), controllers.getSettingsController(), appState);
        this.createSpinners( controllers, appState );
        this.createEventListeners();

        controllers.getNavBarController().emitStartupEvent();
    }

    createNavBar (controller, progressController, settingsController, appState ) {
        this.#NavBar = new NavBarView( controller, progressController, settingsController, appState );
    }

    createSpinners( controller, appState ) {
        this.#Spinner = new ProgressView( controller.getProgressController(), appState );
        this.#SlippiPathSpinner = new FindSlippiModal( controller.getSlippiPathController(), appState );
        this.#ComboFilterModal = new ComboFilterModal( controller.getComboFilterController(), appState );
        this.#SettingsModal = new SettingsModal (controller.getSettingsController(), appState );
    }

    createEventListeners() {
        const controllers = this.#controllers.getControllers();
        const that = this;
        controllers.forEach( controller => {
            const events = controller.getEvents();
            events.forEach(eventName => {
                switch (eventName) {
                    case "updateAppData":
                        controller.on(eventName, (event) => {
                            this.#appState.setIsoPath(event.args.meleePath);
                            this.#appState.setSlippiPath(event.args.slippiPath);
                            this.#appState.setHitsPerPage(event.args.paginationLowerLimit);
                            this.#appState.setFrameLeniency(event.args.frameLeniency);
                            this.#appState.setBatchSize(event.args.batchSize);
                        });
                        break;
                    case "updatePanelOneDirectoryInput":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getParseViewPanel().updateValidationStateForInputOne(event.isValid, event.dir, true, event.errorMsg);
                        });
                        break;
                    case "updatePanelOneFilesTable":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getParseViewPanel().updateFilesTable(event.files);
                        });
                        break;
                    case "updatePanelOneAccordion":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getParseViewPanel().updatePanelAccordion(event);
                            this.#NavBar.getParseViewPanel().updateDatesTable(event);
                        });
                        break;
                    case "updatePanelOneAccordionJustAccordion":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getParseViewPanel().updatePanelAccordion(event);
                        });
                        break;
                    case "updatePanelThreeDirectoryInput":
                        controller.on(eventName, (event) => {
                            const comboPanel = this.#NavBar.getComboViewPanel()
                            comboPanel.updateValidationStateForInputOne(event.isValid, event.dir, false, event.errorMsg);
                            comboPanel.getController().validateAllWidgetsForBigButton(comboPanel.getFlavor());
                        })
                        break;
                    case "updatePanelThreeComboButton":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getComboViewPanel().setFileNum(event.files.length);
                        });
                        break;
                    case "updatePanelThreeAccordion":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getComboViewPanel().getPanelAccordion().render(event);
                        });
                        break;
                    case "updatecombotarget":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getComboViewPanel().updateTargetType(event.flavor);
                        });
                        break;
                    case "showSpinner":
                        controller.on(eventName, (event) => {
                            this.#Spinner.show(event.args);
                        });
                        break;
                    case "hideSpinner":
                        controller.on(eventName, (event) => {
                            this.#Spinner.hide(event);
                        });
                        break;
                    case "updateSpinnerCount":
                        controller.on(eventName, (event) => {
                            this.#Spinner.updateCount(event);
                        });
                        break;
                    case "showFilterModal":
                        controller.on(eventName, (event) => {
                            this.#ComboFilterModal.show(event.args);
                        });
                        break;
                    case "hideFilterModal":
                        controller.on(eventName, (event) => {
                            this.#ComboFilterModal.hide(event);
                        });
                        break;
                    case "changeModalInput":
                        controller.on(eventName, (event) => {
                            this.#ComboFilterModal.changeModalInput(event);
                        });
                        break;
                    case "validateModalInput":
                        controller.on(eventName, (event) => {
                            this.#ComboFilterModal.applyValidationOnModalInput(event);
                        });
                        break;
                    case "showSettingsModal":
                        controller.on(eventName, (event) => {
                            this.#SettingsModal.show(event.args);
                        });
                        break;
                    case "hideSettingsModal":
                        controller.on(eventName, (event) => {
                            this.#SettingsModal.show(event.args);
                        });
                        break;
                    case "askForSlippiPath":
                        controller.on(eventName, (event) => {
                            this.#SlippiPathSpinner.show(event);
                        })
                        break;
                    case "newSlippiPath":
                        controller.on(eventName, (event) => {
                            if (event.src === "settingsModal") {
                                this.#SettingsModal.newPath(event);
                            } else {
                                this.#SlippiPathSpinner.newPath(event);
                            }
                        });
                        break;
                    case "askForMeleeIsoPath":
                        controller.on(eventName, (event) => {
                            this.#SlippiPathSpinner.show(event);
                        });
                        break;
                }
            });
        });
    };
}

module.exports = MainView;