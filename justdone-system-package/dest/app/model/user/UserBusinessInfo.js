"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserBusinessInfo {
    constructor(model) {
        if (!model)
            return;
        this.abnCode = model.abnCode;
        this.entityName = model.entityName;
        this.entityType = model.entityType;
        this.type = model.type;
        this.address = model.address;
        this.avatar = DataHelper_1.default.handleFileDataModel(model.avatar);
    }
}
Object.seal(UserBusinessInfo);
exports.default = UserBusinessInfo;
