const ParsePanelView = require("./ParsePanelView");
const ComboPanelView = require("./FindComboView");

class NavBarView {

    #navBarTitles = [`Parse Slippi`, `Count Moves`, `Find Combos`];
    #navPanelIDs = [];
    #controller = null;

    // Every panel, only one shown at a time
    #parseViewPanel = null;
    #comboViewPanel = null;

    #idMap = new Map();

    #navBarListItemCount = 0;

    constructor( controller, spinnerController, appState ) {
        this.#controller = controller;

        this.createPageSkeleton();

        this.#parseViewPanel = new ParsePanelView(controller, spinnerController, this.#navPanelIDs[0], appState);
        this.#comboViewPanel = new ComboPanelView(controller, spinnerController, this.#navPanelIDs[2], appState);

    }

    getParseViewPanel () {
        return this.#parseViewPanel;
    }

    getComboViewPanel () {
        return this.#comboViewPanel;
    }

    createPageSkeleton () {
        document.body.classList.add("container-fluid","h-100");
        document.body.innerHTML = `
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
    }

    createNavBarButtons () {
        let buttonHTML = ``;
        let isFirst = true;
        this.#navBarTitles.forEach(title => {
            const titleID = title.replaceAll(' ', '_');
            if (isFirst) {
            buttonHTML = `${buttonHTML}
                <button class="nav-link active id="nav_${titleID}" data-bs-toggle="tab" data-bs-target="#panel_${titleID}" type="button" role="tab" aria-controls="panel_${titleID}" aria-selected="true">${title}</button>
            `;
            } else {
            buttonHTML = `${buttonHTML}
                <button class="nav-link" id="nav_${titleID}" data-bs-toggle="tab" data-bs-target="#panel_${titleID}" type="button" role="tab" aria-controls="panel_${titleID}" aria-selected="false">${title}</button>
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

}

module.exports = NavBarView;