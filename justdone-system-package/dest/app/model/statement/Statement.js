"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Statement {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.accountId = model.accountId;
        this.openBalance = model.openBalance;
        this.closeBalance = model.closeBalance;
        this.transactionFailed = model.transactionFailed;
        this.manualStatement = model.manualStatement;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Statement(item)) : [];
    }
}
Object.seal(Statement);
exports.default = Statement;
