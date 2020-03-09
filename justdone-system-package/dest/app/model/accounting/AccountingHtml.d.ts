declare class AccountingHtml {
    userId: string;
    productCode: number;
    accountingType: string;
    beginYear: number;
    endYear: number;
    originFilePath: string;
    htmlString: string;
    month?: number;
    constructor(model: AccountingHtml);
}
export default AccountingHtml;
