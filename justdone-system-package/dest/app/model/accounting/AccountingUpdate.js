"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class AccountingUpdate {
    constructor(model) {
        if (!model)
            return;
        this.monthlyAccounts = model.monthlyAccounts;
        this.profitLoss = model.profitLoss;
        this.balanceSheet = model.balanceSheet;
        this.basQuarter = model.basQuarter;
        this.basQuarter1 = model.basQuarter1;
        this.basQuarter2 = model.basQuarter2;
        this.basQuarter3 = model.basQuarter3;
        this.basQuarter4 = model.basQuarter4;
        this.taxReturn = model.taxReturn;
        this.annualReport = model.annualReport;
        this.subContractor = model.subContractor;
        DataHelper_1.default.handleDataModelInput(this);
    }
}
Object.seal(AccountingUpdate);
exports.default = AccountingUpdate;
