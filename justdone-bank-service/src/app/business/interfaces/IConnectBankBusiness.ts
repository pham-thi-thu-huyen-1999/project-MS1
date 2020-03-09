import IBaseBusiness from './base/IBaseBusiness';
import ConnectBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank';
import ConnectBankUpdate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankUpdate'; // eslint-disable-line

interface IConnectBankBusiness extends IBaseBusiness<ConnectBank> {
    // find: (userId: string, page: number, limit: number) => Promise<ConnectBank[]>;
    findAllConnectBank: (userIds?:string[])=> Promise<ConnectBank[]>;
    getConnectBanksByUserId: (userId: string)=> Promise<ConnectBank[]>;
    getConnectBankByAccountId: (userId: string, accountId: string)=> Promise<ConnectBank | null>;
    updateConnectedBanks: (_id: string, data: ConnectBankUpdate) => Promise<any | null>;
}

export default IConnectBankBusiness;
