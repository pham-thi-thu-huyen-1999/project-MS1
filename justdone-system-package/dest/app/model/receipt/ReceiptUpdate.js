"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class ReceiptUpdate {
    constructor(model) {
        if (!model)
            return;
        this.year = model.year;
        this.month = model.month;
        this.day = model.day;
        this.total = model.total;
        this.fileId = model.fileId;
        this.currency = model.currency;
        DataHelper_1.default.handleDataModelInput(this);
    }
}
Object.seal(ReceiptUpdate);
exports.default = ReceiptUpdate;
