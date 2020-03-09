"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserPermission_1 = require("./UserPermission");
const DataHelper_1 = require("../../../helpers/DataHelper");
class ManagerAccount {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.fullName = model.fullName;
        this.email = model.email;
        this.avatar = DataHelper_1.default.handleFileDataModel(model.avatar);
        this.permission = model.permission && new UserPermission_1.default(model.permission);
        this.createdAt = model.createdAt;
        this.lastAccess = model.lastAccess;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ManagerAccount(item)) : [];
    }
}
Object.seal(ManagerAccount);
exports.default = ManagerAccount;
