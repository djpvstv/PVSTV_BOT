const MainView = require("./view/MainView");
const MainController = require("./controller/MainController");
const AppState = require("./appState");

const appState = new AppState();

const controller = new MainController(appState);
const view = new MainView(controller, appState);