export default class YodleeHelper {
    private static getAccessToken;
    private static getLoginToken;
    static createAccount(userId: string, email: string): Promise<0 | 1>;
    static removeBank(loginName: string, password: string, providerAccountId: string): Promise<any>;
    static addBank(loginName: string, password: string, providerId: string, loginForm: any): Promise<any>;
    static getProviders(loginName: string, password: string): Promise<any>;
    static getListProvider(loginName: string, password: string, options: any): Promise<any>;
    static getProviderById(loginName: string, password: string, providerId: string): Promise<any>;
    static getFormLoginBank(loginName: string, password: string, providerId: string): Promise<any>;
    static getStatusConnectingBank(loginName: string, password: string, providerAccountId: string): Promise<any>;
    static getStatement(loginName: string, password: string, fromDate: any, toDate: any, type: string, accountIdSelected: string, skip?: number, timeLoop?: number): Promise<any>;
    static getPublicKey(timeLoop?: number): any;
    static getFormByProviderId(loginName: string, password: string, providerId: string): Promise<any>;
    static updateBank(loginName: string, password: string, providerAccountId: string, loginForm: any): Promise<any>;
    static getBankAccounts(loginName: string, password: string): Promise<any>;
}
