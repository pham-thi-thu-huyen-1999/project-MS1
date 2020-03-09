"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Budget {
    constructor(model) {
        if (!model)
            return;
        if (model._id)
            this._id = model._id;
        this.userId = model.userId;
        this.year = model.year;
        this.month = model.month;
        this.coaId = model.coaId;
        this.amount = model.amount;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Budget(item)) : [];
    }
}
Object.seal(Budget);
exports.default = Budget;
