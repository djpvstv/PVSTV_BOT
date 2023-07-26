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

    static getMoveNameFromAttackID(id) {
        switch (parseFloat(id)) {
            case 0:
                return "None";
            case 1:
                return "Non-Staling";
            case 2:
                return "Jab 1";
            case 3:
                return "Jab 2";
            case 4:
                return "Jab 3";
            case 5:
                return "Rapid Jabs";
            case 6:
                return "Dash Attack";
            case 7:
                return "Forward Tilt";
            case 8:
                return "Up Tilt";
            case 9:
                return "Down Tilt";
            case 10:
                return "Forward Smash";
            case 11:
                return "Up Smash";
            case 12:
                return "Down Smash";
            case 13:
                return "Nair";
            case 14:
                return "Fair";
            case 15:
                return "Bair";
            case 16:
                return "Uair";
            case 17:
                return "Dair";
            case 18:
                return "Neutral Special";
            case 19:
                return "Side Special";
            case 20:
                return "Up Special";
            case 21:
                return "Down Special";
            case 50:
                return "Get Up Attack (Back)";
            case 51:
                return "Get Up Attack (Front)";
            case 52:
                return "Pummel";
            case 53:
                return "Forward Throw";
            case 54:
                return "Back Throw";
            case 55:
                return "Up Throw";
            case 56:
                return "Down Throw";                                                                                                                                                                                              
        }
        return "";
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

    static getActionNameFromID (playerChar, actionID) {
        switch (parseInt(actionID)) {
            case 42:
                return "None";
            case 43:
                return "Non-Staling";
            case 44:
                return "Jab 1";
            case 45:
                return "Jab 2";
            case 46:
                return "Jab 3";
            case 47:
                return "Rapid Jabs";
            case 50:
                return "Dash Attack";
            case 51:
                return "High Ftilt";
            case 52:
                return "High-Mid Ftilt";
            case 53:
                return "Mid Ftilt";
            case 54:
                return "Low-Mid Ftilt";
            case 55:
                return "Low Ftilt";
            case 56:
                return "Uptilt";
            case 57:
                return "Downtilt";
            case 58:
                return "High Fsmash";
            case 59:
                return "High-Mid Fsmash";
            case 60:
                return "Mid Fsmash";
            case 61:
                return "Low-Mid Fsmash";
            case 62:
                return "Low Fsmash";
            case 63:
                return "Upsmash";
            case 64:
                return "Downsmash";
            case 65:
                return "Nair";
            case 66:
                return "Fair";
            case 67:
                return "Bair";
            case 68:
                return "Uair";
            case 69:
                return "Dair";
            case 187:
                return "Getup Attack";
            case 212:
                return "Grab";
            case 217:
                return "Pummel";
            case 219:
                return "Forward Throw";
            case 220:
                return "Back Throw";
            case 221:
                return "Up Throw";
            case 222:
                return "Down Throw";     
        }

        return this.getSpecialActionNameFromID(playerChar, actionID);
                                                                                                                                                                                                          
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

    static getSpecialActionNameFromID(playerChar, actionID) {
        const charData = this.#idMap.get(playerChar);
        const found = charData.actionIDs.find(el => el === parseInt(actionID));
        if (found) return DataTransfer.actionNames[found];

        return `Unknown ${charData.name} ID: ${actionID}`;
    }

}

module.exports = Utility;