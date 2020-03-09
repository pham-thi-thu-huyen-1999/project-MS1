"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralJournalItemExtend_1 = require("./GeneralJournalItemExtend");
class GeneralJournalItemCreate {
    constructor(model) {
        if (!model)
            return;
        this.userId = model.userId;
        this.evidenced = model.evidenced;
        this.transactionId = model.transactionId;
        this.gjId = model.gjId;
        this.type = model.type;
        if (model.before && model.before.typeCrunch)
            this.before = model.before;
        this.after = model.after;
        if (model.extend)
            this.extend = new GeneralJournalItemExtend_1.default(model.extend);
        this.isIncludeTax = model.isIncludeTax;
        this.month = model.month;
        this.year = model.year;
        this.note = model.note;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournalItemCreate(item)) : [];
    }
}
Object.seal(GeneralJournalItemCreate);
exports.default = GeneralJournalItemCreate;
