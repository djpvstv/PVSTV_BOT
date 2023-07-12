const NavBarController = require("./NavBarController");
const ProgressController = require('./Components/ProgressController');
const SlippiPathController = require('./Components/SlippiPathController');

class MainController {

    #NavBarController = null;
    #ProgressController = null;
    #SlippiPathController = null;
    #ControllerList = [];

    constructor () {
        this.#NavBarController = new NavBarController();
        this.#ProgressController = new ProgressController();
        this.#SlippiPathController = new SlippiPathController();

        this.#ControllerList.push(this.#NavBarController);
        this.#ControllerList.push(this.#ProgressController);
        this.#ControllerList.push(this.#SlippiPathController);
        this.#ControllerList.push(this.#NavBarController.getFindComboController());
    }

    // Getters
    getNavBarController() {
        return this.#NavBarController;
    }

    getProgressController() {
        return this.#ProgressController;
    }

    getControllers() {
        return this.#ControllerList;
    }

    getSlippiPathController() {
        return this.#SlippiPathController;
    }

}

module.exports = MainController;