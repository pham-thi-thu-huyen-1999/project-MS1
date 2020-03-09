"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeneralJournalUpdate {
    constructor(model) {
        if (!model)
            return;
        if (model.before)
            this.before = model.before;
        if (model.after)
            this.after = model.after;
        this.note = model.note;
        this.month = model.month;
        this.year = model.year;
        this.transactionId = model.transactionId;
        this.extend = model.extend;
        this.isIncludeTax = model.isIncludeTax;
    }
}
Object.seal(GeneralJournalUpdate);
exports.default = GeneralJournalUpdate;
