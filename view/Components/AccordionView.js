const bootstrap = require('../../Bootstrap/js/bootstrap.bundle.min');
const utility = require('../../Utility');

const AccordionTypes = Object.freeze({
    PARSE:      0,
    COUNT:      1,
    FINDCOMBOS: 2
});

class AccordionView {

    #accordionDiv = null;
    #controller = null;
    #idList = null;
    #appState = null;
    #outerAccordionID = "";
    #paginationID = "";
    #type = null;
    #collapseIDMap = null;
    #collapseMap = null;
    #collapseList = null;
    #playAllID = "";
    #filterID = '';

    // I need a finite number of things that can be open in an accordion
    // This is a performance limitation
    MAX_COLLAPSE_SIZE = 99;

    constructor (type, appState, controller) {
        switch (type) {
            case AccordionTypes.PARSE:
                this.#outerAccordionID = "parseSlippi_players_outmostAccordion";
                this.#paginationID = "parseSlipp_pagination_div";
                break;
            case AccordionTypes.FINDCOMBOS:
                this.#outerAccordionID = "comboSlippi_combos_outmostAccordion";
                this.#paginationID = "comboSlippi_pagination_div";
                this.#playAllID = "comboSlippi_play_all_combos";
                this.#filterID = "comboSlippi_filter_combos";
                break;
        }
        this.#appState = appState;
        this.#controller = controller;
        this.#type = type;
        this.#idList = [];
        this.#collapseList = [];
        this.#collapseMap = new Map();
        this.#collapseIDMap = new Map();
    }

    getType () {
        return this.#type;
    }

    createAccordionForPlayers () {
        const accordDiv = document.createElement("accordion");
        this.#accordionDiv = accordDiv;
        return accordDiv;
    }

    createAccordionForCombos () {
        const accordDiv = document.createElement("accordion");
        this.#accordionDiv = accordDiv;
        return accordDiv;
    }

