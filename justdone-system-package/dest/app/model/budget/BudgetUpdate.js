"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BudgetUpdate {
    constructor(model) {
        if (!model)
            return;
        this.amount = model.amount;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new BudgetUpdate(item)) : [];
    }
}
Object.seal(BudgetUpdate);
exports.default = BudgetUpdate;
