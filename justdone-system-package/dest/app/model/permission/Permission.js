"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Permission {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        this.toRole = model.toRole ? model.toRole : null;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Permission(item)) : [];
    }
}
Object.seal(Permission);
exports.default = Permission;
