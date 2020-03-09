"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataHelper_1 = require("../../../helpers/DataHelper");
class ChartAccountAssignment {
    constructor(model) {
        if (!model)
            return;
        this._id = DataHelper_1.default.handleIdDataModel(model._id);
        this.coa = DataHelper_1.default.handleIdDataModel(model.coa);
        this.product = DataHelper_1.default.handleIdDataModel(model.product);
        this.client = DataHelper_1.default.handleIdDataModel(model.client);
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    static parseArray(list) {
        return list && Array.isArray(list) ? list.map(item => new ChartAccountAssignment(item)) : [];
    }
}
Object.seal(ChartAccountAssignment);
exports.default = ChartAccountAssignment;
