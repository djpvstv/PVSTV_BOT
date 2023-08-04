const StringRuleBase = require("./StringRuleBase");

class ExcludeActionIDStringRule extends StringRuleBase {
    static ruleName = "combo must not include the following string of moves";
    static optionName = "Exclude Action String";
    static dependsOnActionStates = true;
    static flavor = 7;

    constructor (option) {
        super(option);
        this.flavorType = 7;
    }
}

module.exports = ExcludeActionIDStringRule;