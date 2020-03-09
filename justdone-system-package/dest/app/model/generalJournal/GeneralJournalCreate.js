"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeneralJournalCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.code = model.code;
        this.month = model.month;
        this.beginYear = model.beginYear;
        this.productId = model.productId;
        this.note = model.note;
    }
}
Object.seal(GeneralJournalCreate);
exports.default = GeneralJournalCreate;
