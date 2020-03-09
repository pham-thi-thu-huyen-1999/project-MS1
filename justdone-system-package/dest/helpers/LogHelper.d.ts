declare class LogHelper {
    static logDebug(fileName: any, fnName: any, message: any): void;
    static logInfo(fileName: any, fnName: any, message: any): void;
    static logWarn(fileName: any, fnName: any, message: any): void;
    static logError(fileName: any, fnName: any, message: any): void;
    static notificationService: {
        get(status: number, page: any, limit: any): Promise<any>;
        assign(productName: string, originId: string, actorNumberOneId: string, actorNumberTwoId: string, type: string): Promise<any>;
        invite(productName: string, originId: string, receiverIds: string[], toEmail: string): Promise<any>;
        createUserByRole(productName: string, originId: string, receiverIds: string[], toEmail: string, roleName: string): Promise<any>;
        actionAccount(productName: string, originId: string, receiverIds: string[], email: string, name: string, type: string): Promise<any>;
        create(data: any): Promise<any>;
        createMultipleToReceiverIds(data: any): Promise<any>;
        delete(_id: string): Promise<any>;
    };
    static historyService: {
        assign(productName: string, originId: string, actorNumberOneId: string, actorNumberTwoId: string, claim: number, status: number, type: string): Promise<any>;
        createUserByRole(productName: string, originId: string, toEmail: string, claim: number, roleName: string, status: number): Promise<any>;
        getListSignIn(isChoice: number, claim: number, userIds: any): Promise<any>;
        get(claim: number, status: number, page: any, limit: any): Promise<any>;
        create(data: any): Promise<any>;
        delete(_id: string): Promise<any>;
    };
    static logService: {
        get(system: string, module: string, method: string, status: number, page: any, limit: any): Promise<any>;
        create(data: any): Promise<any>;
        delete(_id: string): Promise<any>;
        getSytemInfo(): Promise<any>;
    };
    static get(url: string): Promise<any>;
    static post(url: string, data?: any): Promise<any>;
    static put(url: string, data: any): Promise<any>;
    static delete(url: string): Promise<any>;
}
export default LogHelper;
