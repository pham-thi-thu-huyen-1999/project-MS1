import IBaseBusiness from './base/IBaseBusiness';
import ConnectBank from 'justdone-system-package/dest/app/model/connectBank/ConnectBank';
import ConnectBankCreate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankCreate'; // eslint-disable-line
import ConnectBankUpdate from 'justdone-system-package/dest/app/model/connectBank/ConnectBankUpdate'; // eslint-disable-line

interface IConnectBankBusiness extends IBaseBusiness<ConnectBank> {
    find: (userId: string, page: number, limit: number) => Promise<ConnectBank[]>;
    findAll: (userId: string) => Promise<ConnectBank[]>;
    countConnectBank: (userId: string)=> Promise<number>;
    getConnectBank: (userId: string, _id: string)=> Promise<ConnectBank | null>;
    getAccountConnectBanks: (userId: string, providerAccountId: string, providerId?: string) => Promise<ConnectBank[]>;
    getConnectBankByUserIds(originId: string, userIds: string[]): Promise<ConnectBank[]>;
    createConnectBankMultiple(data: any[]): Promise<any>;
    getConnectBankByProviderAccountId: (userId: string, providerAccountId: string)=> Promise<ConnectBank | null>;
    getConnectBankByAccountId:(userId: string, accountId: string)=> Promise<ConnectBank | null>;
    checkConnectBankUserOld: (userId: string, providerAccountId: string, providerId?: string) => Promise<ConnectBank | null>;
    checkConnectBank: (userId: string, providerAccountId: string, providerId?: string )=> Promise<any>;
    createConnectBank: (userId: string, data: ConnectBankCreate) => Promise<ConnectBank>;
    addAcountsConnectBank: (userId: string, connectBankId: string, data: any) => Promise<any>;
    activeConnectBank:(userId: string, connectBankId: string)=> Promise<any>;
    updateConnectBank: (userId: string, _id: string, data: ConnectBankUpdate)=> Promise<any | null>;
    refreshAccounts:(userId: string, providerAccountId: string, providerId: string)=> Promise<any>;
    createConnectBankByUserEmail:(email: string) => Promise<boolean>;
    createManualNumberAccount: (originId:string, data: any) => Promise<any>;
    deleteAccountManual: (_id: string) => Promise<any>;
}

export default IConnectBankBusiness;
