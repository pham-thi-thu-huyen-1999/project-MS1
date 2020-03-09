"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReceiptCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.fileId = model.fileId;
        this.year = model.year ? model.year : new Date().getFullYear();
        this.month = model.month ? model.month : new Date().getMonth() + 1;
        this.day = model.day ? model.day : new Date().getDate();
        this.total = model.total;
        this.currency = model.currency;
    }
}
Object.seal(ReceiptCreate);
exports.default = ReceiptCreate;
