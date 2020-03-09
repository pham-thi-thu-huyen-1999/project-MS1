"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsageBudgetCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.coaId = model.coaId;
        this.beginYear = model.beginYear;
        this.percentUsage = model.percentUsage;
    }
}
Object.seal(UsageBudgetCreate);
exports.default = UsageBudgetCreate;
