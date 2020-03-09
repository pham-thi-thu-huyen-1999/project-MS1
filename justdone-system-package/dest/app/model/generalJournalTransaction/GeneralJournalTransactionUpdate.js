"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeneralJournalTransactionUpdate {
    constructor(model) {
        if (!model)
            return;
        this.amount = model.amount;
        this.description = model.description;
        this.isCredit = model.isCredit;
        this.month = model.month;
        this.year = model.year;
        this.coaId = model.year;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournalTransactionUpdate(item)) : [];
    }
}
Object.seal(GeneralJournalTransactionUpdate);
exports.default = GeneralJournalTransactionUpdate;
