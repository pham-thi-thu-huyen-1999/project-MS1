"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrunchUpdate {
    constructor(model) {
        if (!model)
            return;
        this.coaAmounts = model.coaAmounts;
        this.income = model.income;
        this.approvedAt = model.approvedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
        this.startedAt = model.startedAt;
    }
}
Object.seal(CrunchUpdate);
exports.default = CrunchUpdate;
