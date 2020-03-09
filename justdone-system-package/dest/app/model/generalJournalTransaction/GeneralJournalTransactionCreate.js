"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class GeneralJournalTransactionCreate {
    constructor(model) {
        if (!model)
            return;
        this.amount = model.amount;
        this.description = model.description;
        this.isCredit = model.isCredit;
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.typeCrunch = model.typeCrunch;
        this.month = model.month;
        this.year = model.year;
        this.coaId = DataHelper_1.default.handleIdDataModel(model.coaId);
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournalTransactionCreate(item)) : [];
    }
}
Object.seal(GeneralJournalTransactionCreate);
exports.default = GeneralJournalTransactionCreate;
