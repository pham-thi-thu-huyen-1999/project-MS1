"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class CrunchFilter {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
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
Object.seal(CrunchFilter);
exports.default = CrunchFilter;
