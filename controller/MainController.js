const path = require("path");

const NavBarController = require(path.join(__dirname, "NavBarController"));
const ProgressController = require(path.join(__dirname, "Components", "ProgressController"));
const SlippiPathController = require(path.join(__dirname, "Components", "SlippiPathController"));
const ComboFilterController = require(path.join(__dirname, "Components", "ComboFilterController"));
const SettingsController = require(path.join(__dirname, "Components", "SettingsController"));
const NotesController = require(path.join(__dirname, "Components", "NotesController"));
const MultiTagController = require(path.join(__dirname, "Components", "MultiTagController"));

class MainController {

    #NavBarController = null;
    #ProgressController = null;
    #SlippiPathController = null;
    #ComboFilterController = null;
    #SettingsController = null;
    #NotesController = null;
    #MultiTagController = null;
    #ControllerList = [];

    constructor () {
        this.#NavBarController = new NavBarController();
        this.#ProgressController = new ProgressController();
        this.#SlippiPathController = new SlippiPathController();
        this.#ComboFilterController = new ComboFilterController();
        this.#SettingsController = new SettingsController();
        this.#NotesController = new NotesController();
        this.#MultiTagController = new MultiTagController();

        this.#ControllerList.push(this.#NavBarController);
        this.#ControllerList.push(this.#ProgressController);
        this.#ControllerList.push(this.#SlippiPathController);
        this.#ControllerList.push(this.#NavBarController.getFindComboController());
        this.#ControllerList.push(this.#ComboFilterController);
        this.#ControllerList.push(this.#SettingsController);
        this.#ControllerList.push(this.#NotesController);
        this.#ControllerList.push(this.#MultiTagController);
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

    getSettingsController () {
        return this.#SettingsController;
    }

    getNotesController () {
        return this.#NotesController;
    }

    getMultiTagController () {
        return this.#MultiTagController;
    }

}

module.exports = MainController;