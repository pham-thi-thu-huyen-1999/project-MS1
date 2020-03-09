import IBaseModel from '../../common/interfaces/IBaseModel';
import { BankType, StatusConnectBank } from '../../common/CommonType';
import Refreshinfo from '../Refreshinfo';
interface IConnectBank extends IBaseModel {
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
    getTransactionAt?: Date;
    disabledPullTransaction: boolean;
}
export default IConnectBank;
