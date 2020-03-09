"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserProfile {
    constructor(model) {
        if (!model)
            return;
        this.email = model.email;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.gender = model.gender;
        this.avatar = DataHelper_1.default.handleFileDataModel(model.avatar);
        this.status = model.status;
    }
}
Object.seal(UserProfile);
exports.default = UserProfile;
