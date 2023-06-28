const {EventEmitter} = require("events");

class AccordionController extends EventEmitter {

    events = [
        "updateaccordion"
    ]

    constructor () {
        super();
        this.setUpListeners();
    }

    setUpListeners () {
    }
}

module.exports = AccordionController;