"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class ChartAccount {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.code = model.code;
        this.name = model.name;
        this.usageBudget = model.usageBudget;
        this.searchTerm = model.searchTerm;
        this.description = model.description;
        this.country = model.country;
        this.gstType = model.gstType;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ChartAccount(item)) : [];
    }
}
Object.seal(ChartAccount);
exports.default = ChartAccount;
