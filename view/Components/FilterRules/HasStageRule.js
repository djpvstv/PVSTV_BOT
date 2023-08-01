const RuleBase = require("./RuleBase");

class HasStageRule extends RuleBase {
    static ruleName = 'has one or more stages by external ID';
    static optionName = 'Has Stage';
    static flavor = 5;
    static isSingleton = true;
    static dropdownRequiresEventListener = true;

    constructor (option) {
        super(option);
        this.flavorType = 5;
    }

    static getInputDataListHTML (args) {
        let i = 0;
        let dataListHTML = `<li class="dropdown-item" value="-1">Select All</li><li selected><h6 class="dropdown-header">Choose Stage:</h6></selected>`;
        while (i < args.charIDs.length) {
            dataListHTML = `${dataListHTML}
                <li class="dropdown-item" value="${i}">
                    <input type="checkbox">
                    <img src="./img/si_${args.charIDs[i]}.png" width="20" height="20">
                    ${args.charNames[i]}
                </li>
            `;
            i++;
        }
        return dataListHTML;
    }
}

module.exports = HasStageRule;