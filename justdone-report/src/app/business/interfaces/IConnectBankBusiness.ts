import {Promise} from 'mongoose';
import ConnectBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank';

interface IConnectBankBusiness {
    getConnectBankByAccountId: (userId: string, accountId: string, excludeId?: string)=> Promise<ConnectBank | null>;
    getConnectBankByUserId(userId: string): Promise<ConnectBank[]>;
    getConnectBankByUserIds(originId: string, userIds: string[]): Promise<ConnectBank[]>;
}

export default IConnectBankBusiness;
