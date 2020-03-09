"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class Crunch {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.month = model.month;
        this.year = model.year;
        this.type = model.type;
        this.accountId = model.accountId;
        this.coaAmounts = model.coaAmounts;
        this.income = model.income;
        this.approvedAt = model.approvedAt;
        this.completedAt = model.completedAt;
        this.amendedAt = model.amendedAt;
        this.startedAt = model.startedAt;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new Crunch(item)) : [];
    }
}
Object.seal(Crunch);
exports.default = Crunch;
