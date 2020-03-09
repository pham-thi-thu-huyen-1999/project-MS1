"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatementCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.type = model.type;
        this.month = model.month;
        this.year = model.year;
        this.openBalance = model.openBalance;
        this.closeBalance = model.closeBalance;
        this.accountId = model.accountId;
        this.transactionFailed = model.transactionFailed;
        this.manualStatement = model.manualStatement;
    }
}
Object.seal(StatementCreate);
exports.default = StatementCreate;
