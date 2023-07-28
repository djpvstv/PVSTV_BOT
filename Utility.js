class Utility {
    static #commonMoveIDs = [2,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,50,51,52,53,54,55,56];
    static #commonMoveNames = ["Jab 1","Dash Attack","Forward Tilt","Up Tilt","Down Tilt","Forward Smash","Up Smash","Down Smash","Nair","Fair","Bair","Uair","Dair","Neutral Special","Side Special","Up Special","Down Special","Get Up Attack (Back)","Get Up Attack (Front)","Pummel","Forward Throw","Back Throw","Up Throw","Down Throw"];
    static #commonActionIDs = [44,50,53,56,57,60,63,64,65,66,67,68,69,187,217,219,220,221,222];
    static #commonActionNames = ["Jab 1","Dash Attack","Mid Forward Tilt","Up Tilt","Down Tilt","Mid Forward Smash","Up Smash","Down Smash","Nair","Fair","Bair","Uair","Dair","Getup Attack","Pummel","Forward Throw","Back Throw","Up Throw","Down Throw"];
    static #idMap = new Map([
        [0, {
            name: "Captain Falcon",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [1, {
            name: "DK",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [2, {
            name: "Fox",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [3, {
            name: "Mr. Game & Watch",
            moveIDs: this.#commonMoveIDs.concat([5]),
            moveNames: this.#commonMoveNames.concat(["Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [4, {
            name: "Kirby",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [5, {
            name: "Bowser",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [6, {
            name: "Link",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [7, {
            name: "Luigi",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [8, {
            name: "Mario",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [9, {
            name: "Marth",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [10, {
            name: "Mewtwo",
            moveIDs: this.#commonMoveIDs.concat([5]),
            moveNames: this.#commonMoveNames.concat(["Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [11, {
            name: "Ness",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [12, {
            name: "Peach",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [13, {
            name: "Pikachu",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [14, {
            name: "Ice Climbers",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [15, {
            name: "Jigglypuff",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [16, {
            name: "Samus",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [17, {
            name: "Yoshi",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [18, {
            name: "Zelda",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [19, {
            name: "Sheik",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [20, {
            name: "Falco",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [21, {
            name: "Young Link",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [22, {
            name: "Dr. Mario",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [23, {
            name: "Roy",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs.concat([343,344,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,370,372]),
            actionNames: this.#commonActionNames.concat(["Flare Blade Ground Early Release","Flare Blade Ground Fully Charged","Flare Blade Air Early Release","Flare Blade Air Fully Charged","Double Edge Dance 1 Ground","Double Edge Dance 2 Up Ground","Double Edge Dance 2 Side Ground","Double Edge Dance 3 Up Ground","Double Edge Dance 3 Side Ground","Double Edge Dance 3 Down Ground","Double Edge Dance 4 Up Ground","Double Edge Dance 4 Side Ground","Double Edge Dance 4 Down Ground","Double Edge Dance 1 Air","Double Edge Dance 2 Up Air","Double Edge Dance 2 Side Air","Double Edge Dance 3 Up Air","Double Edge Dance 3 Side Air","Double Edge Dance 3 Down Air","Double Edge Dance 4 Up Air","Double Edge Dance 4 Side Air","Double Edge Dance 4 Down Air","Blazer Ground","Blazer Air","Counter Ground","Counter Air"])
        }],
        [24, {
            name: "Pichu",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
        [25, {
            name: "Ganondorf",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs,
            actionNames: this.#commonActionNames
        }],
    ]);
    static #stageIDMap = new Map([
        [2, {name: "Fountain of Dreams"}],
        [3, {name: "Pokemon Stadium"}],
        [4, {name: "Princess Peach's Castle"}],
        [5, {name: "Kongo Jungle"}],
        [6, {name: "Brinstar"}],
        [7, {name: "Corneria"}],
        [8, {name: "Yoshi's Story"}],
        [9, {name: "Onett"}],
        [10, {name: "Mute City"}],
        [11, {name: "Rainbow Cruise"}],
        [12, {name: "Jungle Japes"}],
        [13, {name: "Great Bay"}],
        [14, {name: "Hyrule Temple"}],
        [15, {name: "Brinstar Depths"}],
        [16, {name: "Yoshi's Island"}],
        [17, {name: "Green Greens"}],
        [18, {name: "Fourside"}],
        [19, {name: "Mushroom Kingdom I"}],
        [20, {name: "Mushroom Kingdom II"}],
        [21, {name: "Akaneia"}],
        [22, {name: "Venom"}],
        [23, {name: "Poke Floats"}],
        [26, {name: "Icetop"}],
        [27, {name: "Flat Zone"}],
        [28, {name: "Dream Land N64"}],
        [29, {name: "Yoshi's Island N64"}],
        [30, {name: "Kongo Jungle N64"}],
        [31, {name: "Battlefield"}],
        [32, {name: "Final Destination"}]
    ]);

    static getMoveNameFromAttackID(moveID, charID) {
        moveID = parseInt(moveID);
        if (this.#commonMoveIDs.includes(moveID)) {
            const idx = this.#commonMoveIDs.indexOf(moveID);
            return this.#commonMoveNames[idx];
        }
        
        const charData = this.#idMap.get(parseInt(charID));
        if (charData.moveIDs.includes(moveID)) {
            const idx = charData.moveIDs.indexOf(moveID);
            return charData.moveNames[idx];
        }

        return `Unknown Move for ${charID} move ${moveID}`;
    }

    static getActionNameFromID (actionID, charID) {
        actionID = parseInt(actionID);
        if (this.#commonActionIDs.includes(actionID)) {
            const idx = this.#commonActionIDs.indexOf(actionID);
            return this.#commonActionNames[idx];
        }
        
        const charData = this.#idMap.get(parseInt(charID));
        if (charData.actionIDs.includes(actionID)) {
            const idx = charData.actionIDs.indexOf(actionID);
            return charData.actionNames[idx];
        }

        return `Unknown Action for ${charID} action ${actionID}`;
    }

    static getCharacterNames () {
        const chars = [];
        this.#idMap.forEach(el => {
            chars.push(el.name);
        });
        return chars;
    }

    static getCharacterIDs () {
        return [...this.#idMap.keys()];
    }

    static getStageNameFromID(id) {
        return this.#stageIDMap.get(parseInt(id)).name;
    }

    static getMaxCostumesByCharacter (id) {
        switch (parseInt(id)) {
            case 0:
                return 5;
            case 1:
                return 4;
            case 2:
                return 3;
            case 3:
                return 3;
            case 4:
                return 5;
            case 5:
                return 3;
            case 6:
                return 4;
            case 7:
                return 3;
            case 8:
                return 4;
            case 9:
                return 4;
            case 10:
                return 3;
            case 11:
                return 3;
            case 12:
                return 4;
            case 13:
                return 3;
            case 14:
                return 3;
            case 15:
                return 4;
            case 16:
                return 4;
            case 17:
                return 5;
            case 18:
                return 4;
            case 19:
                return 4;
            case 20:
                return 3;
            case 21:
                return 4;
            case 22:
                return 4;
            case 23:
                return 4;
            case 24:
                return 3;
            case 25:
                return 4;
            case 26:
                return 0;
            case 29:
                return 0;
            case 32:
                return 0;
        }
        return -1;
    }

    static getMoveIDsForChar(playerChar) {
        const charData = this.#idMap.get(parseInt(playerChar));
        if (Object.hasOwnProperty.call(charData, "moveIDs")) return charData.moveIDs;
        return [];
    }

    static getMoveNamesForChar(playerChar) {
        const charData = this.#idMap.get(parseInt(playerChar));
        if (Object.hasOwnProperty.call(charData, "moveNames")) return charData.moveNames;
        return [];
    }

    static getActionIDsForChar (playerChar) {
        const charData = this.#idMap.get(parseInt(playerChar));
        if (Object.hasOwnProperty.call(charData, "actionIDs")) return charData.actionIDs;
        return [];
    }

    static getActionNamesForChar (playerChar) {
        const charData = this.#idMap.get(parseInt(playerChar));
        if (Object.hasOwnProperty.call(charData, "actionNames")) return charData.actionNames;
        return [];
    }

}

module.exports = Utility;