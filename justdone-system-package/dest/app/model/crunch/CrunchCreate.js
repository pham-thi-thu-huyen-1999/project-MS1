"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrunchCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.accountId = model.accountId;
        this.coaAmounts = model.coaAmounts;
        this.income = model.income;
        this.approvedAt = model.approvedAt;
        this.startedAt = model.startedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
    }
}
Object.seal(CrunchCreate);
exports.default = CrunchCreate;
