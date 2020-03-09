"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class FinanceUpdate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.financialYear = model.financialYear;
        this.currentBas = model.currentBas;
        this.currentProfit = model.currentProfit;
        this.grossIncome = model.grossIncome;
        this.expenseYear = model.expenseYear;
        this.incomeTax = model.incomeTax;
        this.integratedClient = model.integratedClient;
        this.estimatedTax = model.estimatedTax;
        this.putAsidedBas = model.putAsidedBas;
        this.monthlyDetail = model.monthlyDetail;
        DataHelper_1.default.handleDataModelInput(this);
    }
}
Object.seal(FinanceUpdate);
exports.default = FinanceUpdate;
