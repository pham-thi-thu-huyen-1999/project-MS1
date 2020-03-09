"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrunchStatus {
    constructor(model) {
        if (!model)
            return;
        this.type = model.type;
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.approvedAt = model.approvedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
        this.startedAt = model.startedAt;
        this.isNoTransaction = model.isNoTransaction;
    }
}
Object.seal(CrunchStatus);
exports.default = CrunchStatus;
