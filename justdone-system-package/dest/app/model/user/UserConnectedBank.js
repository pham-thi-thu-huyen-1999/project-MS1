"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserConnectedBank {
    constructor(model) {
        if (!model)
            return;
        this.type = model.type;
        this.providerId = model.providerId;
        this.connectedId = model.connectedId;
        this.connectedName = model.connectedName;
        this.currentBalance = model.currentBalance;
        this.accounts = model.accounts;
        this.bankId = model.bankId;
        this.disabledPullTransaction = model.disabledPullTransaction;
        if (model.isReconnectBank)
            this.isReconnectBank = model.isReconnectBank;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new UserConnectedBank(item)) : [];
    }
}
Object.seal(UserConnectedBank);
exports.default = UserConnectedBank;
