const NavBarView = require("./NavBarView");
const {EventEmitter} = require("events");
const {ProgressView} = require("./Components/ProgressView");

class MainView extends EventEmitter {

    #NavBar = null;
    #Spinner = null;
    #controllers = null;

    constructor( controllers ) {
        super();
        this.#controllers = controllers;
        this.createNavBar( controllers.getNavBarController(), controllers.getProgressController() );
        this.createSpinner( controllers.getProgressController() );
        this.createEventListeners();
    }

    createNavBar (controller, progressController ) {
        this.#NavBar = new NavBarView( controller, progressController );
    }

    createSpinner( controller ) {
        this.#Spinner = new ProgressView( controller );
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
                            this.#NavBar.getParseViewPanel().cb_updateValidationForInputOne(event.isValid, event.dir);
                        });
                        break;
                    case "updatePanelOneFilesTable":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getParseViewPanel().cb_updateFilesTable(event.files);
                        });
                        break;
                    case "updatePanelOneAccordion":
                        controller.on(eventName, (event) => {
                            this.#NavBar.getParseViewPanel().getPanelAccordion().render(event);
                            this.#NavBar.getParseViewPanel().cb_updateDatesTable(event);
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