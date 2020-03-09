"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class GeneralJournal {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.productId = DataHelper_1.default.handleIdDataModel(model.productId);
        this.code = model.code;
        this.note = model.note;
        this.month = model.month;
        this.beginYear = model.beginYear;
        this.createdAt = model.createdAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new GeneralJournal(item)) : [];
    }
}
Object.seal(GeneralJournal);
exports.default = GeneralJournal;
