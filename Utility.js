class Utility {
    static #commonMoveIDs = [2,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,50,51,52,53,54,55,56];
    static #commonMoveNames = ["Jab 1","Dash Attack","Forward Tilt","Up Tilt","Down Tilt","Forward Smash","Up Smash","Down Smash","Nair","Fair","Bair","Uair","Dair","Neutral Special","Side Special","Up Special","Down Special","Get Up Attack (Back)","Get Up Attack (Front)","Pummel","Forward Throw","Back Throw","Up Throw","Down Throw"];
    static #commonActionIDs = [44,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,187,212,217,219,220,221,222];
    static #commonActionNames = ["Jab 1","Dash Attack","Forward Tilt","Up Tilt","Down Tilt","Forward Smash","Up Smash","Down Smash","Nair","Fair","Bair","Uair","Dair","Pummel","Forward Throw","Back Throw","Up Throw","Down Throw"];
    static #idMap = new Map([
        [0, {
            name: "Captain Falcon",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"])
        }],
        [1, {
            name: "DK",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"])
        }],
        [2, {
            name: "Fox",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"])
        }],
        [23, {
            name: "Roy",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs.concat([341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372]),
            actionNames: this.#commonActionNames.concat(["Flare Blade Ground Start Charge","Flare Blade Ground Charge Loop","Flare Blade Ground Early Release","Flare Blade Ground Fully Charged","Flare Blade Air Start Charge","Flare Blade Air Charge Loop","Flare Blade Air Early Release","Flare Blade Air Fully Charged","Double Edge Dance 1 Ground","Double Edge Dance 2 Up Ground","Double Edge Dance 2 Side Ground","Double Edge Dance 3 Up Ground","Double Edge Dance 3 Side Ground","Double Edge Dance 3 Down Ground","Double Edge Dance 4 Up Ground","Double Edge Dance 4 Side Ground","Double Edge Dance 4 Down Ground","Double Edge Dance 1 Air","Double Edge Dance 2 Up Air","Double Edge Dance 2 Side Air","Double Edge Dance 3 Up Air","Double Edge Dance 3 Side Air","Double Edge Dance 3 Down Air","Double Edge Dance 4 Up Air","Double Edge Dance 4 Side Air","Double Edge Dance 4 Down Air","Blazer Ground","Blazer Air","Counter Ground","Counter Ground Hit","Counter Air","Counter Air Hit"])
        }]
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
        switch (parseInt(playerChar)) {
            case 23:
                return this.getRoySpecialActionNameFromID(actionID);
        }

        return `Unknown ID: ${actionID}`;
    }

    static getRoySpecialActionNameFromID (actionID) {
        const royData = this.#idMap.get(23);
        const found = royData.actionIDs.find(el => el === parseInt(actionID));
        if (found) {
            return royData.actionNames[found];
        }
        // }
        // switch (parseInt(actionID)) {
        //     case 341:
        //         return "Flare Blade Ground Start Charge";
        //     case 342:
        //         return "Flare Blade Ground Charge Loop";
        //     case 343:
        //         return "Flare Blade Ground Early Release";
        //     case 344:
        //         return "Flare Blade Ground Fully Charged";
        //     case 345:
        //         return "Flare Blade Air Start Charge";
        //     case 346:
        //         return "Flare Blade Air Charge Loop";
        //     case 347:
        //         return "Flare Blade Early Release";
        //     case 348:
        //         return "Flare Blade Air Fully Charged";
        //     case 349:
        //         return "Double-Edge Dance 1 Ground";
        //     case 350:
        //         return "Double-Edge Dance 2 Up Ground";
        //     case 351:
        //         return "Double-Edge Dance 2 Side Ground";
        //     case 352:
        //         return "Double-Edge Dance 3 Up Ground";
        //     case 353:
        //         return "Double-Edge Dance 3 Side Ground";
        //     case 354:
        //         return "Double-Edge Dance 3 Down Ground";
        //     case 355:
        //         return "Double-Edge Dance 4 Up Ground";
        //     case 356:
        //         return "Double-Edge Dance 4 Side Ground";
        //     case 357:
        //         return "Double-Edge Dance 4 Down Ground";
        //     case 358:
        //         return "Double-Edge Dance 1  Air";
        //     case 359:
        //         return "Double-Edge Dance 2 Up Air";
        //     case 360:
        //         return "Double-Edge Dance 2 Side Air";
        //     case 361:
        //         return "Double-Edge Dance 3 Up Air";
        //     case 362:
        //         return "Double-Edge Dance 3 Side Air";
        //     case 363:
        //         return "Double-Edge Dance 3 Down Air";
        //     case 364:
        //         return "Double-Edge Dance 4 Up Air";
        //     case 365:
        //         return "Double-Edge Dance 4 Side Air";
        //     case 366:
        //         return "Double-Edge Dance 4 Down Air";
        //     case 367:
        //         return "Blazer Ground";
        //     case 368:
        //         return "Blazer Air";
        //     case 369:
        //         return "Counter Ground";
        //     case 370:
        //         return "Counter Ground Hit";
        //     case 371:
        //         return "Counter Air";
        //     case 372:
        //         return "Counter Air Hit";
        // }

        return `Unknown ROY ID: ${actionID}`;
    }
}

module.exports = Utility;