const ParseViewBase = require('./PanelViewBase');
const {TableView, TableTypes} = require('./Components/TableView');

class ParsePanelView extends ParseViewBase {

    #fileTable = null;
    #dateTable = null;

constructor (controller, panelDiv) {
    super(controller, panelDiv);
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

    panelDiv.appendChild(inputRow);
    panelDiv.appendChild(labelRow);
    panelDiv.appendChild(dataRow);

    // Create input for directory, save ids
    this.idMap.set("p1b1", "parseSlippi_choose_button");
    this.idMap.set("p1i1", "parseSlippi_input");
    this.idMap.set("p1b2", "parseSlippi_parse_button");
    this.idMap.set("p1a1", "parseSlippi_players_outmostAccordion");

    const formDiv = this.createImportFromDirectory(this.idMap.get("p1b1"), this.idMap.get("p1i1"), this.idMap.get("p1b2"));

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

    // Create Accordion and Tables for Data Sectio
    const dataDiv = this.createDataSection();
    dataRow.appendChild(dataDiv);

    this.attachCallbacks();
    }

    createDataSection () {
        const dataDiv = document.createElement("div");
        dataDiv.classList.add("col-12");
        this.idMap.set("p1a1", "parseSlippi_players_outmostAccordion");
        this.idMap.set("p1t1", "parseSlippi_files_table");
        this.idMap.set("p1t2", "parseSlippi_times_table");

        dataDiv.innerHTML = `
        <div class="row h-100">
            <div class="col-6 position-relative">
                <div class="row h-100">
                    <div class="menu accordion-overflow">
                        <div class="accordion" id="${this.idMap.get("p1a1")}">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex flex-column h-100">
                    <div class="row flex-grow-1 position-relative mb-2">
                        <div id="${this.idMap.get("p1t1")}" class="table-overflow">
                        </div>
                    </div>
                    <div class="row">
                        <div id="${this.idMap.get("p1t2")}">
                        </div>
                    </div>
                </div>
            </div>
        `;

        const accordDiv = this.createAccordionForPlayers();
        dataDiv.querySelector(`#${this.idMap.get("p1a1")}`).appendChild(accordDiv);

        this.#fileTable = new TableView(TableTypes.FILE);
        dataDiv.querySelector(`#${this.idMap.get("p1t1")}`).appendChild(this.#fileTable.getTableDiv());

        this.#dateTable = new TableView(TableTypes.TIME);
        dataDiv.querySelector(`#${this.idMap.get("p1t2")}`).appendChild(this.#dateTable.getTableDiv());

        return dataDiv;
    }

    createAccordionForPlayers () {
        const accordDiv = document.createElement("accordion");
        return accordDiv;
    }

    attachCallbacks () {
        this.getElementById("p1b1").addEventListener("click", () => {
            this.controller.cb_emitButtonEvent(this.idMap.get("p1b1"), "parseDirectoryForSlippiFiles");
        });

        this.getElementById("p1b2").addEventListener("click", () => {
            this.controller.cb_emitButtonEvent(this.idMap.get("p1b2"), "parseDirectory");
        });
    }

    // Check to see if the folder path is OK
    cb_updateValidationForInputOne (isValid, dir) {

        const inputDiv = this.getElementById("p1i1");
        const parseDiv = this.getElementById("p1b2");

        if (dir) {
            inputDiv.setAttribute("value", dir);
        }

        if (!isValid) {
            inputDiv.classList.remove("is-valid");
            parseDiv.setAttribute("disabled","");

            if (typeof dir === 'undefined') {
                inputDiv.classList.remove("is-invalid");
                inputDiv.setAttribute("value","");
                // Early return - closed or cancelled UI
                return;
            }
            
            inputDiv.classList.add("is-invalid");
            
            // Early return - Invalid directory
            return;
        }

        parseDiv.removeAttribute("disabled");
        inputDiv.classList.remove("is-invalid");
        inputDiv.classList.add("is-valid");
    }

    cb_updateFilesTable (files) {
        this.#fileTable.updateFilesTable(files);
    }

    cb_updateFoundPlayersAccordion (event) {
        const parentAccordionID = this.idMap.get("p1a1")
        const accordDiv = this.getElementById("p1a1");
        let skeletonInternal = ``;
        let i = 0;
        event.players.forEach((player) => {
            const playerTag = Object.keys(player)[0];
            const allCharList = player[playerTag].char_id;
            const characterList = allCharList.filter(this.onlyUnique);

            const allNameList = player[playerTag].disp_name;
            const nameList = allNameList.filter(this.onlyUnique);

            let displayNames = ``;
            nameList.forEach((name) => {
                const thisNameCount = allNameList.filter(n => n === name).length;
                displayNames = `${displayNames}<br>${name} (${thisNameCount})`;
            });

            let characterIcons = ``;
            characterList.forEach((character) => {
                const thisCharCount = allCharList.filter(c => c == character).length;
                characterIcons = `${characterIcons}
                <div>
                    <img src="img/si_${character}.png" width="24" height="24"> (${thisCharCount})
                </div>`;
            });

            skeletonInternal = `
            ${skeletonInternal}
            <div class="accordion-item">
                <h2 class="accordion-header" id="player_${playerTag}_heading">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#player_${playerTag}_collapse" aria-expanded="false" aria-controls="player_${playerTag}_collapse">
                        ${playerTag}
                    </button>
                </h2>
                <div id="player_${playerTag}_collapse" class="accordion-collapse collapse" aria-labelledby="player_${playerTag}_heading" data-bs-parent="#${parentAccordionID}">
                    <div class="accordion-body">
                        <div class="accordion" id="player_${playerTag}_character_display_accordion">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="player_${playerTag}_characters">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#player_${playerTag}_character_list" aria-expanded="false" aria-controls="player_${playerTag}_character_list">
                                        Characters Played
                                    </button>
                                </h2>
                                <div id="player_${playerTag}_character_list" class="accordion-collapse collapse" aria-labelledby="player_${playerTag}_characters" data-bs-parent="player_${playerTag}_character_display_accordion">
                                    <div class="accordion-body">
                                        ${characterIcons}
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                        Display Names Used
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo" data-bs-parent="player_${playerTag}_character_display_accordion">
                                    <div class="accordion-body">
                                        ${displayNames.substring(4)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           `; 
        }, this);


        accordDiv.innerHTML = skeletonInternal;
    }

}

module.exports = ParsePanelView;