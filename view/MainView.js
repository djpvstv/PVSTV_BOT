const NavBarView = require("./NavBarView");
const {EventEmitter} = require("events");
const {ProgressView} = require("./Components/ProgressView");

class MainView extends EventEmitter {

    #NavBar = null;
    #Spinner = null;
    #controllers = null;

    constructor( controllers, appState ) {
        super();
        this.#controllers = controllers;
        this.createNavBar( controllers.getNavBarController(), controllers.getProgressController(), appState);
        this.createSpinner( controllers.getProgressController(), appState );
        this.createEventListeners();
    }

    createNavBar (controller, progressController, appState ) {
        this.#NavBar = new NavBarView( controller, progressController, appState );
    }

    createSpinner( controller, appState ) {
        this.#Spinner = new ProgressView( controller, appState );
    }

    createEventListeners() {
        const controllers = this.#controllers.getControllers();
        const that = this;
        controllers.forEach( controller => {
            const events = controller.getEvents();
            events.forEach(eventName => {
                switch (eventName) {
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
                }
            });
        });
    };
}

module.exports = MainView;