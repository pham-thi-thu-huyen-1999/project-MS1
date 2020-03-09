"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
const GeneralJournalItemExtend_1 = require("./GeneralJournalItemExtend");
class GeneralJournalItem {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.gjId = DataHelper_1.default.handleIdDataModel(model.gjId);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.evidenced = DataHelper_1.default.handleIdDataModel(model.evidenced);
        this.transactionId = DataHelper_1.default.handleIdDataModel(model.transactionId);
        if (model.before && model.before.typeCrunch)
            this.before = model.before;
        this.after = model.after;
        if (model.extend)
            this.extend = new GeneralJournalItemExtend_1.default(model.extend);
        this.type = model.type;
        this.month = model.month;
        this.year = model.year;
        this.note = model.note;
        this.createdAt = model.createdAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournalItem(item)) : [];
    }
}
Object.seal(GeneralJournalItem);
exports.default = GeneralJournalItem;
