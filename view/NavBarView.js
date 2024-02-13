 const path = require("path");

const ParsePanelView = require(path.join(__dirname, "ParsePanelView"));
const ComboPanelView = require(path.join(__dirname, "FindComboView"));

class NavBarView {

    #navBarTitles = [`Parse Replays`, `Find Combos`, `Count Moves`];
    #navPanelIDs = [];
    #controller = null;

    // Every panel, only one shown at a time
    #parseViewPanel = null;
    #comboViewPanel = null;

    #idMap = new Map();

    #navBarListItemCount = 0;

    constructor( controller, spinnerController, settingsController, multiTagController, appState ) {
        this.#controller = controller;

        this.createPageSkeleton();

        this.#parseViewPanel = new ParsePanelView(controller, spinnerController, settingsController, multiTagController, this.#navPanelIDs[0], appState);
        this.#comboViewPanel = new ComboPanelView(controller, spinnerController, settingsController, multiTagController, this.#navPanelIDs[1], appState);

        document.getElementById('nav_Find_Combos').addEventListener("show.bs.tab", (evt) => {
            this.#comboViewPanel.updateTagSelectionAutofills();
        });

    }

    getParseViewPanel () {
        return this.#parseViewPanel;
    }

    getComboViewPanel () {
        return this.#comboViewPanel;
    }

    createPageSkeleton () {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add("wrapper");
        document.body.appendChild(wrapperDiv);
        const containerDiv = document.createElement('div');
        containerDiv.classList.add("container-fluid","h-100","top-gun");
        containerDiv.setAttribute("data-bs-theme", "dark");
        containerDiv.innerHTML = `
        <div class="h-100 d-flex flex-column">
            <div class="row">
                <div class="col-12">
                    <div id="navbar_skeleton">
                        <nav>
                            <div class="nav nav-tabs nav-justified mb-3 nav-item-owner" id="nav-tab" role="tablist">
                                ${this.createNavBarButtons()}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            <div class="row flex-grow-1">
                <div class="h-100" id="navpanel_skeleton">
                    <div class="tab-content h-100">
                        <div class="h-100">
                            ${this.createPanelsForNavBar()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        wrapperDiv.appendChild(containerDiv);
        const gridBackground = document.createElement('div');
        gridBackground.classList.add("top-lad");
        wrapperDiv.appendChild(gridBackground);

        this.createGridding(gridBackground);
    }

    createNavBarButtons () {
        let buttonHTML = ``;
        let isFirst = true;
        this.#navBarTitles.forEach(title => {
            const titleID = title.replaceAll(' ', '_');
            if (isFirst) {
            buttonHTML = `${buttonHTML}
                <button class="nav-link active" id="nav_${titleID}" data-bs-toggle="tab" data-bs-target="#panel_${titleID}" type="button" role="tab" aria-controls="panel_${titleID}" aria-selected="true">${title}</button>
            `;
            } else {
            buttonHTML = `${buttonHTML}
                <button ${titleID === "Count_Moves" ? 'disabled ' : ''}class="nav-link" id="nav_${titleID}" data-bs-toggle="tab" data-bs-target="#panel_${titleID}" type="button" role="tab" aria-controls="panel_${titleID}" aria-selected="false">${title}</button>
            `;
            }
            isFirst = false;
        });
        return buttonHTML;
    }

    createPanelsForNavBar () {
        let panelHTML = ``;
        this.#navBarListItemCount = 0;
        let isFirst = true;
        this.#navBarTitles.forEach((title) => {
            const titleID = title.replaceAll(' ', '_');
            if (isFirst) {
                panelHTML = `${panelHTML}
                <div class="tab-pane fade d-flex flex-column show active panel-height" id="panel_${titleID}" role="tabpanel" aria-labeledby="nav_${titleID}" tabindex="0">
                </div>
                `;
            } else {
                panelHTML = `${panelHTML}
                <div class="tab-pane fade d-flex flex-column panel-height" id="panel_${titleID}" role="tabpanel" aria-labeledby="nav_${titleID}" tabindex="0">
                </div>
                `;
            }
            this.#navPanelIDs.push("panel_" + titleID);

            isFirst = false;
            this.#navBarListItemCount++;
        });

        return panelHTML;
    }

    createGridding (wrapper) {
        const createTile = index => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            return tile;
        }

        const createTiles = quantity => {
            Array.from(Array(quantity)).map((tile, index) => {
                wrapper.appendChild(createTile(index));
            })
        }

        const createGrid = () => {
            wrapper.innerHTML = "";
            const columns = Math.floor(document.body.clientWidth / 50);
            const rows = Math.floor(document.body.clientHeight / 50);
            wrapper.style.setProperty("--columns", columns);
            wrapper.style.setProperty("--rows", rows);
            createTiles(columns * rows);
        }
        createGrid();
        window.addEventListener("resize", () => {
            createGrid();
        });
    }

}

module.exports = NavBarView;