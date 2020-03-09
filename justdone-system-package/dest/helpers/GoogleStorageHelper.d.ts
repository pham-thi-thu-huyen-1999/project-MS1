export default class GoogleStorageHelper {
    private static gscClient;
    static uploadFile(localFile: string, prefix: string, fileName: string, bucketName: string): Promise<any>;
    static uploadCrunch(localFile: string, prefix: string, fileName: string, bucketName: string): Promise<any>;
    static moveFile(sourceFile: string, newPath: string, bucketName: string): Promise<any>;
    static deleteFile(filePath: string, bucketName: string): Promise<any>;
    static getListFile(prefix: string, bucketName: string): Promise<any>;
    static getProductPrefix(productId: string): string;
    static getAccountingPrefix(ownerId: string, productCode: number, year: string): string;
    static getProfilePrefix(ownerId: string, productCode: number): string;
    static getBillingPrefix(ownerId: string, productCode: number, year: string): string;
    static getTransactionPrefix(ownerId: string, productCode: number, year: string, type: string): string;
    static getBalanceSheetPrefix(ownerId: string, productCode: number, year: string): string;
    static getReceiptPrefix(ownerId: string, productCode: number, year: string): string;
    static getEvidencedPrefix(ownerId: string, productCode: number, year: string, month: number): string;
}
