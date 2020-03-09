import IConnectBank from "./interfaces/IConnectBank";
import { BankType, StatusConnectBank } from '../common/CommonType';
import Refreshinfo from './Refreshinfo';
declare class ConnectBankCreate {
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
    constructor(model: IConnectBank);
}
export default ConnectBankCreate;
