import UserConnectedBank from 'justdone-system-package/dest/app/model/user/UserConnectedBank';// eslint-disable-line
import {BankType} from 'justdone-system-package/dest/app/model/common/CommonType';// eslint-disable-line
interface IYodleeBusiness {
    createAccount: (userId: string, email: string) => any;
    getProviders: (userId: string) => any;
    getFormLoginBank: (userId: string, providerId: string) => any;
    addBank: (userId: string, providerId: string, loginForm: any) => Promise<any>;
    removeBank: (userId: string, providerAccountId: string) => any;
    getStatusConnectingBank: (userId: string, providerAccountId: string) => any;
    getStatementOneYear: (userId: string, providerAccountId: string, type: number) => Promise<any>;
    getTransactionAllClient();
    getTrasactionOneClient(userId: string, providerAccountId: string, type: number);
    getProviderById: (userId: string, providerId: string) => Promise<any>;
    getBankAccounts: (userId: string) => Promise<any>;
    getAllProviders: (userId: string) => any;
    loadStatementAndSave: (userId: string, providerAccountId: string, type: number) => any;
    loadStatementAndSaveAll: (userIds: string[]) => any;
    cronTransactionAllClient: () => any;
    updateBank: (userId: string, providerAccountId: string, loginForm: any) => Promise<any>;
    updateOpenBalaceManual: (userId: string, accountId:string, month: number, year: number, type: number, openBalance: number) => Promise<boolean>;
    updateOpenBalaceMultiBank: (userId: string, accountId:string, month: number, year: number, type: number, openBalance: number) => Promise<any>;
    calcAndUpdateStatementWithClosing(transactions: any[], closingBalance: number, statementId: string);
    getPublicKey: () => Promise<any>;
    cronWithUserId: (userId: string) => any;
    cronWithUserIdCustom: (userId: string, month: number) => any;
    markTransactionFixDuplicate: (userId: string, month: number, year:number, accountId:string, type: BankType) => Promise<any>;
    undeleteTransaction: (userId: string, month: number, year:number, accountId:string, type: BankType) => Promise<any>;
    syncTransactionWhenFixDuplicate: (userId: string, month: number, year: number, accountId: string, type: BankType) => Promise<any>;
    createTransactionFixData: () => any;
    getTransactionsForTesting(userId: string, accountIdSelected: string, typeBank: number, month: number, year: number);
}

export default IYodleeBusiness;
