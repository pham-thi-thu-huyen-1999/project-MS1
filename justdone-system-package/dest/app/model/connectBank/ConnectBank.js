"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
const Refreshinfo_1 = require("./Refreshinfo");
class ConnectBank {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.type = model.type;
        this.providerId = model.providerId;
        this.providerName = model.providerName;
        this.providerAccountId = model.providerAccountId;
        this.refreshinfo = model.refreshinfo && new Refreshinfo_1.default(model.refreshinfo);
        this.accountId = model.accountId;
        this.accountStatus = model.accountStatus;
        this.accountNumber = model.accountNumber;
        this.accountName = model.accountName;
        this.currentBalance = model.currentBalance;
        this.balance = model.balance;
        this.status = model.status;
        this.accounts = model.accounts;
        this.favicon = model.favicon;
        this.isDisabled = model.isDisabled;
        this.disabledPullTransaction = model.disabledPullTransaction;
        this.getTransactionAt = model.getTransactionAt;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ConnectBank(item)) : [];
    }
}
Object.seal(ConnectBank);
exports.default = ConnectBank;
