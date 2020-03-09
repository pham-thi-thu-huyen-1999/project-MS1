"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FinanceMonth {
    constructor(model) {
        if (!model)
            return;
        this.month = model.month;
        this.income = model.income;
        this.expense = model.expense;
        this.profit = model.profit;
    }
}
Object.seal(FinanceMonth);
exports.default = FinanceMonth;
