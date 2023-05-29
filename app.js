const MainView = require("./view/MainView");
const MainController = require("./controller/MainController");

const controller = new MainController();
const view = new MainView(controller);
