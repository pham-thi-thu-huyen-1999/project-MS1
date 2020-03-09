"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class UserChartAccountOpeningBalance {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.dataCoaOpeningBalance = model.dataCoaOpeningBalance && Array.isArray(model.dataCoaOpeningBalance) ? model.dataCoaOpeningBalance.map(item => DataHelper_1.default.handleIdDataModel(item.coaId._id)) : [];
        this.month = model.month;
        this.year = model.year;
    }
}
Object.seal(UserChartAccountOpeningBalance);
exports.default = UserChartAccountOpeningBalance;
