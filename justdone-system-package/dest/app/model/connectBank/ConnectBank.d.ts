import IConnectBank from './interfaces/IConnectBank';
import { StatusConnectBank, BankType } from '../common/CommonType';
import Refreshinfo from './Refreshinfo';
declare class ConnectBank {
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
    constructor(model: IConnectBank);
    static parseArray(list: IConnectBank[]): ConnectBank[];
}
export default ConnectBank;
