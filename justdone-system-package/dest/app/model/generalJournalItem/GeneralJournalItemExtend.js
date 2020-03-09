"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeneralJournalItemExtend {
    constructor(model) {
        if (!model)
            return;
        this.amount = model.amount;
        this.description = model.description;
        this.isCredit = model.isCredit;
    }
}
Object.seal(GeneralJournalItemExtend);
exports.default = GeneralJournalItemExtend;
