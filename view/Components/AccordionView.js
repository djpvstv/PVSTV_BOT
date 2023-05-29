const AccordionTypes = Object.freeze({
    PARSE:      0,
    COUNT:      1,
    FINDCOMBOS: 2
});

class AccordionView {

    #accordionDiv = null;

    constructor (type) {
        switch (type) {
            case AccordionTypes.PARSE:
                this.createParseAccordion();
                break;
        }
    }
}

module.exports = {AccordionView, AccordionTypes};