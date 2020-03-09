"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InvitationToken_1 = require("./InvitationToken");
const DataHelper_1 = require("../../../helpers/DataHelper");
class Invitation {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.fullName;
        this.email = model.email;
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.productId = DataHelper_1.default.handleIdDataModel(model.productId);
        this.sendAt = model.sendAt;
        this.token = model.token && new InvitationToken_1.default(model.token);
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Invitation(item)) : [];
    }
}
Object.seal(Invitation);
exports.default = Invitation;
