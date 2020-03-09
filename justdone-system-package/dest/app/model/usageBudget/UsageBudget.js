"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsageBudget {
    constructor(model) {
        if (!model)
            return;
        this._id = model._id && model._id.toString();
        this.userId = model.userId;
        this.coaId = model.coaId;
        this.beginYear = model.beginYear;
        this.percentUsage = model.percentUsage;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new UsageBudget(item)) : [];
    }
}
Object.seal(UsageBudget);
exports.default = UsageBudget;
