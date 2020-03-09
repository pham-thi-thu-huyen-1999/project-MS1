import IConnectBank from "./interfaces/IConnectBank"; // eslint-disable-line
import {BankType, StatusConnectBank} from '../common/CommonType';
import Refreshinfo from './Refreshinfo';

class ConnectBankCreate {
    userId: any;
    type?: BankType;
    providerId: string;
    providerName: string;
    providerAccountId: string;
    refreshinfo?: Refreshinfo;
    accountId?: number;
    accountStatus?: string;
    accountNumber?: string;
    accountName?: string;
    currentBalance?: number;
    balance?: number;
    accounts?: any;
    status: StatusConnectBank;
    favicon?: string;
    isDisabled?: boolean;
    getTransactionAt?: Date;
    disabledPullTransaction?: boolean;

    constructor(model: IConnectBank) {
        if (!model)
            return;

        this.userId = model.userId;
        this.type = model.type;
        this.providerId = model.providerId;
        this.providerName = model.providerName;
        this.providerAccountId = model.providerAccountId;
        this.refreshinfo = model.refreshinfo && new Refreshinfo(model.refreshinfo);
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

Object.seal(ConnectBankCreate);
export default ConnectBankCreate;
