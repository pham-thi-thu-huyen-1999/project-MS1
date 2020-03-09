"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChartAccount_1 = require("../chartAccount/ChartAccount");
const DataHelper_1 = require("../../../helpers/DataHelper");
class GroupExpense {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.userId = DataHelper_1.default.handleIdDataModel(model.userId);
        this.parent = DataHelper_1.default.handleIdDataModel(model.parent);
        this.code = model.code;
        this.name = model.name;
        this.searchTerm = model.searchTerm;
        this.coas = model.coas && Array.isArray(model.coas) ? ChartAccount_1.default.parseArray(model.coas) : [];
        this.order = model.order;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new GroupExpense(item)) : [];
    }
}
Object.seal(GroupExpense);
exports.default = GroupExpense;
