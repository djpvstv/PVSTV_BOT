const NavBarController = require("./NavBarController");
const ProgressController = require('./Components/ProgressController');

class MainController {

    #NavBarController = null;
    #ProgressController = null;
    #ControllerList = [];

    constructor () {
        this.#NavBarController = new NavBarController();
        this.#ProgressController = new ProgressController();

        this.#ControllerList.push(this.#NavBarController);
        this.#ControllerList.push(this.#ProgressController);
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

}

module.exports = MainController;