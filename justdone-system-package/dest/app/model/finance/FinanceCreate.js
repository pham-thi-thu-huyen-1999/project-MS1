"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FinanceCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.financialYear = model.financialYear;
    }
}
Object.seal(FinanceCreate);
exports.default = FinanceCreate;
