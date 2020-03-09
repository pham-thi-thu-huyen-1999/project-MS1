"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Accounting {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = model.userId && !model.userId._id ? model.userId.toString() : model.userId;
        this.beginYear = model.beginYear;
        this.endYear = model.endYear;
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
        this.newYear = model.newYear;
        this.subContractor = model.subContractor;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Accounting(item)) : [];
    }
}
Object.seal(Accounting);
exports.default = Accounting;
