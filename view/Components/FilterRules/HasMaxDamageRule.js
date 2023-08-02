const DamageRuleBase = require("./DamageRuleBase");

class HasMaxDamageRule extends DamageRuleBase {
    static ruleName = "total damage cannot exceed the value";
    static optionName = "Total Damage <";
    static flavor = 3;

    constructor (option) {
        super(option);
        this.flavorType = 3;
    }
}

module.exports = HasMaxDamageRule;