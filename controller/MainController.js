const NavBarController = require("./NavBarController");

class MainController {

    #NavBarController = null;
    #ControllerList = [];

    constructor () {
        this.#NavBarController = new NavBarController();
        this.#ControllerList.push(this.#NavBarController);
    }

    // Getters
    getNavBarController() {
        return this.#NavBarController;
    }

    getControllers() {
        return this.#ControllerList;
    }

}

module.exports = MainController;