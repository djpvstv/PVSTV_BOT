const StringRuleBase = require("./StringRuleBase");

class HasActionIDStringRule extends StringRuleBase {
    static ruleName = "combo must include the following string of moves";
    static optionName = "Has Action String";
    static dependsOnActionStates = true;
    static flavor = 6;

    constructor (option) {
        super(option);
        this.flavorType = 6;
    }
}

module.exports = HasActionIDStringRule;