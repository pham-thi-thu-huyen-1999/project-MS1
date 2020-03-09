"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserPermission {
    constructor(model) {
        if (!model)
            return;
        this.product = DataHelper_1.default.handleIdDataModel(model.product);
        this.role = DataHelper_1.default.handleIdDataModel(model.role);
        this.managers = model.managers && Array.isArray(model.managers) ? model.managers.map(manager => DataHelper_1.default.handleIdDataModel(manager)) : [];
    }
}
Object.seal(UserPermission);
exports.default = UserPermission;
