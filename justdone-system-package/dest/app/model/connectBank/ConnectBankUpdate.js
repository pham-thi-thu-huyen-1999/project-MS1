"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectBankUpdate {
    constructor(model) {
        if (!model)
            return;
        if (model.type)
            this.type = model.type;
        this.providerId = model.providerId;
        this.providerName = model.providerName;
        this.providerAccountId = model.providerAccountId;
        this.refreshinfo = model.refreshinfo;
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
        this.getTransactionAt = model.getTransactionAt;
        this.disabledPullTransaction = model.disabledPullTransaction;
    }
}
Object.seal(ConnectBankUpdate);
exports.default = ConnectBankUpdate;
