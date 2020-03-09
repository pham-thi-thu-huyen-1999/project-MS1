"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Transaction {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.amount = model.amount;
        this.accountId = model.accountId;
        this.baseType = model.baseType;
        this.bankId = model.bankId;
        this.category = model.category;
        this.categoryType = model.categoryType;
        this.categoryId = model.categoryId;
        this.categorySource = model.categorySource;
        this.description = model.description;
        this.date = new Date(model.date);
        this.highLevelCategoryId = model.highLevelCategoryId;
        this.isManual = model.isManual;
        this.isWarningDuplicate = model.isWarningDuplicate;
        this.duplicateId = model.duplicateId;
        this.merchant = model.merchant;
        this.postDate = model.postDate && new Date(model.postDate);
        this.runningBalance = model.runningBalance;
        this.status = model.status;
        this.transactionId = model.transactionId;
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.type = model.type;
        this.typeCrunch = model.typeCrunch;
        this.month = model.month;
        this.year = model.year;
        this.coaId = DataHelper_1.default.handleIdDataModel(model.coaId);
        this.index = model.index;
        this.conditions = model.conditions;
        this.manualTransaction = model.manualTransaction;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Transaction(item)) : [];
    }
    static parseObjectByCrunch(list) {
        let result = list.map(item => new Transaction(item));
        let data = {
            totalBalance: 0,
            totalData: 0
        };
        data.totalData = result.length;
        result.forEach(item => {
            if (item.baseType === 'DEBIT') {
                data.totalBalance -= item.amount.amount;
            }
            else {
                data.totalBalance += item.amount.amount;
            }
        });
        return data;
    }
}
Object.seal(Transaction);
exports.default = Transaction;
