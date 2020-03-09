"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class ClaimPermission {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.product = model.product;
        this.claim = model.claim;
        this.fromRole = model.fromRole;
        if (model.toRole)
            this.toRole = model.toRole;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ClaimPermission(item)) : [];
    }
}
Object.seal(ClaimPermission);
exports.default = ClaimPermission;
