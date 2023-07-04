const bootstrap = require('../../Bootstrap/js/bootstrap.bundle.min');

const AccordionTypes = Object.freeze({
    PARSE:      0,
    COUNT:      1,
    FINDCOMBOS: 2
});

class AccordionView {

    #accordionDiv = null;
    #idList = null;
    #appState = null;
    #outerAccordionID = "";
    #type = null;
    #collapseIDMap = null;
    #collapseMap = null;
    #collapseList = null;

    // I need a finite number of things that can be open in an accordion
    // This is a performance limitation
    MAX_COLLAPSE_SIZE = 99;

    constructor (type, appState) {
        switch (type) {
            case AccordionTypes.PARSE:
                this.#outerAccordionID = "parseSlippi_players_outmostAccordion";
                break;
            case AccordionTypes.FINDCOMBOS:
                this.#outerAccordionID = "comboSlippi_combos_outmostAccordion";
                break;
        }
        this.#appState = appState;
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
            document.getElementById(ID).addEventListener("click", async () => {
                const collapsedIDStruct = this.#collapseIDMap.get(ID);
                const collapseID = collapsedIDStruct.collapseID;

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
                <div class="accordion-item">
                    <h2 class="accordion-header" id="${headingID}">
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

        this.#appState.setFoundTags(foundTags);
        accordDiv.innerHTML = skeletonInternal;

        this.createLimitedBootstrapObjects();
    }

    async renderCombos (event) {
        this.destroyPreviousBootstrapCollapseObjects();

        const parentAccordionID = this.#outerAccordionID;
        const accordDiv = document.getElementById(parentAccordionID);
        let skeletonInternal = ``;
        let i = 0;
        
        for (const file in event) {
            let comboNum = 0;
            const stageID = event[file].stage_ID;
            if (event[file].combos) {
                event[file].combos.forEach(combo => {
                    const cleanFile = file.substring(file.lastIndexOf('/') + 1).replace(/\.[^/.]+$/,"");
                    const comboID = cleanFile + "_" + String(comboNum);
                    const playerChar = "Foxy";
                    const opponentChar = "PVSTV";

                    // Loop over moves
                    let moveHTML = `
                    <div>
                        Killed? ${combo.didKill} Start: ${combo.startFrame} End: ${combo.endFrame} Dmg: ${combo.endPercent - combo.startPercent}
                    </div><div>
                        ${cleanFile}
                    </div>
                    `;

                    let moveNum = 0;
                    combo.moves.forEach(move => {
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
                                    Move ${move.moveID}
                                </button>
                            </h2>
                            <div id="${moveCollapseID}" class="accordion-collapse collapse">
                                <div class="accordion-body">
                                    Damage: ${move.damage}
                                    Coords: X: ${move.xPos}, Y: ${move.yPos}
                                    frame: ${move.frame}
                                    hit: ${move.hitCount}
                                </div>
                            </div>
                        </div>
                        `;
                        moveNum++;
                    });

                    const moveHeaderID = "combo_" + comboID + "_heading";
                    const moveHeaderButtonID = moveHeaderID + "_button";
                    const moveCollapseID = "combo_" + comboID + "_collapse";
                    this.#idList.push(moveHeaderID);
                    this.#collapseIDMap.set(moveHeaderID, {
                        collapseID: moveCollapseID,
                        buttonID: moveHeaderButtonID
                    });

                    skeletonInternal = `
                        ${skeletonInternal}
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="${moveHeaderID}">
                                    <button id="${moveHeaderButtonID}" class="accordion-button collapsed collapsed-icon">
                                        ${playerChar} combos ${opponentChar} on ${stageID} (${combo.moves.length} moves)
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

                    comboNum++;
                });
            }
        }
        accordDiv.innerHTML = skeletonInternal;

        this.createLimitedBootstrapObjects();
    }

    async oldRenderCombos (event) {
        let comboLimit = 0;
        const parentAccordionID = this.#outerAccordionID;
        const accordDiv = document.getElementById(parentAccordionID);
        let skeletonInternal = ``;
        let i = 0;
        const foundTags = [];
        for (const file in event) {
            if (comboLimit >= 100) {
                break;
            }
            let comboNum = 0;
            const stageID = event[file].stage_ID;
            if (event[file].combos) {
                event[file].combos.forEach(combo => {
                    const cleanFile = file.substring(file.lastIndexOf('/') + 1).replace(/\.[^/.]+$/,"");
                    const comboID = cleanFile + "_" + String(comboNum);
                    const playerChar = "Foxy";
                    const opponentChar = "PVSTV";

                    // Loop over moves
                    let moveHTML = `
                    <div>
                        Killed? ${combo.didKill} Start: ${combo.startFrame} End: ${combo.endFrame} Dmg: ${combo.endPercent - combo.startPercent}
                    </div><div>
                        ${cleanFile}
                    </div>
                    `;
                    if (comboLimit <= 20) {
                        let moveNum = 0;
                        combo.moves.forEach(move => {
                            const moveID = comboID + "_" + String(moveNum);
                            
                            moveHTML = `${moveHTML}
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="combo_${moveID}">
                                    <button class="accordion-button accordion-button-sub collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#combo_${moveID}_move_list" aria-expanded="false" aria-controls="combo_${moveID}_move_list">
                                        Move ${move.moveID}
                                    </button>
                                </h2>
                                <div id="combo_${moveID}_move_list" class="accordion-collapse collapse" aria-labelledby="combo_${moveID}"> <!-- data-bs-parent="#combo_${comboID}_character_display_accordion"> -->
                                    <div class="accordion-body">
                                        Damage: ${move.damage}
                                        Coords: X: ${move.xPos}, Y: ${move.yPos}
                                        frame: ${move.frame}
                                        hit: ${move.hitCount}
                                    </div>
                                </div>
                            </div>
                            `;
                            moveNum++;
                        });
                    }


                    skeletonInternal = `
                        ${skeletonInternal}
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="combo_${comboID}_heading">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#combo_${comboID}_collapse" aria-expanded="false" aria-controls="combo_${comboID}_collapse">
                                        ${playerChar} combos ${opponentChar} on ${stageID} (${combo.moves.length} moves)
                                    </button>
                                </h2>
                                <div id="combo_${comboID}_collapse" class="accordion-collapse collapse" aria-labelledby="combo_${comboID}_heading" data-bs-parent="#${parentAccordionID}">
                                    <div class="accordion-body">
                                        <div class="accordion" id="combo_${comboID}_character_display_accordion">
                                            ${moveHTML}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                    comboNum++;
                });
            }
            comboLimit++;
        }
        accordDiv.innerHTML = skeletonInternal;
    }

    onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }
}

module.exports = {AccordionView, AccordionTypes};