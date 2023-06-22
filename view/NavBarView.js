const ParsePanelView = require("./ParsePanelView");

class NavBarView {

    #navBarTitles = [`Parse Slippi`, `Count Moves`, `Find Combos`];
    #navPanels = [];
    #controller = null;

    // Every panel, only one shown at a time
    #parseViewPanel = null;
    #comboViewPanel = null;

    #idMap = new Map();

    #navBarListItemCount = 0;

    constructor( controller, spinnerController ) {
        this.#controller = controller;

        this.createPageSkeleton();

        this.createNavBar();
        this.createPanelForNavBar();

        this.#parseViewPanel = new ParsePanelView(controller, spinnerController, this.#navPanels[0]);

    }

    getParseViewPanel () {
        return this.#parseViewPanel;
    }

    createPageSkeleton () {
        document.body.classList.add("container-fluid","h-100");
        const topColumn = document.createElement("div");
        topColumn.classList.add("h-100","d-flex", "flex-column");
        document.body.appendChild(topColumn);

        // Create Two main rows, one for the navbar and one for everything else
        const navDiv = document.createElement("div");
        const paneDiv = document.createElement("div");

        navDiv.classList.add("row");
        paneDiv.classList.add("row","flex-grow-1");

        topColumn.appendChild(navDiv);
        topColumn.appendChild(paneDiv);

        navDiv.innerHTML = `
        <div class="col-12">
            <div id="navbar_skeleton"></div>
        </div>
        `;

        paneDiv.innerHTML = `
        <div class="h-100" id="navpanel_skeleton">
        </div>
        `;
    }
    

    createNavBar() {
        const navBar = document.createElement("ul");
        navBar.classList.add("nav", "nav-tabs", "nav-justified","mb-3", "nav-item-owner");

        let bSelected = true;

        this.#navBarTitles.forEach(title => {
            const listItem = this.createNavBarListItem(bSelected, title);
            navBar.appendChild(listItem);
            bSelected = false;
            this.#navBarListItemCount++;
        });
        
        const skeletonDiv = document.getElementById("navbar_skeleton");
        skeletonDiv.appendChild(navBar);

        skeletonDiv.addEventListener("click", (args) => {
            this.#controller.cb_navbarSkeletonOnClick(args);
        });
    }

    createNavBarListItem(bSelected, sTitle) {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        listItem.setAttribute("role", "presentation");

        const link = document.createElement("a");
        link.classList.add("nav-link");
        if (bSelected) {
            link.classList.add("active");
        }
        link.setAttribute("data-mdb-toggle", "tab");
        link.id = `nav_tab${this.#navBarListItemCount}`;
        link.setAttribute("href",`#tab_content_tab${this.#navBarListItemCount}`);
        link.setAttribute("role", "tab");
        link.setAttribute("aria-controls", `tab_content_tab${this.#navBarListItemCount}`);
        link.setAttribute("aria-selected",`${bSelected}`);
        link.innerText = sTitle;
        listItem.appendChild(link);
        return listItem;
    }

    createPanelForNavBar () {
        const navPanel = document.getElementById("navpanel_skeleton");

        navPanel.innerHTML = `
        <div class="tab-content h-100">
            <div class="panel-owner h-100" old-class="container-fluid"> 
            </div>
        </div>
        `;

        const panelOwner = navPanel.querySelector("div > .panel-owner");

        this.#navBarListItemCount = 0;
        let bSelected = true;
        this.#navBarTitles.forEach( () => {
            const paneDiv = document.createElement("div");
            paneDiv.classList.add("tab-pane", "fade");
            if (bSelected) {
                paneDiv.classList.add("active", "show", "h-100");
            }
            paneDiv.classList.add("d-flex", "flex-column");
            paneDiv.id = `tab_content_tab${this.#navBarListItemCount}`;
            paneDiv.setAttribute("role", "tabpanel");
            paneDiv.setAttribute("aria-labelledby", `nav_tab${this.#navBarListItemCount}`);

            panelOwner.appendChild(paneDiv);
            this.#navPanels.push(paneDiv);

            bSelected = false;
            this.#navBarListItemCount++;
        });
    }

}

module.exports = NavBarView;