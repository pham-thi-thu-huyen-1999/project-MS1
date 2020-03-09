"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class BalanceSheetReport {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.csv = DataHelper_1.default.handleIdDataModel(model.csv);
        this.month = model.month;
        this.year = model.year;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new BalanceSheetReport(item)) : [];
    }
}
Object.seal(BalanceSheetReport);
exports.default = BalanceSheetReport;
