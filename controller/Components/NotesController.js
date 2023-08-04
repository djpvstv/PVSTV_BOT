const {ipcRenderer} = require("electron");
const {EventEmitter} = require("events");

class NotesController extends EventEmitter {

    events = [
        "showNotesModal",
        "hideNotesModal"
    ]

    constructor () {
        super();
    }

    getEvents () {
        return this.events;
    }

    unsanitizeNotes (notes) {
        const map = {
            '&amp;' : '&',
            '&lt;'  : '<',
            '&gt;'  : '>',
            '&quot;': '"',
            '&#x27;': "'",
            '&#x2F;': "/",
            '&#x96;': "`"
        };

        return notes.replace(/(&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;|&#x96;)/ig, (n)=>(map[n]));
    }

    showSpinner(args) {
        const eventData = {args};
        this.emit("showNotesModal", eventData);
    }

    hideSpinner(args) {
        const eventData = {args};
        this.emit("hideNotesModal", eventData);
    }

    cb_applyNotes (notes, comboNum) {
        const data = {};
        data.eventName = "saveComboNotes";
        data.val = {
            notes: notes,
            comboNum, comboNum
        };
        try {
            ipcRenderer.send("clientEvent", data);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = NotesController;