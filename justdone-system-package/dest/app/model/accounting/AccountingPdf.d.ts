declare class AccountingPdf {
    userId: string;
    accountingType: string;
    productCode: number;
    beginYear: number;
    endYear: number;
    originFilePath: string;
    month?: any;
    originFileId?: any;
    constructor(model: AccountingPdf);
}
export default AccountingPdf;
