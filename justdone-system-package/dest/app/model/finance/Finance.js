"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Finance {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = model.userId && !model.userId._id ? model.userId.toString() : model.userId;
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
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Finance(item)) : [];
    }
}
Object.seal(Finance);
exports.default = Finance;
