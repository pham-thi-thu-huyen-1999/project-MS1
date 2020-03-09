import { BankType } from '../common/CommonType';
declare class UserConnectedBank {
    type?: BankType;
    providerId?: string;
    connectedId?: string;
    connectedName?: string;
    currentBalance?: number;
    bankId?: string;
    accounts?: any;
    disabledPullTransaction?: boolean;
    isReconnectBank?: boolean;
    constructor(model: UserConnectedBank);
    static parseArray(list: UserConnectedBank[]): UserConnectedBank[];
}
export default UserConnectedBank;
