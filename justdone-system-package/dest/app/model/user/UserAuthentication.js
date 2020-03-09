"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = require("./UserToken");
const UserProfile_1 = require("../../model/user/UserProfile");
const UserPermission_1 = require("../../model/user/UserPermission");
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserAuthentication {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.profile = new UserProfile_1.default(model);
        this.permission = model.permission && new UserPermission_1.default(model.permission);
        this.token = model.token && new UserToken_1.default(model.token);
    }
}
Object.seal(UserAuthentication);
exports.default = UserAuthentication;
