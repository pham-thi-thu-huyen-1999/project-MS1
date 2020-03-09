export default class JustdoneHelper {
    static login(): Promise<any>;
    static getCrunch(token: string, email: string, day: string, type: string): Promise<any>;
    static getProviders(userId: string): Promise<any>;
    static getFormLoginBank(userId: string, providerId: string): Promise<any>;
    static getProviderById(userId: string, providerId: string): Promise<any>;
    static getStatusConnectingBank(userId: string, providerAccountId: string): Promise<any>;
    static getBankAccounts(userId: string): Promise<any>;
    static getStatement(userId: string, selectAccountId: string, type: string): Promise<any>;
    static getPublicKey(): Promise<any>;
}
