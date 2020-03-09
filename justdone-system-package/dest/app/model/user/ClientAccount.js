"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserBusinessInfo_1 = require("./UserBusinessInfo");
const UserPermission_1 = require("./UserPermission");
const DataHelper_1 = require("../../../helpers/DataHelper");
class ClientAccount {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.fullName = model.fullName;
        this.email = model.email;
        this.avatar = DataHelper_1.default.handleFileDataModel(model.avatar);
        this.businessInfo = model.businessInfo && new UserBusinessInfo_1.default(model.businessInfo);
        this.permission = model.permission && new UserPermission_1.default(model.permission);
        this.createdAt = model.createdAt;
        this.lastAccess = model.lastAccess;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ClientAccount(item)) : [];
    }
}
Object.seal(ClientAccount);
exports.default = ClientAccount;
