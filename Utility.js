class Utility {
    static #commonMoveIDs = [2,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,50,51,52,53,54,55,56,61,62];
    static #commonMoveNames = ["Jab 1","Dash Attack","Forward Tilt","Up Tilt","Down Tilt","Forward Smash","Up Smash","Down Smash","Nair","Fair","Bair","Uair","Dair","Neutral Special","Side Special","Up Special","Down Special","Get Up Attack (Back)","Get Up Attack (Front)","Pummel","Forward Throw","Back Throw","Up Throw","Down Throw","Ledge Get Up Attack +100%", "Ledge Get Up Attack"];
    static #commonActionIDs = [44,50,53,56,57,60,63,64,65,66,67,68,69,187,217,219,220,221,222];
    static #commonActionNames = ["Jab 1","Dash Attack","Mid Forward Tilt","Up Tilt","Down Tilt","Mid Forward Smash","Up Smash","Down Smash","Nair","Fair","Bair","Uair","Dair","Getup Attack","Pummel","Forward Throw","Back Throw","Up Throw","Down Throw"];
    static #stageIDs = [2, 3, 8, 28, 31, 32, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 27, 29, 30];
    static #tournamentLegalStageIDs = [2, 3, 8, 28, 31, 32];
    static #nonTournamentLegalStageIDs = [2, 3, 8, 28, 31, 32, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 27, 29, 30];
    // Note: this map still doesn't have angled hits, ftilt fsmash for Falcon, bowser, etc.
    static #idMap = new Map([
        [0, {
            name: "Captain Falcon",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([347,348,350,352,353,354,357,359]),
            actionNames: this.#commonActionNames.concat(["Falcon Punch Ground","Falcon Punch Air","Raptor Boost Ground","Raptor Boost Air","Falcon Dive Ground","Falcon Dive Air","Falcon Kick Ground","Falcon Kick Air"])
        }],
        [1, {
            name: "DK",
            moveIDs: this.#commonMoveIDs.concat([3, 57, 58, 59, 60]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Cargo Forward Throw", "Cargo Back Throw", "Cargo Down Throw", "Cargo Up Throw"]),
            actionIDs: this.#commonActionIDs.concat([361,362,363,364,365,366,367,368,372,373,377,378,381,382,384]),
            actionNames: this.#commonActionNames.concat(["Kong Karry Ground Throw Forward","Kong Karry Ground Throw Backward","Kong Karry Ground Throw Up","Kong Karry Ground Throw Down","Kong Karry Air Throw Forward","Kong Karry Air Throw Backward","Kong Karry Air Throw Up","Kong Karry Air Throw Down","Giant Punch Ground Early Punch","Giant Punch Ground Full Charge Punch","Giant Punch Air Early Punch","Giant Punch Air Full Charge Punch","Headbutt Ground","Headbutt Air","Spinning Kong Ground","Spinning Kong Air","Hand Slap"])
        }],
        [2, {
            name: "Fox",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([342,345,348,351,355,356,361,366]),
            actionNames: this.#commonActionNames.concat(["Blaster Ground","Blaster Air","Illusion Ground","Illusion Air","Fire Fox Ground","Fire Fox Air","Reflector Ground","Reflector Air"])
        }],
        [3, {
            name: "Mr. Game & Watch",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([341,342,343,345,346,347,348,349,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,377,380]),
            actionNames: this.#commonActionNames.concat(["Jab","Jab 2","Rapid Jabs","Down Tilt","Side Smash","Nair","Bair","Uair","Chef Ground","Chef Air","Judgment 1 Ground","Judgment 2 Ground","Judgment 3 Ground","Judgment 4 Ground","Judgment 5 Ground","Judgment 6 Ground","Judgment 7 Ground","Judgment 8 Ground","Judgment 9 Ground","Judgment 1 Air","Judgment 2 Air","Judgment 3 Air","Judgment 4 Air","Judgment 5 Air","Judgment 6 Air","Judgment 7 Air","Judgment 8 Air","Judgment 9 Air","Fire Ground","Fire Air","Oil Panic Ground Spill","Oil Panic Air Spill"])
        }],
        [4, {
            name: "Kirby",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([351,352,367,369,378,380,383,384,389,390,391,394,397,399,400,403,406,410,412,413,418,424,427,429,430,431,432,433,434,437,441,444,447,450,452,453,454,458,459,463,464,465,466,470,474,491,494,495,498,499,504,509,510,511,512,513,517,519,521,524,526,527,528,529,532,533,536,537]),
            actionNames: this.#commonActionNames.concat(["Dash Attack Ground","Dash Attack Air","Swallow Ground Digest","Swallow Ground Spit","Swallow Air Digest","Swallow Air Spit","Hammer Ground","Hammer Air","Final Cutter Air Startup","Final Cutter Air Apex","Final Cutter Sword Descent","Stone Ground","Stone Air","Mario Fireball Ground","Mario Fireball Air","Link Bow Ground Fire","Link Bow Air Fire","Samus Charge Shot Air Start","Samus Charge Shot Air Fire","Yoshi Egg Lay Ground","Yoshi Egg Lay Air","Fox Blaster Ground","Fox Blaster Air","Pikachu Thunder Jolt Ground","Pikachu Thunder Jolt Air","Luigi Fireball Ground","Luigi Fireball Air","Falcon Falcon Punch Ground","Falcon Falcon Punch Air","Ness PK Flash Ground Explode","Ness PK Flash Air Explode","Bowser Fire Breath Ground","Bowser Fire Breath Air","Peach Toad Ground Attack","Peach Toad Air Attack","Ice Climbers Ice Shot Ground","Ice Climbers Ice Shot Air","DK Giant Punch Ground Early Punch","DK Giant Punch Ground Full Charge Punch","DK Giant Punch Air Early Punch","DK Giant Punch Air Full Charge Punch","Zelda Nayru's Love Ground","Zelda Nayru's Love Air","Sheik Needle Storm Ground Fire","Sheik Needle Storm Air Fire","Jigglypuff Rollout Hit","Marth Shield Breaker Ground Early Release","Marth Shield Breaker Ground Fully Charged","Marth Shield Breaker Air Early Release","Marth Shield Breaker Air Fully Charged","Mewtwo Shadow Ball Ground Fire","Mewtwo Shadow Ball Air Fire","Game and Watch Oil Panic Ground","Game and Watch Oil Panic Air","Doc Megavitamin Ground","Doc Megavitamin Air","Young Link Fire Bow Ground Fire","Young Link Fire Bow Air Fire","Falco Blaster Ground","Falco Blaster Air","Pichu Thunder Jolt Ground","Pichu Thunder Jolt Air","Ganon Warlock Punch Ground","Ganon Warlock Punch Air","Roy Flare Blade Ground Early Release","Roy Flare Blade Ground Fully Charged","Roy Flare Blade Air Early Release","Roy Flare Blade Air Fully Charged"])
        }],
        [5, {
            name: "Bowser",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs.concat([342,345,347,348,349,351,352,353,354,355,357,358,359,360,362,363]),
            actionNames: this.#commonActionNames.concat(["Fire Breath Ground","Fire Breath Air","Koopa Klaw Ground","Koopa Klaw Ground Grab","Koopa Klaw Ground Pummel","Koopa Klaw Ground Throw F","Koopa Klaw Ground Throw B","Koopa Klaw Air","Koopa Klaw Air Grab","Koopa Klaw Air Pummel","Koopa Klaw Air Throw F","Koopa Klaw Air Throw B","Whirling Fortress Ground","Whirling Fortress Air","Bomb Air","Bomb Land"])
        }],
        [6, {
            name: "Link",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([341,346,349,350,353,358,359,360]),
            actionNames: this.#commonActionNames.concat(["Side Smash 2","Bow Ground Fire","Bow Air Fire","Boomerang Ground Throw","Boomerang Air Throw","Spin Attack Ground","Spin Attack Air","Bomb Ground","Bomb Air","Zair"])
        }],
        [7, {
            name: "Luigi",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs.concat([341,342,347,348,353,354,355,356,357,358]),
            actionNames: this.#commonActionNames.concat(["Fireball Ground","Fireball Air","Green Missile Ground Takeoff","Green Missile Ground Takeoff Misfire","Green Missile Air Takeoff","Green Missile Air Takeoff Misfire","Super Jump Punch Ground","Super Jump Punch Air","Cyclone Ground","Cyclone Air"])
        }],
        [8, {
            name: "Mario",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs.concat([343,344,345,346,347,348,349,350]),
            actionNames: this.#commonActionNames.concat(["Fireball Ground","Fireball Air","Cape Ground","Cape Air","Super Jump Punch Ground","Super Jump Punch Air","Tornado Ground","Tornado Air"])
        }],
        [9, {
            name: "Marth",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs.concat([343,344,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,370,372]),
            actionNames: this.#commonActionNames.concat(["Shield Breaker Ground Early","Shield Breaker Ground Fully Charged","Shield Breaker Air Early","Shield Breaker Air Fully Charged","Dancing Blade 1 Ground","Dancing Blade 2 Up Ground","Dancing Blade 2 Side Ground","Dancing Blade 3 Up Ground","Dancing Blade 3 Side Ground","Dancing Blade 3 Down Ground","Dancing Blade 4 Up Ground","Dancing Blade 4 Side Ground","Dancing Blade 4 Down Ground","Dancing Blade 1 Air","Dancing Blade 2 Up Air","Dancing Blade 2 Side Air","Dancing Blade 3 Up Air","Dancing Blade 3 Side Air","Dancing Blade 3 Down Air","Dancing Blade 4 Up Air","Dancing Blade 4 Side Air","Dancing Blade 4 Down Air","Dolphin Slash Ground","Dolphin Slash Air","Counter Ground","Counter Air"])
        }],
        [10, {
            name: "Mewtwo",
            moveIDs: this.#commonMoveIDs.concat([5]),
            moveNames: this.#commonMoveNames.concat(["Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([345,350,351,352,359,360]),
            actionNames: this.#commonActionNames.concat(["Shadow Ball Ground Fire","Shadow Ball Air Fire","Confusion Ground","Confusion Air","Disable Ground","Disable Air"])
        }],
        [11, {
            name: "Ness",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs.concat([341,342,343,344,345,346,347,350,354,356,357,361,365,370,375]),
            actionNames: this.#commonActionNames.concat(["Side Smash","Up Smash","Up Smash Charge","Up Smash Charged","Down Smash","Down Smash Charge","Down Smash Charged","PK Flash Ground Explode","PK Flash Air Explode","PK Fire Ground","PK Fire Air","PK Thunder Ground Hit","PK Thunder Air Hit","PSI Magnet Ground End","PSI Magnet Air End"])
        }],
        [12, {
            name: "Peach",
            moveIDs: this.#commonMoveIDs.concat([3, 87]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Open Parasol"]),
            actionIDs: this.#commonActionIDs.concat([344,345,346,347,348,349,350,351,352,353,359,365,367,369,370]),
            actionNames: this.#commonActionNames.concat(["Float Nair","Float Fair","Float Bair","Float Uair","Float Dair","Side Smash Golf Club","Side Smash Frying Pan","Side Smash Tennis Racket","Vegetable Ground","Vegetable Air","Bomber Air Hit","Toad Ground","Toad Air","Parasol Opening","Parasol Open"])
        }],
        [13, {
            name: "Pikachu",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs.concat([341,342,347,352,354,357,360,361,364,365]),
            actionNames: this.#commonActionNames.concat(["Thunder Jolt Ground","Thunder Jolt Air","Skull Bash Ground Takeoff","Skull Bash Air Takeoff","Quick Attack Ground","Quick Attack Air","Thunder Ground","Thunder Ground Hit","Thunder Air","Thunder Air Hit"])
        }],
        [14, {
            name: "Ice Climbers",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs.concat([341,342,343,344,345,346,357,358,359,360]),
            actionNames: this.#commonActionNames.concat(["Ice Shot Ground","Ice Shot Air","Popo Squall Hammer Ground Solo","Popo Squall Hammer Ground Together","Popo Squall Hammer Air Solo","Popo Squall Hammer Air Together","Blizzard Ground","Blizzard Air","Nana Squall Hammer Ground Together","Nana Squall Hammer Air Together"])
        }],
        [15, {
            name: "Jigglypuff",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs.concat([362,363,364,369,370,371,372]),
            actionNames: this.#commonActionNames.concat(["Rollout","Pound Ground","Pound Air","Rest Ground Left","Rest Air Left","Rest Ground Right","Rest Air Right"])
        }],
        [16, {
            name: "Samus",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs.concat([341,342,346,348,349,350,351,352,353,354,355,356,357]),
            actionNames: this.#commonActionNames.concat(["Bomb Jump Ground","Bomb Jump Air","Charge Shot Ground Fire","Charge Shot Air Fire","Missile Ground","Missile Smash Ground","Missile Air","Missile Smash Air","Screw Attack Ground","Screw Attack Air","Bomb End Ground","Bomb Air","Zair"])
        }],
        [17, {
            name: "Yoshi",
            moveIDs: this.#commonMoveIDs.concat([3]),
            moveNames: this.#commonMoveNames.concat(["Jab 2"]),
            actionIDs: this.#commonActionIDs.concat([346,351,357,361,364,365,366,367,368]),
            actionNames: this.#commonActionNames.concat(["Egg Lay Ground","Egg Lay Air","Egg Roll Ground","Egg Roll Air","Egg Throw Ground","Egg Throw Air","Bomb Ground","Bomb Land","Bomb Air"])
        }],
        [18, {
            name: "Zelda",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs.concat([341,342,345,348,351,354]),
            actionNames: this.#commonActionNames.concat(["Nayru's Love Ground","Nayru's Love Air","Din's Fire Ground","Din's Fire Air","Farore's Wind Ground","Farore's Wind Air"])
        }],
        [19, {
            name: "Sheik",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([344,348,350,353,356,357,359,360]),
            actionNames: this.#commonActionNames.concat(["Needle Storm Ground Fire","Needle Storm Air Fire","Chain Ground","Chain Air","Vanish Ground Disappear","Vanish Ground Reappear","Vanish Air Disappear","Vanish Air Reappear"])
        }],
        [20, {
            name: "Falco",
            moveIDs: this.#commonMoveIDs.concat([3, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([342,345,348,351,355,356,361,366]),
            actionNames: this.#commonActionNames.concat(["Blaster Ground","Blaster Air","Phantasm Ground","Phantasm Air","Fire Bird Ground","Fire Bird Air","Reflector Ground","Reflector Air"])
        }],
        [21, {
            name: "Young Link",
            moveIDs: this.#commonMoveIDs.concat([3, 4, 5]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3", "Rapid Jabs"]),
            actionIDs: this.#commonActionIDs.concat([341,346,349,350,353,358,359,360]),
            actionNames: this.#commonActionNames.concat(["Side Smash 2","Bow Ground Fire","Bow Air Fire","Boomerang Ground Throw","Boomerang Air Throw","Spin Attack Ground","Spin Attack Air","Bomb Ground","Bomb Air","Zair"])
        }],
        [22, {
            name: "Dr. Mario",
            moveIDs: this.#commonMoveIDs.concat([3, 4]),
            moveNames: this.#commonMoveNames.concat(["Jab 2", "Jab 3"]),
            actionIDs: this.#commonActionIDs.concat([343,344,345,346,347,348,349,350]),
            actionNames: this.#commonActionNames.concat(["Megavitamin Ground","Megavitamin Air","Super Sheet Ground","Super Sheet Air","Super Jump Punch Ground","Super Jump Punch Air","Tornado Ground","Tornado Air"])
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
            actionIDs: this.#commonActionIDs.concat([341,342,347,352,354,357,360,361,364,365]),
            actionNames: this.#commonActionNames.concat(["Thunder Jolt Ground","Thunder Jolt Air","Skull Bash Ground Takeoff","Skull Bash Air Takeoff","Quick Attack Ground","Quick Attack Air","Thunder Ground","Thunder Ground Hit","Thunder Air","Thunder Air Hit"])
        }],
        [25, {
            name: "Ganondorf",
            moveIDs: this.#commonMoveIDs,
            moveNames: this.#commonMoveNames,
            actionIDs: this.#commonActionIDs.concat([347,348,350,352,353,354,357,359]),
            actionNames: this.#commonActionNames.concat(["Warlock Punch Ground","Warlock Punch Air","Gerudo Dragon Ground","Gerudo Dragon Air","Dark Dive Ground","Dark Dive Air","Wizard's Foot Ground","Wizard's Foot Air"])
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
        [24, {name: "Big Blue"}],
        [25, {name: "Icicle Mountain"}],
        [26, {name: "Icetop"}],
        [27, {name: "Flat Zone"}],
        [28, {name: "Dream Land N64"}],
        [29, {name: "Yoshi's Island N64"}],
        [30, {name: "Kongo Jungle N64"}],
        [31, {name: "Battlefield"}],
        [32, {name: "Final Destination"}]
    ]);

    static getAllStages () {
        const stages = this.#stageIDs;
        let names = [];
        stages.forEach(s => {
            names.push(this.getStageNameFromID(s));
        });
        return {
            IDs: stages,
            names: names
        }
    }

    static getTournamentLegalStages () {
        const stages = this.#tournamentLegalStageIDs;
        let names = [];
        stages.forEach(s => {
            names.push(this.getStageNameFromID(s));
        });
        return {
            IDs: stages,
            names: names
        }
    }

    static getNonTournamentLegalStages () {
        const stages = this.#nonTournamentLegalStageIDs;
        let names = [];
        stages.forEach(s => {
            names.push(this.getStageNameFromID(s));
        });
        return {
            IDs: stages,
            names: names
        }
    }

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

    static validateTargetTab (newTab, element) {
        // Three uppercase letters (1-10), #, 1-3 numbers
        const isValid = /^[A-Z]{1,10}#\d{1,3}$/.test(newTab.toUpperCase());

        const inputDiv = element;
        inputDiv.classList.remove("is-valid");
        inputDiv.classList.remove("is-invalid");
        
        if (isValid) {
            inputDiv.classList.add("is-valid");
        } else {
            inputDiv.classList.add("is-invalid");
        }
        if (newTab.length === 0) {
            inputDiv.classList.remove("is-invalid");
        }
        return isValid;
    }

}

module.exports = Utility;