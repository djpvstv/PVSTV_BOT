const NavBarView = require("./NavBarView");
const {EventEmitter} = require("events");

class MainView extends EventEmitter {

    #NavBar = null;
    #controllers = null;

    constructor( controllers ) {
        super();
        this.#controllers = controllers;
        this.createNavBar( controllers.getNavBarController() );
        this.createEventListeners();
    }

    createNavBar (controller) {
        const view = new NavBarView( controller );
        this.#NavBar = view;
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
                            this.#NavBar.getParseViewPanel().cb_updateFoundPlayersAccordion(event);
                        });
                        break;
                }
            });
        });
    };
}

module.exports = MainView;