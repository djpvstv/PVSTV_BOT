const DamageRuleBase = require("./DamageRuleBase");

class HasMaxPercentStartRule extends DamageRuleBase {
    static ruleName = "Combo must start below % value";
    static optionName = "Combo starts before";
    static flavor = 9;

    constructor (option) {
        super(option);
        this.flavorType = 9;
    }
}

module.exports = HasMaxPercentStartRule;