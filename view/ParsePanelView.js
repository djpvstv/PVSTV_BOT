const ParseViewBase = require('./PanelViewBase');
const { AccordionView, AccordionTypes } = require("./Components/AccordionView");
const {TableView, TableTypes} = require('./Components/TableView');

class ParsePanelView extends ParseViewBase {

    #appState = null;
    #fileTable = null;
    #dateTable = null;
    #foundPlayerAccordion = null;

    constructor (controller, spinnerController, settingsController, panelDivID, appState) {
        super(controller, spinnerController, settingsController);
        this.#appState = appState;
        // Add rows for 
        // 1. Input Directory
        // 2. Labels
        // 3. Accordion / tables
        const inputRow = document.createElement("div");
        const labelRow = document.createElement("div");
        const dataRow = document.createElement("div");

        inputRow.classList.add("row");
        labelRow.classList.add("row");
        dataRow.classList.add("row", "flex-grow-1");

        const panelDiv = document.getElementById(panelDivID);

        panelDiv.appendChild(inputRow);
        panelDiv.appendChild(labelRow);
        panelDiv.appendChild(dataRow);

        // Create input for directory, save ids
        this.idMap.set("p1b1", "parseSlippi_choose_button");
        this.idMap.set("p1i1", "parseSlippi_input");
        this.idMap.set("p1b2", "parseSlippi_parse_button");
        this.idMap.set("p1a1", "parseSlippi_players_outmostAccordion");
        this.idMap.set("sb1", "parseSlippi_settings_button");

        const formDiv = this.createImportFromDirectory(this.idMap.get("p1b1"), this.idMap.get("p1i1"), this.idMap.get("p1b2"), "Parse Directory", this.idMap.get("sb1"));

        inputRow.appendChild(formDiv);

        // Create Labels for Data section
        labelRow.innerHTML = `
        <div class="col-6 text-center">
            <h3>Found Players</h3>
        </div>
        <div class="col-6 text-center">
            <h3>Found Files</h3>
        </div>
        `;

        // Create Accordion and Tables for Data Section
        const dataDiv = this.createDataSection();
        dataRow.appendChild(dataDiv);

        this.attachCallbacks();
    }

    getFoundPlayerAccordion () {
        return this.#foundPlayerAccordion;
    }

    createDataSection () {
        const dataDiv = document.createElement("div");
        dataDiv.classList.add("col-12");
        this.idMap.set("p1a1", "parseSlippi_players_outmostAccordion");
        this.idMap.set("p1t1", "parseSlippi_files_table");
        this.idMap.set("p1t2", "parseSlippi_times_table");
        this.idMap.set("p1p1", "parseSlipp_pagination_div");

        dataDiv.innerHTML = `
        <div class="row h-100">
            <div class="col-6">
                <div class="d-flex flex-column h-100">
                    <div class="row flex-grow-1 position-relative">
                        <div class="menu accordion-overflow accordion" id="${this.idMap.get("p1a1")}">
                        </div>
                    </div>
                    <div id="${this.idMap.get("p1p1")}" class="row bottom-pagination">
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex flex-column h-100">
                    <div class="row flex-grow-1 position-relative">
                        <div id="${this.idMap.get("p1t1")}" class="table-overflow">
                            <time-table-view></time-table-view>
                        </div>
                    </div>
                    <div class="row">
                        <div id="${this.idMap.get("p1t2")}">
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.#foundPlayerAccordion = new AccordionView(AccordionTypes.PARSE, this.#appState, this.controller);
        const accordDiv = this.#foundPlayerAccordion.createAccordionForPlayers();
        dataDiv.querySelector(`#${this.idMap.get("p1a1")}`).appendChild(accordDiv);

        this.#fileTable = new TableView(TableTypes.FILE);
        dataDiv.querySelector(`#${this.idMap.get("p1t1")}`).appendChild(this.#fileTable.getTableDiv());

        this.#dateTable = new TableView(TableTypes.TIME);
        dataDiv.querySelector(`#${this.idMap.get("p1t2")}`).appendChild(this.#dateTable.getTableDiv());

        return dataDiv;
    }

    attachCallbacks () {
        this.getElementById("p1b1").addEventListener("click", async () => {
            await this.controller.cb_emitButtonEvent(this.idMap.get("p1b1"), "parseDirectoryForSlippiFilesByButton");
        });

        this.getElementById("p1i1").addEventListener("change", async () => {
            const fileName = this.getElementById("p1i1").value;
            await this.controller.cb_emitButtonEvent(this.idMap.get("p1i1"),"parseDirectoryForSlippiFilesByInput",fileName);
        });

        this.getElementById("p1b2").addEventListener("click", async () => {
            this.progressController.showSpinner({
                modalTitle: "Parsing Directory",
                totalFiles: this.fileList.length
            });
            let batchNum = this.#appState.getBatchSize();
            batchNum = Math.min(batchNum, this.fileList.length);
            await this.controller.cb_emitButtonEvent(this.idMap.get("p1b2"), "parseDirectory", batchNum);
        });

        this.getElementById("sb1").addEventListener("click", async () => {
            this.settingsController.showSpinner();
        });
    }

    async updatePanelAccordion (event) {
        await this.getPanelAccordion().render(event);
        this.controller.emit("hideSpinner");
    }

    updateFilesTable (files) {
        this.fileList = files;
        this.#fileTable.updateFilesTable(files);
    }

    getPanelAccordion () {
        return this.#foundPlayerAccordion;
    }

    updateDatesTable (event) {
        const dateData = {
            min: event.firstDate,
            max: event.lastDate
        }
        this.#dateTable.updateDatesTable(dateData);
    }

    getInputDivOne () {
        return this.getElementById("p1i1");
    }

    getButtonDivTwo () {
        return this.getElementById("p1b2");
    }

}

module.exports = ParsePanelView;