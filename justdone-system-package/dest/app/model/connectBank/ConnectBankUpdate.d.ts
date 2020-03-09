import IConnectBank from "./interfaces/IConnectBank";
import { BankType, StatusConnectBank } from '../common/CommonType';
import Refreshinfo from './Refreshinfo';
declare class ConnectBankUpdate {
    type?: BankType;
    providerId?: string;
    providerName?: string;
    providerAccountId?: string;
    refreshinfo?: Refreshinfo;
    accountId?: number;
    accountStatus?: string;
    accountNumber?: string;
    accountName?: string;
    currentBalance?: number;
    balance?: number;
    status?: StatusConnectBank;
    accounts?: any;
    favicon?: string;
    isDisabled?: boolean;
    getTransactionAt?: Date;
    disabledPullTransaction?: boolean;
    constructor(model: IConnectBank);
}
export default ConnectBankUpdate;
