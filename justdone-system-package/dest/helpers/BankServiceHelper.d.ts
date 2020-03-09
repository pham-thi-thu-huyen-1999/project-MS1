export default class BankServiceHelper {
    static createAccount(userId: string, email: string): Promise<any>;
    static removeBank(userId: string, providerAccountId: string): Promise<string>;
    static addBank(userId: string, providerId: string, loginForm: any): Promise<any>;
    static updateBank(userId: string, providerId: string, loginForm: any): Promise<any>;
    static getProviders(userId: string): Promise<any>;
    static getFormLoginBankByProviderAccountId(userId: any, providerId: any): Promise<any>;
    static getFormLoginBank(userId: string, providerId: string): Promise<any>;
    static getProviderById(userId: string, providerId: string): Promise<any>;
    static getStatusConnectingBank(userId: string, providerAccountId: string): Promise<any>;
    static getBankAccounts(userId: string): Promise<any>;
    static getStatement(userId: string, selectAccountId: string, type: string): Promise<any>;
    static getPublicKey(): Promise<any>;
    static getSytemInfo(): Promise<any>;
    static updateOpenBalanceStatement(data: any): Promise<any>;
    static getStransactionByMonth(data: any): Promise<any>;
    static calcTransactionByClosing(data: any): Promise<any>;
    static updateStatement(data: any): Promise<any>;
}
