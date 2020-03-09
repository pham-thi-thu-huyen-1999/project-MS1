import IConnectBank from './interfaces/IConnectBank'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';
import {StatusConnectBank, BankType} from '../common/CommonType';
import Refreshinfo from './Refreshinfo';

class ConnectBank {
    _id: string;
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
    currentBalance: number;
    balance: number;
    status: StatusConnectBank;
    accounts?: any;
    favicon?: string;
    isDisabled: boolean;
    disabledPullTransaction: boolean;
    getTransactionAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IConnectBank) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
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
        this.disabledPullTransaction = model.disabledPullTransaction;
        this.getTransactionAt = model.getTransactionAt;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IConnectBank[]): ConnectBank[] {
        return list && Array.isArray(list) ? list.map(item => new ConnectBank(item)) : [];
    }
}

Object.seal(ConnectBank);
export default ConnectBank;
