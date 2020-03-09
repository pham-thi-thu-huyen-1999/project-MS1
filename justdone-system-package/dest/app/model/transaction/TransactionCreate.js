"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransactionCreate {
    constructor(model) {
        if (!model)
            return;
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
        if (model.isWarningDuplicate)
            this.isWarningDuplicate = model.isWarningDuplicate;
        if (model.duplicateId)
            this.duplicateId = model.duplicateId;
        this.merchant = model.merchant;
        this.postDate = model.postDate && new Date(model.postDate);
        this.runningBalance = model.runningBalance ? model.runningBalance : null;
        this.status = model.status;
        this.transactionId = model.transactionId;
        this.userId = model.userId;
        this.type = model.type;
        this.typeCrunch = model.typeCrunch;
        this.month = model.month;
        this.year = model.year;
        this.index = model.index;
        this.manualTransaction = model.manualTransaction;
    }
}
Object.seal(TransactionCreate);
exports.default = TransactionCreate;
