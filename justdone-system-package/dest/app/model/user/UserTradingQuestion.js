"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserTradingQuestion {
    constructor(model) {
        if (!model)
            return;
        this.mobiles = model.mobiles;
        this.motorVehicle = model.motorVehicle;
        this.vehicleAttachments = model.vehicleAttachments && Array.isArray(model.vehicleAttachments) ? model.vehicleAttachments.map(attach => DataHelper_1.default.handleFileDataModel(attach)) : [];
        this.utility = model.utility;
        DataHelper_1.default.handleDataModelInput(this);
    }
}
Object.seal(UserTradingQuestion);
exports.default = UserTradingQuestion;
