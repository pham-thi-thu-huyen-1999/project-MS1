"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserProfile_1 = require("../../model/user/UserProfile");
const UserPermission_1 = require("../../model/user/UserPermission");
const DataHelper_1 = require("../../../helpers/DataHelper");
class ClientInfo {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.profile = new UserProfile_1.default(model);
        this.permission = model.permission && new UserPermission_1.default(model.permission);
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ClientInfo(item)) : [];
    }
}
Object.seal(ClientInfo);
exports.default = ClientInfo;
