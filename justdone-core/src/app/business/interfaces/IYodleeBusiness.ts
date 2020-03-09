import {Promise} from 'mongoose';
import ProviderCreate from 'justdone-system-package/dest/app/model/provider/ProviderCreate';// eslint-disable-line
interface IYodleeBusiness {
    getProviders: (page: number, limit: number, searchTerm?: string) => Promise<any>;
    getProvidersByBankIds: (bankIds: number[]) => Promise<any>;
    createProviders: (providers: ProviderCreate[]) => Promise<boolean>;
    isProvidersExist:(name:string, bankId:number) =>Promise<boolean>;
    getFormUpdateUserOld: (userId: string, providerId: string, bankId: string) => Promise<any>;
    getFormLoginBank: (userId: string, providerId: string) => Promise<any>;
    addBank: (userId: string, providerId: string, loginForm: any) => Promise<any>;
    removeBank: (userId: string, providerAccountId: string) => Promise<any>;
    getPublicKey: () => Promise<any>;
    getStatusConnectingBank: (userId: string, providerAccountId: string) => Promise<any>;
    getBankAccounts: (userId: string, providerAccountId: string, providerId: string) => Promise<any>;
    loadTransactionAndSave: (userId: string, providerAccountId: string) => Promise<any>;
    loadTransactionAndSaveWithConnectBank:(userId: string, connectBankId: string)=> Promise<any>;
    updateBank: (userId: string, type: number, loginForm: any) => Promise<any>;
    getFormUpdatebank: (userId: string, type: number) => Promise<any>;
    removeReconectBank: (userId:string, type:number) => Promise<boolean>;
    yodleeValidateData: (userId: string, track: any, mtp: number) => Promise<any>;
}

export default IYodleeBusiness;
