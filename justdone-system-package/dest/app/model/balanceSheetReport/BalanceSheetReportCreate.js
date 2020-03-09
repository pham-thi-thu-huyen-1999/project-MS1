"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BalanceSheetReportCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.csv = model.csv;
        this.month = model.month;
        this.year = model.year;
    }
}
Object.seal(BalanceSheetReportCreate);
exports.default = BalanceSheetReportCreate;
