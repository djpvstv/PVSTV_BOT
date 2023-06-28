const AccordionTypes = Object.freeze({
    PARSE:      0,
    COUNT:      1,
    FINDCOMBOS: 2
});

class AccordionView {

    #accordionDiv = null;
    #outerAccordionID = "";

    constructor (type) {
        switch (type) {
            case AccordionTypes.PARSE:
                this.#outerAccordionID = "parseSlippi_players_outmostAccordion";
                break;
        }
    }

    createAccordionForPlayers () {
        const accordDiv = document.createElement("accordion");
        this.#accordionDiv = accordDiv;
        return accordDiv;
    }

    render ( event ) {
        const parentAccordionID = this.#outerAccordionID;
        const accordDiv = document.getElementById(parentAccordionID);
        let skeletonInternal = ``;
        let i = 0;
        event.players.forEach((player) => {
            const playerTag = Object.keys(player)[0];
            const allCharList = player[playerTag].char_id;
            const characterList = allCharList.filter(this.onlyUnique);

            const allNameList = player[playerTag].disp_name;
            const nameList = allNameList.filter(this.onlyUnique);

            const cleanPlayerTag = playerTag.replaceAll('＃','_');

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
                <h2 class="accordion-header" id="player_${cleanPlayerTag}_heading">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#player_${cleanPlayerTag}_collapse" aria-expanded="false" aria-controls="player_${cleanPlayerTag}_collapse">
                        ${cleanPlayerTag}
                    </button>
                </h2>
                <div id="player_${cleanPlayerTag}_collapse" class="accordion-collapse collapse" aria-labelledby="player_${cleanPlayerTag}_heading" data-bs-parent="#${parentAccordionID}">
                    <div class="accordion-body">
                        <div class="accordion" id="player_${cleanPlayerTag}_character_display_accordion">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="player_${cleanPlayerTag}_characters">
                                    <button class="accordion-button accordion-button-sub collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#player_${cleanPlayerTag}_character_list" aria-expanded="false" aria-controls="player_${cleanPlayerTag}_character_list">
                                        Characters Played
                                    </button>
                                </h2>
                                <div id="player_${cleanPlayerTag}_character_list" class="accordion-collapse collapse" aria-labelledby="player_${cleanPlayerTag}_characters"> <!-- data-bs-parent="#player_${cleanPlayerTag}_character_display_accordion"> -->
                                    <div class="accordion-body">
                                        ${characterIcons}
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="player_${cleanPlayerTag}_names">
                                    <button class="accordion-button accordion-button-sub collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#player_${cleanPlayerTag}_names_list" aria-expanded="false" aria-controls="player_${cleanPlayerTag}_names_list">
                                        Display Names Used
                                    </button>
                                </h2>
                                <div id="player_${cleanPlayerTag}_names_list" class="accordion-collapse collapse" aria-labelledby="player_${cleanPlayerTag}_names"> <!-- data-bs-parent="#player_${cleanPlayerTag}_character_display_accordion"> -->
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

    onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }
}

module.exports = {AccordionView, AccordionTypes};