import {BankType} from '../common/CommonType';

class UserConnectedBank {
    type?: BankType;
    providerId?: string;
    connectedId?: string;
    connectedName?: string;
    currentBalance?: number;
    bankId ?: string;
    accounts?: any;
    disabledPullTransaction?: boolean;
    isReconnectBank?: boolean;

    constructor(model: UserConnectedBank) {
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

    static parseArray(list: UserConnectedBank[]): UserConnectedBank[] {
        return list && Array.isArray(list) ? list.map(item => new UserConnectedBank(item)) : [];
    }
}

Object.seal(UserConnectedBank);
export default UserConnectedBank;