    destroyPreviousBootstrapCollapseObjects () {
        if (this.#idList.length > 0) {
            this.#collapseList.forEach((ID) => {
                const bsCollapse = this.#collapseMap.get(ID);
                if (bsCollapse) {
                    bsCollapse.dispose();
                }
            });
            this.#collapseIDMap.clear();
            this.#collapseMap.clear();
            this.#idList = [];
            this.#collapseList = [];
        }
    }

    createLimitedBootstrapObjects () {
        this.#idList.forEach((ID) => {
            document.getElementById(ID).addEventListener("click", async (evt) => {
                if (this.#controller.isContextShowing()) {
                    this.#controller.cb_hideContextMenu(evt);
                    evt.stopPropagation();
                    return;
                }
                const collapsedIDStruct = this.#collapseIDMap.get(ID);
                const collapseID = collapsedIDStruct.collapseID;

                const isMeatballsEvt = evt.srcElement.closest(".meatballs-div");
                if (isMeatballsEvt) {
                    evt.stopPropagation();
                    this.#controller.cb_handleRightClick(evt);
                    return;
                }

                let bsCollapse;
                if (this.#collapseMap.has(ID)) {
                    bsCollapse = this.#collapseMap.get(ID);
                    bsCollapse.toggle();
                } else {
                    bsCollapse  = await new bootstrap.Collapse(document.getElementById(collapseID));
                    this.#collapseMap.set(ID, bsCollapse);
                    this.#collapseList.push(ID);
                }

                const buttonDiv = document.getElementById(collapsedIDStruct.buttonID);
                if (buttonDiv.classList.contains("collapsed-icon")) {
                    buttonDiv.classList.remove("collapsed-icon");
                } else {
                    buttonDiv.classList.add("collapsed-icon");
                }

                if (this.#collapseMap.size > this.MAX_COLLAPSE_SIZE) {
                    const deleteID = this.#collapseList.shift();
                    bsCollapse = this.#collapseMap.get(deleteID);
                    this.#collapseMap.delete(deleteID);
                    bsCollapse.dispose();
                }
            });
        }, this);
    }

    async render (event) {
        switch(this.getType()) {
            case AccordionTypes.PARSE:
                await this.renderParsed(event);
                break;
            case AccordionTypes.FINDCOMBOS:
                await this.renderCombos(event);
                break;
        }
    }

    async renderParsed (event) {
        this.destroyPreviousBootstrapCollapseObjects();
        const bUsePagination = event.needsPagination;
        const parentAccordionID = this.#outerAccordionID;
        const accordDiv = document.getElementById(parentAccordionID);
        let skeletonInternal = ``;
        let i = 0;
        const foundTags = [];
        event.players.forEach((player) => {
            const playerTag = Object.keys(player)[0];
            const allCharList = player[playerTag].char_id;
            const characterList = allCharList.filter(this.onlyUnique);

            const allNameList = player[playerTag].disp_name;
            const nameList = allNameList.filter(this.onlyUnique);

            const cleanPlayerTag = playerTag.replaceAll('＃','_');

            if (/^[A-Z]{1,10}#\d{1,3}$/.test(playerTag.replaceAll('＃','#').toUpperCase())) {
                foundTags.push(playerTag.replaceAll('＃','#').toUpperCase());
            }

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

            const headingID = "player_" + cleanPlayerTag + "_heading";
            const headingButtonID = headingID + "_button";
            const collapseID = "player_" + cleanPlayerTag + "_collapse";
            const playerAccordID = "player_" + cleanPlayerTag + "_character_display_accordion";
            const charactersID = "player_" + cleanPlayerTag + "_characters";
            const charactersButtonID = charactersID + "_button";
            const charListID = "player_" + cleanPlayerTag + "_character_list";
            const namesID = "player_" + cleanPlayerTag + "_names";
            const namesButtonID = namesID + "_button";
            const nameListID = "player_" + cleanPlayerTag + "_names_list";

            this.#idList.push(headingID);
            this.#collapseIDMap.set(headingID, {
                collapseID: collapseID,
                buttonID: headingButtonID
            });
            this.#idList.push(charactersID);
            this.#collapseIDMap.set(charactersID, {
                collapseID: charListID,
                buttonID: charactersButtonID
            });
            this.#idList.push(namesID);
            this.#collapseIDMap.set(namesID, {
                collapseID: nameListID,
                buttonID: namesButtonID
            });

            skeletonInternal = `
                ${skeletonInternal}
                <div class="accordion-item outer-accordion-item">
                    <h2 class="accordion-header outer-accordion-header" id="${headingID}">
                        <button id="${headingButtonID}" class="accordion-button collapsed collapsed-icon">
                            ${playerTag}
                        </button>
                    </h2>
                    <div id="${collapseID}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <div class="accordion" id="${playerAccordID}">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="${charactersID}">
                                        <button id="${charactersButtonID}" class="accordion-button accordion-button-sub collapsed collapsed-icon">
                                            Characters Played
                                        </button>
                                    </h2>
                                    <div id="${charListID}" class="accordion-collapse collapse">
                                        <div class="accordion-body">
                                            ${characterIcons}
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="${namesID}">
                                        <button id="${namesButtonID}" class="accordion-button accordion-button-sub collapsed collapsed-icon">
                                            Display Names Used
                                        </button>
                                    </h2>
                                    <div id="${nameListID}" class="accordion-collapse collapse">
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

        if (bUsePagination) {
            const activePage = event.page;
            const totalPages = event.totalPage;
            this._createPaginationSection(activePage, totalPages, event.hitsThisPage, event.hitsTotal);
            this._attachPaginationCallbacks(activePage, totalPages);
        }

        if (Object.hasOwnProperty.call(event, "totalNames")) {
            this.#appState.setFoundTags(event.totalNames);
        }
        accordDiv.innerHTML = skeletonInternal;

        this.createLimitedBootstrapObjects();
    }

    _createPaginationSection (activePage, totalPages, hitsThisPage, hitsTotal) {
        const paginationID = this.#paginationID;
        const pagDiv = document.getElementById(paginationID);
        let navDiv = '';

        if (activePage > 0 && totalPages > 1) {
            let pageSkeletonInternal;
            if (totalPages === 2) {
                pageSkeletonInternal = `
                <nav>
                    <ul class="pagination justify-content-center">
                        <li id="${this.#paginationID + "_backwards"}" class="page-item${activePage === 1 ? ' disabled' : ''}">
                            <a class="page-link" href="#" tabindex="-1"${activePage === 1 ? ' aria-disabled="true"' : ''}>Previous</a>
                        </li>
                        <li id="${this.#paginationID + "_left"}" class="page-item${activePage === 1 ? ' disabled' : ''}"><a class="page-link" href="#">1</a></li>
                        <li id="${this.#paginationID + "_center"}" class="page-item${activePage === 2 ? ' disabled' : ''}"><a class="page-link" href="#">2</a></li>
                        <li id="${this.#paginationID + "_forwards"}" class="page-item${activePage === 2 ? ' disabled' : ''}">
                            <a class="page-link" href="#"${activePage === 3 ? ' aria-disabled="true"' : ''}>Next</a>
                        </li>
                    </ul>
                </nav>`;
            } else if (totalPages === 3) {
                pageSkeletonInternal = `
                <nav>
                    <ul class="pagination justify-content-center">
                        <li id="${this.#paginationID + "_backwards"}" class="page-item${activePage === 1 ? ' disabled' : ''}">
                            <a class="page-link" href="#" tabindex="-1"${activePage === 1 ? ' aria-disabled="true"' : ''}>Previous</a>
                        </li>
                        <li id="${this.#paginationID + "_left"}" class="page-item${activePage === 1 ? ' disabled' : ''}"><a class="page-link" href="#">1</a></li>
                        <li id="${this.#paginationID + "_center"}" class="page-item${activePage === 2 ? ' disabled' : ''}"><a class="page-link" href="#">2</a></li>
                        <li id="${this.#paginationID + "_right"}" class="page-item${activePage === 3 ? ' disabled' : ''}"><a class="page-link" href="#">3</a></li>
                        <li id="${this.#paginationID + "_forwards"}" class="page-item${activePage === 3 ? ' disabled' : ''}">
                            <a class="page-link" href="#"${activePage === 3 ? ' aria-disabled="true"' : ''}>Next</a>
                        </li>
                    </ul>
                </nav>`;
            } else {
                const leftDistance = activePage - 1;
                const rightDistance = totalPages - activePage;

                pageSkeletonInternal = `
                <nav>
                    <ul class="pagination justify-content-center">
                        <li id="${this.#paginationID + "_backwards"}" class="page-item${activePage === 1 ? ' disabled' : ''}">
                            <a class="page-link" href="#" tabindex="-1"${activePage === 1 ? ' aria-disabled="true"' : ''}>Previous</a>
                        </li>
                        ${leftDistance <= 1 ? `
                            <li id="${this.#paginationID + "_left"}"  class="page-item${activePage === 1 ? ' active' : ''}"><a class="page-link" href="#">1</a></li>
                            <li id="${this.#paginationID + "_center"}" class="page-item${activePage === 2 ? ' active' : ''}"><a class="page-link" href="#">2</a></li>
                            <li id="${this.#paginationID + "_right"}" class="page-item${activePage === 3 ? ' active' : ''}"><a class="page-link" href="#">3</a></li>
                            <li class="page-item disabled page-item-elipsis"><a class="page-link" href="#" aria-disaled="true">...</a></li>
                            <li id="${this.#paginationID + "_end"}" class="page-item"><a class="page-link" href="#">${String(totalPages)}</a></li>
                        ` : rightDistance <= 1 ? `
                            <li id="${this.#paginationID + "_start"}" class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item disabled page-item-elipsis"><a class="page-link" href="#" aria-disaled="true">...</a></li>
                            <li id="${this.#paginationID + "_left"}"  class="page-item${activePage === totalPages - 2 ? ' active' : ''}"><a class="page-link" href="#">${String(totalPages)-2}</a></li>
                            <li id="${this.#paginationID + "_center"}" class="page-item${activePage === totalPages - 1 ? ' active' : ''}"><a class="page-link" href="#">${String(totalPages)-1}</a></li>
                            <li id="${this.#paginationID + "_right"}" class="page-item${activePage === totalPages ? ' active' : ''}"><a class="page-link" href="#">${String(totalPages)}</a></li>
                        ` : `
                            <li id="${this.#paginationID + "_start"}" class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item disabled page-item-elipsis"><a class="page-link" href="#" aria-disaled="true">...</a></li>
                            <li id="${this.#paginationID + "_left"}"  class="page-item"><a class="page-link" href="#">${String(activePage-1)}</a></li>
                            <li id="${this.#paginationID + "_center"}" class="page-item active"><a class="page-link" href="#">${String(activePage)}</a></li>
                            <li id="${this.#paginationID + "_right"}" class="page-item"><a class="page-link" href="#">${String(activePage+1)}</a></li>
                            <li class="page-item disabled page-item-elipsis"><a class="page-link" href="#" aria-disaled="true">...</a></li>
                            <li id="${this.#paginationID + "_end"}"class="page-item"><a class="page-link" href="#">${String(totalPages)}</a></li>
                        `}
                        <li id="${this.#paginationID + "_forwards"}" class="page-item${activePage === totalPages ? ' disabled' : ''}">
                            <a class="page-link" href="#"${activePage === totalPages ? ' aria-disabled="true"' : ''}>Next</a>
                        </li>
                    </ul>
                </nav>`;

            }
            navDiv = pageSkeletonInternal;
        }
        let buttonDiv = '';
        if (this.#type === AccordionTypes.FINDCOMBOS) {
            buttonDiv = `
                <div class="d-gap justify-content-md-end">
                    <button id="${this.#filterID}" type="button" class="btn btn-filter">Filter</button>
                    <button id="${this.#playAllID}" type="button" class="btn btn-primary">Play All</button>
                </div>
            `;
        }

        pagDiv.innerHTML = `
            <div class="row">
                <div class="showing-x-of-y col-md-3">
                    Showing ${hitsThisPage} of (${hitsTotal})
                </div>
                <div class="col-md-6">
                    ${navDiv}
                </div>
                <div class="col-md-3">
                    ${buttonDiv}
                </div>
            </div>
        `;
    }

    _attachPaginationCallbacks(activePage, totalPages) {
        if (activePage > 0 && totalPages > 0) {
            document.getElementById(this.#paginationID + "_backwards").addEventListener("click", async (evt) => {
                if (!evt.srcElement.classList.contains('disabled')) {
                    await this.#controller.cb_emitButtonEvent(this.#paginationID + "_backwards", this.getUpdatePaginationEventName(), activePage - 1);
                }
            });

            document.getElementById(this.#paginationID + "_forwards").addEventListener("click", async (evt) => {
                if (!evt.srcElement.classList.contains('disabled')) {
                    await this.#controller.cb_emitButtonEvent(this.#paginationID + "_forwards", this.getUpdatePaginationEventName(), activePage + 1);
                }
            });

            document.getElementById(this.#paginationID + "_left").addEventListener("click", async (evt) => {
                if (!(evt.srcElement.classList.contains('disabled') || evt.srcElement.classList.contains("active"))) {
                    const labelVal = parseInt(evt.srcElement.innerHTML);
                    await this.#controller.cb_emitButtonEvent(this.#paginationID + "_forwards", this.getUpdatePaginationEventName(), labelVal);
                }
            })

            document.getElementById(this.#paginationID + "_center").addEventListener("click", async (evt) => {
                if (!(evt.srcElement.classList.contains('disabled') || evt.srcElement.classList.contains("active"))) {
                    const labelVal = parseInt(evt.srcElement.innerHTML);
                    await this.#controller.cb_emitButtonEvent(this.#paginationID + "_forwards", this.getUpdatePaginationEventName(), labelVal);
                }
            });

            // RIght one doesn't exist if we have two pages
            if (document.getElementById(this.#paginationID + "_right")) {
                document.getElementById(this.#paginationID + "_right").addEventListener("click", async (evt) => {
                    if (!(evt.srcElement.classList.contains('disabled') || evt.srcElement.classList.contains("active"))) {
                        const labelVal = parseInt(evt.srcElement.innerHTML);
                        await this.#controller.cb_emitButtonEvent(this.#paginationID + "_forwards", this.getUpdatePaginationEventName(), labelVal);
                    }
                });
            }

            const startEl = document.getElementById(this.#paginationID + "_start");
            const endEl = document.getElementById(this.#paginationID + "_end");
            if (startEl) {
                startEl.addEventListener("click", async (evt) => {
                    if (!evt.srcElement.classList.contains('disabled')) {
                        await this.#controller.cb_emitButtonEvent(this.#paginationID + "_start", this.getUpdatePaginationEventName(), 1);
                    }
                });
            }
            if (endEl) {
                endEl.addEventListener("click", async (evt) => {
                    if (!evt.srcElement.classList.contains('disabled')) {
                        await this.#controller.cb_emitButtonEvent(this.#paginationID + "_end", this.getUpdatePaginationEventName(), totalPages);
                    }
                });
            }
        }

        if (document.getElementById(this.#playAllID)) {
            document.getElementById(this.#playAllID).addEventListener("click", async (evt) => {
                await this.#controller.cb_emitButtonEvent(this.#playAllID, "playAllCombos");
            });
        }

        if (document.getElementById(this.#filterID)) {
            document.getElementById(this.#filterID).addEventListener("click", async () => {
                await this.#controller.cb_emitButtonEvent(this.#filterID, "getFilterParams");
            });
        }
    }

    async renderCombos (event) {
        this.destroyPreviousBootstrapCollapseObjects();
        const bUsePagination = event.needsPagination;
        const numCombos = event.combos.length;
        const parentAccordionID = this.#outerAccordionID;
        const accordDiv = document.getElementById(parentAccordionID);
        let skeletonInternal = ``;
        let i = 0;
        
        while (i < numCombos) {
            const combo = event.combos[i];
            const stageID = combo.stage;
            const cleanFile = combo.file.substring(combo.file.lastIndexOf("/") + 1).replace(/\.[^/.]+$/,"");
            const comboID = cleanFile + "_" + String(combo.comboNum);
            const playerTag = combo.target_tag.replaceAll('＃','#');
            const opponentTag = combo.opponent_tag.replaceAll('＃','#');

            const playerChar = combo.target_char;
            const opponentChar = combo.opponent_char;

            const playerColor = combo.target_color;
            const opponentColor = combo.opponent_color;

            // Loop over moves
            let moveHTML = `
            <div class="accordion-combo-data">
                <div class="row">
                    <div class="col col-md-3">
                        <b>Did Kill?</b>
                    </div>
                    <div class="col col-md-3">
                        <b>Start</b>:
                    </div>
                    <div class="col col-md-3">
                        <b>End</b>:
                    </div>
                    <div class="col col-md-3">
                        <b>Damage</b>:
                    </div>
                </div>
                <div class="row">
                    <div class="col col-md-3">
                        ${combo.combo.didKill}
                    </div>
                    <div class="col col-md-3">
                        ${combo.combo.startFrame}
                    </div>
                    <div class="col col-md-3">
                        ${combo.combo.endFrame}
                    </div>
                    <div class="col col-md-3">
                        ${(combo.combo.endPercent - combo.combo.startPercent).toFixed(2)}
                    </div>
                </div>
                <div class="row accordion-combo-data-extra-space">
                    <div class="col-md-2">
                        <b>Game:</b>
                    </div>
                    <div class="col-md-10" style="text-align: left;">
                        ${cleanFile}
                    </div>
                </div>
            </div>
            `;

            let moveNum = 0;
            combo.combo.moves.forEach(move => {
                const moveID = comboID + "_" + String(moveNum);

                const moveHeaderID = "combo_" + moveID;
                const moveHeaderButtonID = moveHeaderID + "_button";
                const moveCollapseID = "combo_" + moveID + "_move_list";
                this.#idList.push(moveHeaderID);
                this.#collapseIDMap.set(moveHeaderID, {
                    collapseID: moveCollapseID,
                    buttonID: moveHeaderButtonID
                });
                
                moveHTML = `${moveHTML}
                <div class="accordion-item">
                    <h2 class="accordion-header" id="${moveHeaderID}">
                        <button id="${moveHeaderButtonID}" class="accordion-button accordion-button-sub collapsed collapsed-icon">
                            Move ${move.moveID}: ${utility.getMoveNameFromAttackID(move.moveID, playerChar)}
                        </button>
                    </h2>
                    <div id="${moveCollapseID}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <div class="row">
                                <div class="col col-md-2">
                                    <b>Damage</b>:
                                </div>
                                <div class="col col-md-2">
                                    <b>X Coord</b>:
                                </div>
                                <div class="col col-md-2">
                                    <b>Y Coord</b>:
                                </div>
                                <div class="col col-md-2">
                                    <b>Frame</b>:
                                </div>
                                <div class="col col-md-2">
                                    <b>Hit</b>:
                                </div>
                                <div class="col col-md-2">
                                    <b>Action</b>:
                                </div>
                            </div>
                            <div class="row">
                                <div class="col col-md-2">
                                    ${parseFloat(move.damage).toFixed(2)}
                                </div>
                                <div class="col col-md-2">
                                    ${move.xPos}
                                </div>
                                <div class="col col-md-2">
                                    ${move.yPos}
                                </div>
                                <div class="col col-md-2">
                                    ${move.frame}
                                </div>
                                <div class="col col-md-2">
                                    ${move.hitCount}
                                </div>
                                <div class="col col-md-2">
                                    ${utility.getActionNameFromID(move.actionID, playerChar)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                moveNum++;
            });

            const moveHeaderID = "combo_" + comboID + "_heading";
            const moveHeaderButtonID = moveHeaderID + "_button";
            const moveCollapseID = "combo_" + comboID + "_collapse";
            const moveMeatballsButtonID = "combo_" + comboID + "_meatballs";
            this.#idList.push(moveHeaderID);
            this.#collapseIDMap.set(moveHeaderID, {
                collapseID: moveCollapseID,
                buttonID: moveHeaderButtonID
            });

            const playerColorString = playerColor === "0" ? playerChar : playerChar + "_" + playerColor;
            const opponentColorString = opponentColor === "0" ? opponentChar : opponentChar + "_" + opponentColor;

            skeletonInternal = `
                ${skeletonInternal}
                    <div class="accordion-item outer-accordion-item">
                        <h2 class="accordion-header outer-accordion-header" id="${moveHeaderID}">
                            <button id="${moveHeaderButtonID}" class="accordion-button collapsed collapsed-icon">
                                <img src="./img/si_${playerColorString}.png" width="20" height="20">
                                <p class="p-move">${playerTag} combos</p>
                                <img src="./img/si_${opponentColorString}.png" width="20" height="20">
                                <p class="p-move">${opponentTag} on ${utility.getStageNameFromID(stageID)} (${combo.combo.moves.length} moves)</p>
                                <div id="${moveMeatballsButtonID}" class="meatballs-div">
                                    <img src="./Bootstrap/svg/three-dots.svg" class="meatballs-icon">
                                </div>
                            </button>
                        </h2>
                        <div id="${moveCollapseID}" class="accordion-collapse collapse">
                            <div class="accordion-body">
                                <div class="accordion" id="combo_${comboID}_character_display_accordion">
                                    ${moveHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

            i++;
        }

        if (bUsePagination) {
            const activePage = event.page;
            const totalPages = event.totalPage;
            this._createPaginationSection(activePage, totalPages, event.hitsThisPage, event.hitsTotal);
            this._attachPaginationCallbacks(activePage, totalPages);
        } else {
            this._createPaginationSection(0, 0, numCombos, numCombos);
            this._attachPaginationCallbacks(0, 0);
        }
        
        accordDiv.innerHTML = skeletonInternal;

        this.createLimitedBootstrapObjects();
        document.getElementById(this.#outerAccordionID).scrollTop = 0;
    }

    onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    getUpdatePaginationEventName() {
        switch(this.getType()) {
            case AccordionTypes.PARSE:
                return "updateParsePagination";
            case AccordionTypes.FINDCOMBOS:
                return "updateComboPagination";
        }
    }
}

module.exports = {AccordionView, AccordionTypes};