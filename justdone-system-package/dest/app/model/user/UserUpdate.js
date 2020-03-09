"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserUpdate {
    constructor(model) {
        if (!model)
            return;
        this.financialStart = model.financialStart;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.gender = model.gender;
        DataHelper_1.default.handleDataModelInput(this);
    }
}
Object.seal(UserUpdate);
exports.default = UserUpdate;
