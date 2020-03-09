class AccountingHtml {
    userId: string;
    productCode: number;
    accountingType: string;
    beginYear: number;
    endYear: number;
    originFilePath: string;
    htmlString: string;
    month?: number;

    constructor(model: AccountingHtml) {
        if (!model)
            return;

        this.userId = model.userId;
        this.productCode = model.productCode;
        this.accountingType = model.accountingType;
        this.month = model.month;
        this.beginYear = model.beginYear;
        this.endYear = model.endYear;
        this.htmlString = model.htmlString;
        this.originFilePath = model.originFilePath;
    }
}

Object.seal(AccountingHtml);
export default AccountingHtml;
