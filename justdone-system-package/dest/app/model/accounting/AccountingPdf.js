"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccountingPdf {
    constructor(model) {
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
exports.default = AccountingPdf;
