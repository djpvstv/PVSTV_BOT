class Utility {
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
}

module.exports = Utility;