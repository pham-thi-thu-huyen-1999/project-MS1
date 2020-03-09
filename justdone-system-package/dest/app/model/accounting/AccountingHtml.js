"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccountingHtml {
    constructor(model) {
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
exports.default = AccountingHtml;
