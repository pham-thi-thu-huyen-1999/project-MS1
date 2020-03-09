class AccountingPdf {
    userId: string;
    accountingType: string;
    productCode:number;
    beginYear: number;
    endYear: number;
    originFilePath: string;
    month?: any;
    originFileId?: any;

    constructor(model: AccountingPdf) {
        if (!model)
            return;

        this.userId = model.userId;
        this.accountingType = model.accountingType;
        this.productCode = model.productCode;
        this.month = model.month;
        this.beginYear = model.beginYear;
        this.originFilePath = model.originFilePath;
        this.endYear = model.endYear;
        this.originFileId = model.originFileId;
    }
}

Object.seal(AccountingPdf);
export default AccountingPdf;
