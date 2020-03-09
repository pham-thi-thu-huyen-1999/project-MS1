"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatementUpdate {
    constructor(model) {
        if (!model)
            return;
        this.closeBalance = model.openBalance;
        this.closeBalance = model.closeBalance;
        this.transactionFailed = model.transactionFailed;
        this.manualStatement = model.manualStatement;
    }
}
Object.seal(StatementUpdate);
exports.default = StatementUpdate;
