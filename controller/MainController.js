const NavBarController = require("./NavBarController");
const ProgressController = require('./Components/ProgressController');
const SlippiPathController = require('./Components/SlippiPathController');
const ComboFilterController = require("./Components/ComboFilterController");

class MainController {

    #NavBarController = null;
    #ProgressController = null;
    #SlippiPathController = null;
    #ComboFilterController = null;
    #ControllerList = [];

    constructor () {
        this.#NavBarController = new NavBarController();
        this.#ProgressController = new ProgressController();
        this.#SlippiPathController = new SlippiPathController();
        this.#ComboFilterController = new ComboFilterController();

        this.#ControllerList.push(this.#NavBarController);
        this.#ControllerList.push(this.#ProgressController);
        this.#ControllerList.push(this.#SlippiPathController);
        this.#ControllerList.push(this.#NavBarController.getFindComboController());
        this.#ControllerList.push(this.#ComboFilterController);
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

    getComboFilterController () {
        return this.#ComboFilterController;
    }

}

module.exports = MainController;