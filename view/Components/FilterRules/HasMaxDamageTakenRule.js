const DamageRuleBase = require("./DamageRuleBase");

class HasMaxDamageTakenRule extends DamageRuleBase {
    static ruleName = "Damage taken cannot exceed the value";
    static optionName = "Damage Taken <";
    static flavor = 8;

    constructor (option) {
        super(option);
        this.flavorType = 8;
    }
}

module.exports = HasMaxDamageTakenRule;