"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserPersonalInfo {
    constructor(model) {
        if (!model)
            return;
        this.postalName = model.postalName;
        this.tfnCode = model.tfnCode;
        this.driverLicense = DataHelper_1.default.handleFileDataModel(model.driverLicense);
        this.phone = model.phone;
        this.birthday = model.birthday;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
    }
}
Object.seal(UserPersonalInfo);
exports.default = UserPersonalInfo;
