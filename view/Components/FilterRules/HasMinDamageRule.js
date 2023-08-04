const DamageRuleBase = require("./DamageRuleBase");

class HasMinDamageRule extends DamageRuleBase {
    static ruleName = "total damage cannot be under the value";
    static optionName = "Total Damage >";
    static flavor = 2;

    constructor (option) {
        super(option);
        this.flavorType = 2;
    }
}

module.exports = HasMinDamageRule;