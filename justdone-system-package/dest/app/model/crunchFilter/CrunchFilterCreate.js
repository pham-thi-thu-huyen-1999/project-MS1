"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrunchCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.bankId = model.bankId;
        this.accountType = model.accountType;
        this.isGlobal = model.isGlobal;
        this.groupId = model.groupId;
        this.baseType = model.baseType;
        this.groupName = model.groupName;
        this.coaId = model.coaId;
        this.coaName = model.coaName;
        this.used = model.used;
        this.conditions = model.conditions;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}
Object.seal(CrunchCreate);
exports.default = CrunchCreate;
